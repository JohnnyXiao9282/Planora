import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

const API = "http://localhost:5050";

interface Experience {
  title: string;
  company: string;
  dates: string;
  description: string;
}
interface Project {
  name: string;
  url: string;
  description: string;
}
interface ProfileData {
  intro: string;
  linkedin_url: string;
  experience: Experience[];
  projects: Project[];
  skills: string[];
}

const EMPTY: ProfileData = {
  intro: "",
  linkedin_url: "",
  experience: [],
  projects: [],
  skills: [],
};
const STEPS = [
  "Self Introduction",
  "Experience",
  "Projects",
  "Skills",
] as const;
type SectionKey = "intro" | "experience" | "projects" | "skills";
const STEP_KEYS: SectionKey[] = ["intro", "experience", "projects", "skills"];

const emptyExp = (): Experience => ({
  title: "",
  company: "",
  dates: "",
  description: "",
});
const emptyProj = (): Project => ({ name: "", url: "", description: "" });

const splitSkills = (text: string) =>
  text
    .split(/[,;\n•·|]/)
    .map((s) => s.replace(/^\s*[-*]\s*/, "").trim())
    .filter((s) => s && s.length <= 60);

const mergeSkills = (a: string[], b: string[]) => {
  const seen = new Set(a.map((s) => s.toLowerCase()));
  return [
    ...a,
    ...b.filter((s) => !seen.has(s.toLowerCase()) && seen.add(s.toLowerCase())),
  ];
};

const withHttp = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

const sectionDone = (p: ProfileData, key: SectionKey) =>
  key === "intro" ? !!p.intro.trim() : p[key].length > 0;

async function readClipboard(): Promise<string | null> {
  try {
    return await navigator.clipboard.readText();
  } catch {
    return null; // permission denied / unsupported
  }
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData>(EMPTY);
  const [savedJson, setSavedJson] = useState(JSON.stringify(EMPTY));
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<{
    profile: ProfileData;
    method: string;
  } | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const importRef = useRef<HTMLTextAreaElement>(null);

  const dirty = useMemo(
    () => JSON.stringify(profile) !== savedJson,
    [profile, savedJson]
  );

  useEffect(() => {
    fetch(`${API}/profile`, { credentials: "include" })
      .then((r) => r.json())
      .then((data: ProfileData) => {
        const p = { ...EMPTY, ...data };
        setProfile(p);
        setSavedJson(JSON.stringify(p));
      })
      .catch(() =>
        setStatus("Couldn't load your profile. Is the backend running?")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Auto-save shortly after the user stops typing, so the chat advisor
  // always sees the latest profile without needing to click Save.
  const latest = useRef({ profile, dirty });
  latest.current = { profile, dirty };

  useEffect(() => {
    if (loading || !dirty) return;
    const timer = setTimeout(async () => {
      const body = JSON.stringify(profile);
      try {
        const res = await fetch(`${API}/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body,
        });
        if (!res.ok) throw new Error();
        setSavedJson(body); // don't overwrite the fields while the user is typing
        setStatus("Saved ✓");
      } catch {
        setStatus("Auto-save failed — click Save to retry.");
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [profile, dirty, loading]);

  // Flush unsaved changes when navigating away from the page
  useEffect(
    () => () => {
      if (latest.current.dirty) {
        fetch(`${API}/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          keepalive: true,
          body: JSON.stringify(latest.current.profile),
        }).catch(() => {});
      }
    },
    []
  );

  const save = async (next: ProfileData = profile) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error();
      const saved: ProfileData = await res.json();
      setProfile(saved);
      setSavedJson(JSON.stringify(saved));
      setStatus("Saved ✓ The resume advisor will use this profile.");
      return true;
    } catch {
      setStatus("Save failed. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = (patch: Partial<ProfileData>) => {
    setProfile((p) => ({ ...p, ...patch }));
    setStatus("");
  };

  const goTo = async (i: number) => {
    if (dirty) await save();
    setStep(i);
  };

  // ---- Import (whole profile or one section) ----
  const parseText = async (text: string) => {
    const res = await fetch(`${API}/profile/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Import failed");
    return data as { profile: ProfileData; method: string };
  };

  const pasteIntoImportBox = async () => {
    const text = await readClipboard();
    if (text) setImportText(text);
    else {
      importRef.current?.focus();
      setStatus(
        "Clipboard access was blocked — click in the box and press ⌘V / Ctrl+V."
      );
    }
  };

  const runImport = async () => {
    if (!importText.trim()) return;
    setImporting(true);
    setStatus("");
    try {
      setPreview(await parseText(importText));
    } catch (e) {
      setStatus((e as Error).message);
    } finally {
      setImporting(false);
    }
  };

  const applyImport = (mode: "merge" | "replace") => {
    if (!preview) return;
    const p = preview.profile;
    const next: ProfileData =
      mode === "replace"
        ? { ...p, linkedin_url: p.linkedin_url || profile.linkedin_url }
        : {
            intro: profile.intro.trim() ? profile.intro : p.intro,
            linkedin_url: profile.linkedin_url || p.linkedin_url,
            experience: [...profile.experience, ...p.experience],
            projects: [...profile.projects, ...p.projects],
            skills: mergeSkills(profile.skills, p.skills),
          };
    setProfile(next);
    setPreview(null);
    setImportText("");
    save(next);
  };

  const pasteIntoSection = async (key: SectionKey) => {
    const text = await readClipboard();
    if (!text) {
      setStatus(
        "Clipboard access was blocked — paste directly into the fields with ⌘V / Ctrl+V."
      );
      return;
    }
    if (key === "intro") {
      update({
        intro: profile.intro ? `${profile.intro}\n${text.trim()}` : text.trim(),
      });
    } else if (key === "skills") {
      update({ skills: mergeSkills(profile.skills, splitSkills(text)) });
    } else {
      // Let the parser split pasted experience/projects into entries
      try {
        const heading = key === "experience" ? "Experience" : "Projects";
        const { profile: parsed } = await parseText(`${heading}\n${text}`);
        const items = parsed[key] as (Experience | Project)[];
        if (items.length)
          update({
            [key]: [...(profile[key] as (Experience | Project)[]), ...items],
          } as Partial<ProfileData>);
        else setStatus("Couldn't find any entries in the pasted text.");
      } catch (e) {
        setStatus((e as Error).message);
      }
    }
  };

  // ---- Section editors ----
  const setExp = (i: number, patch: Partial<Experience>) =>
    update({
      experience: profile.experience.map((e, j) =>
        j === i ? { ...e, ...patch } : e
      ),
    });
  const setProj = (i: number, patch: Partial<Project>) =>
    update({
      projects: profile.projects.map((p, j) =>
        j === i ? { ...p, ...patch } : p
      ),
    });

  const addSkillsFromInput = () => {
    const parts = splitSkills(skillInput);
    if (parts.length) update({ skills: mergeSkills(profile.skills, parts) });
    setSkillInput("");
  };

  const PasteBtn = ({ k }: { k: SectionKey }) => (
    <button
      type="button"
      className="btn-ghost"
      onClick={() => pasteIntoSection(k)}
    >
      📋 Paste
    </button>
  );

  const renderSection = () => {
    switch (STEP_KEYS[step]) {
      case "intro":
        return (
          <>
            <div className="section-head">
              <div>
                <h2>Self Introduction</h2>
                <p className="hint">
                  Who you are, what you do, and the role you're aiming for.
                </p>
              </div>
              <PasteBtn k="intro" />
            </div>
            <textarea
              className="field"
              rows={7}
              value={profile.intro}
              placeholder="e.g. I'm a data analyst with 2 years of experience turning messy data into dashboards. I'm looking for a senior analyst role in fintech."
              onChange={(e) => update({ intro: e.target.value })}
            />
            <label className="label" htmlFor="linkedin-url">
              LinkedIn URL
            </label>
            <div className="row">
              <input
                id="linkedin-url"
                className="field"
                value={profile.linkedin_url}
                placeholder="linkedin.com/in/your-name"
                onChange={(e) => update({ linkedin_url: e.target.value })}
              />
              {profile.linkedin_url && (
                <a
                  className="btn-ghost"
                  href={withHttp(profile.linkedin_url)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open ↗
                </a>
              )}
            </div>
          </>
        );
      case "experience":
        return (
          <>
            <div className="section-head">
              <div>
                <h2>Experience</h2>
                <p className="hint">
                  Jobs, internships, and roles. Paste copied LinkedIn experience
                  to fill these in.
                </p>
              </div>
              <PasteBtn k="experience" />
            </div>
            {profile.experience.length === 0 && (
              <p className="empty">No experience added yet.</p>
            )}
            {profile.experience.map((e, i) => (
              <div className="entry" key={i}>
                <div className="grid3">
                  <input
                    className="field"
                    placeholder="Title"
                    value={e.title}
                    onChange={(ev) => setExp(i, { title: ev.target.value })}
                  />
                  <input
                    className="field"
                    placeholder="Company"
                    value={e.company}
                    onChange={(ev) => setExp(i, { company: ev.target.value })}
                  />
                  <input
                    className="field"
                    placeholder="Dates (e.g. Jan 2022 – Present)"
                    value={e.dates}
                    onChange={(ev) => setExp(i, { dates: ev.target.value })}
                  />
                </div>
                <textarea
                  className="field"
                  rows={4}
                  placeholder="What you did and the impact (one bullet per line)"
                  value={e.description}
                  onChange={(ev) => setExp(i, { description: ev.target.value })}
                />
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() =>
                    update({
                      experience: profile.experience.filter((_, j) => j !== i),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-add"
              onClick={() =>
                update({ experience: [...profile.experience, emptyExp()] })
              }
            >
              + Add experience
            </button>
          </>
        );
      case "projects":
        return (
          <>
            <div className="section-head">
              <div>
                <h2>Projects</h2>
                <p className="hint">
                  Link your work — GitHub repos, portfolios, live demos.
                </p>
              </div>
              <PasteBtn k="projects" />
            </div>
            {profile.projects.length === 0 && (
              <p className="empty">No projects added yet.</p>
            )}
            {profile.projects.map((p, i) => (
              <div className="entry" key={i}>
                <div className="grid2">
                  <input
                    className="field"
                    placeholder="Project name"
                    value={p.name}
                    onChange={(ev) => setProj(i, { name: ev.target.value })}
                  />
                  <div className="row">
                    <input
                      className="field"
                      placeholder="Link (https://github.com/...)"
                      value={p.url}
                      onChange={(ev) => setProj(i, { url: ev.target.value })}
                    />
                    {p.url && (
                      <a
                        className="btn-ghost"
                        href={withHttp(p.url)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                </div>
                <textarea
                  className="field"
                  rows={3}
                  placeholder="What it does, your role, and the tech you used"
                  value={p.description}
                  onChange={(ev) =>
                    setProj(i, { description: ev.target.value })
                  }
                />
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() =>
                    update({
                      projects: profile.projects.filter((_, j) => j !== i),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-add"
              onClick={() =>
                update({ projects: [...profile.projects, emptyProj()] })
              }
            >
              + Add project
            </button>
          </>
        );
      case "skills":
        return (
          <>
            <div className="section-head">
              <div>
                <h2>Skills</h2>
                <p className="hint">
                  Type a skill and press Enter or comma. Pasting a
                  comma-separated list adds them all.
                </p>
              </div>
              <PasteBtn k="skills" />
            </div>
            <div className="chips">
              {profile.skills.map((s) => (
                <span className="chip" key={s}>
                  {s}
                  <button
                    type="button"
                    aria-label={`Remove ${s}`}
                    onClick={() =>
                      update({ skills: profile.skills.filter((x) => x !== s) })
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                className="chip-input"
                value={skillInput}
                placeholder={
                  profile.skills.length
                    ? "Add more…"
                    : "e.g. SQL, Python, Salesforce"
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (/[,;\n]/.test(v)) {
                    update({
                      skills: mergeSkills(profile.skills, splitSkills(v)),
                    });
                    setSkillInput("");
                  } else setSkillInput(v);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkillsFromInput();
                  } else if (
                    e.key === "Backspace" &&
                    !skillInput &&
                    profile.skills.length
                  ) {
                    update({ skills: profile.skills.slice(0, -1) });
                  }
                }}
                onBlur={addSkillsFromInput}
              />
            </div>
          </>
        );
    }
  };

  if (loading)
    return (
      <div className="profile-page">
        <p style={{ padding: 40 }}>Loading profile…</p>
      </div>
    );

  return (
    <div className="profile-page">
      <nav className="profile-nav">
        <span className="brand">Planora</span>
        <Link to="/dashboard">Templates</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/checkout">Checkout</Link>
        <Link to="/profile" className="active">
          Profile
        </Link>
      </nav>

      <main className="profile-main">
        <h1>Your Profile</h1>
        <p className="hint">
          Fill this out section by section. The resume advisor in the chat panel
          reads it to recommend the best template for you.
        </p>

        {/* Import from LinkedIn / resume */}
        <section className="card import-card">
          <h3>Import from LinkedIn or a resume</h3>
          <p className="hint">
            Open your LinkedIn profile, select all (⌘A / Ctrl+A), copy, and
            paste it here — or paste your resume text. We'll split it into the
            four sections for you to review.
          </p>
          <textarea
            ref={importRef}
            className="field"
            rows={4}
            value={importText}
            placeholder="Paste your LinkedIn profile or resume text here…"
            onChange={(e) => setImportText(e.target.value)}
          />
          <div className="row end">
            <button
              type="button"
              className="btn-ghost"
              onClick={pasteIntoImportBox}
            >
              📋 Paste from clipboard
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={!importText.trim() || importing}
              onClick={runImport}
            >
              {importing ? "Reading…" : "Import"}
            </button>
          </div>

          {preview && (
            <div className="preview">
              <strong>Found:</strong>{" "}
              {preview.profile.intro ? "an introduction, " : ""}
              {preview.profile.experience.length} experience entr
              {preview.profile.experience.length === 1 ? "y" : "ies"},{" "}
              {preview.profile.projects.length} project(s),{" "}
              {preview.profile.skills.length} skill(s)
              {preview.method === "basic" && (
                <span className="hint">
                  {" "}
                  (basic parser — review the results)
                </span>
              )}
              <div className="row end">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setPreview(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => applyImport("replace")}
                >
                  Replace my profile
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => applyImport("merge")}
                >
                  Add to my profile
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Stepper */}
        <ol className="stepper">
          {STEPS.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                className={`step ${i === step ? "current" : ""} ${
                  sectionDone(profile, STEP_KEYS[i]) ? "done" : ""
                }`}
                onClick={() => goTo(i)}
              >
                <span className="num">
                  {sectionDone(profile, STEP_KEYS[i]) ? "✓" : i + 1}
                </span>
                {label}
              </button>
            </li>
          ))}
        </ol>

        <section className="card">{renderSection()}</section>

        <div className="footer-bar">
          <button
            type="button"
            className="btn-ghost"
            disabled={step === 0}
            onClick={() => goTo(step - 1)}
          >
            ← Back
          </button>
          <span className="status">
            {saving ? "Saving…" : status || (dirty ? "Unsaved changes" : "")}
          </span>
          <div className="row">
            <button
              type="button"
              className="btn-ghost"
              disabled={!dirty || saving}
              onClick={() => save()}
            >
              Save
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => goTo(step + 1)}
              >
                Next: {STEPS[step + 1]} →
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                disabled={saving}
                onClick={() => save()}
              >
                Save profile
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
