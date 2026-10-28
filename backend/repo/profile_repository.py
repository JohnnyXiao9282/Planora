"""Profile storage.

Profiles are too large for the ~4KB session cookie, so they are stored in a
local JSON file keyed by an anonymous per-browser user id kept in the session.
backend/data/ is git-ignored.
"""
import json
import os
import threading

_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
_PATH = os.path.join(_DATA_DIR, "profiles.json")
_LOCK = threading.Lock()

MAX_TEXT = 5000
MAX_ITEMS = 30


def empty_profile():
    return {"intro": "", "linkedin_url": "", "experience": [], "projects": [], "skills": []}


def _str(v, limit=MAX_TEXT):
    return str(v or "").strip()[:limit]


def normalize(data):
    """Validate/clean incoming profile data into the canonical shape."""
    data = data if isinstance(data, dict) else {}
    p = empty_profile()
    p["intro"] = _str(data.get("intro"))
    p["linkedin_url"] = _str(data.get("linkedin_url"), 300)
    for e in (data.get("experience") or [])[:MAX_ITEMS]:
        if isinstance(e, dict):
            item = {k: _str(e.get(k), 300) for k in ("title", "company", "dates")}
            item["description"] = _str(e.get("description"))
            if any(item.values()):
                p["experience"].append(item)
    for pr in (data.get("projects") or [])[:MAX_ITEMS]:
        if isinstance(pr, dict):
            item = {"name": _str(pr.get("name"), 300), "url": _str(pr.get("url"), 500),
                    "description": _str(pr.get("description"))}
            if any(item.values()):
                p["projects"].append(item)
    seen = set()
    for s in (data.get("skills") or [])[:100]:
        s = _str(s, 80)
        if s and s.lower() not in seen:
            seen.add(s.lower())
            p["skills"].append(s)
    return p


def _load_all():
    if not os.path.exists(_PATH):
        return {}
    try:
        with open(_PATH, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def get_profile(uid):
    if not uid:
        return empty_profile()
    with _LOCK:
        return normalize(_load_all().get(uid))


def save_profile(uid, data):
    profile = normalize(data)
    with _LOCK:
        os.makedirs(_DATA_DIR, exist_ok=True)
        all_profiles = _load_all()
        all_profiles[uid] = profile
        tmp = _PATH + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(all_profiles, f, indent=2)
        os.replace(tmp, _PATH)
    return profile


def is_empty(profile):
    return not (profile.get("intro") or profile.get("experience")
                or profile.get("projects") or profile.get("skills"))


def profile_to_text(profile):
    """Readable summary of a profile, used by the agent."""
    lines = []
    if profile.get("intro"):
        lines.append("Self introduction: " + profile["intro"])
    if profile.get("experience"):
        lines.append("Experience:")
        for e in profile["experience"]:
            head = " at ".join(x for x in (e["title"], e["company"]) if x)
            if e["dates"]:
                head += f" ({e['dates']})"
            lines.append(f"- {head}: {e['description']}".rstrip(": "))
    if profile.get("projects"):
        lines.append("Projects:")
        for p in profile["projects"]:
            lines.append(f"- {p['name']} {p['url']}: {p['description']}".rstrip(": "))
    if profile.get("skills"):
        lines.append("Skills: " + ", ".join(profile["skills"]))
    return "\n".join(lines)
