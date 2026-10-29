import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatTemplateName } from "../utils/formatTemplateName";

interface Education {
  school: string;
  degree: string;
  gpa: string;
  years: string;
}
interface Experience {
  company: string;
  title: string;
  location: string;
  dates: string;
  bullets: string[];
}
interface Project {
  name: string;
  description: string;
}
interface ResumeTemplate {
  template_id: string;
  name: string;
  description: string;
  price: number;
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
}

const TemplateDetail = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<ResumeTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTemplate(null);
    setError(null);
    fetch(`http://localhost:5050/resume-templates/${templateId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || `Request failed (${res.status})`);
        return data as ResumeTemplate;
      })
      .then((data) => setTemplate(data))
      .catch((e: Error) => setError(e.message || "Could not load template."));
  }, [templateId]);

  if (error)
    return (
      <div style={{ padding: 24 }}>
        <p>Couldn't load this template: {error}</p>
        <button type="button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
      </div>
    );
  if (!template) return <div>Loading...</div>;

  return (
    <div
      style={{
        background: "#f6f8fa",
        minHeight: "100vh",
        padding: 0,
        margin: 0,
      }}
    >
      <button style={{ margin: 24 }} onClick={() => navigate(-1)} type="button">
        &larr; Back
      </button>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 24px rgba(60,60,130,0.10)",
          padding: 40,
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: 32,
            overflowWrap: "anywhere",
          }}
        >
          {formatTemplateName(template.name)}
        </h1>
        <section style={{ margin: "2rem 0" }}>
          <h2>Summary</h2>
          <p>{template.summary}</p>
        </section>
        <section style={{ margin: "2rem 0" }}>
          <h2>Education</h2>
          <ul>
            {template.education.map((edu) => (
              <li key={edu.school + edu.degree}>
                {edu.degree} at {edu.school} ({edu.years}), GPA: {edu.gpa}
              </li>
            ))}
          </ul>
        </section>
        <section style={{ margin: "2rem 0" }}>
          <h2>Experience</h2>
          {template.experience.map((exp) => (
            <div key={exp.company + exp.title} style={{ marginBottom: 16 }}>
              <strong>{exp.title}</strong> at <strong>{exp.company}</strong> (
              {exp.dates})<br />
              <span style={{ color: "#666" }}>{exp.location}</span>
              <ul>
                {exp.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <section style={{ margin: "2rem 0" }}>
          <h2>Projects</h2>
          <ul>
            {template.projects.map((proj) => (
              <li key={proj.name}>
                <strong>{proj.name}:</strong> {proj.description}
              </li>
            ))}
          </ul>
        </section>
        <section style={{ margin: "2rem 0" }}>
          <h2>Skills</h2>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              listStyle: "none",
              padding: 0,
            }}
          >
            {template.skills.map((skill) => (
              <li
                key={skill}
                style={{
                  background: "#e0e7ef",
                  borderRadius: 6,
                  padding: "4px 12px",
                }}
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TemplateDetail;
