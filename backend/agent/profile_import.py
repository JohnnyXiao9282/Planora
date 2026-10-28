"""Turn pasted text (e.g. a copied LinkedIn profile or resume) into profile sections.

Uses OpenAI when available for accurate extraction; otherwise uses a heuristic
parser that recognizes common section headings (About, Experience, Projects,
Skills) like those on a LinkedIn profile page.
"""
import json
import re

from agent.resume_agent import openai_available, openai_complete
from repo.profile_repository import normalize

MAX_IMPORT_CHARS = 20000

_SECTION_ALIASES = {
    "intro": ["about", "summary", "about me", "profile", "introduction", "self introduction", "objective"],
    "experience": ["experience", "work experience", "employment", "work history", "professional experience"],
    "projects": ["projects", "personal projects", "portfolio", "selected projects"],
    "skills": ["skills", "top skills", "technical skills", "skills & endorsements", "core competencies"],
    "_ignore": ["education", "licenses & certifications", "certifications", "activity", "interests",
                "languages", "honors & awards", "volunteering", "recommendations", "courses"],
}
_HEADING = {alias: key for key, aliases in _SECTION_ALIASES.items() for alias in aliases}

_DATE_RE = re.compile(
    r"((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{1,2}/\d{4}|\b(19|20)\d{2}\b)"
    r".*?(present|current|now|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{1,2}/\d{4}|\b(19|20)\d{2}\b)",
    re.I,
)
_URL_RE = re.compile(r"https?://\S+|(?:www\.)?github\.com/\S+", re.I)
_LINKEDIN_RE = re.compile(r"(?:https?://)?(?:[a-z]{2,3}\.)?linkedin\.com/in/[\w\-%]+/?", re.I)
_EMPLOYMENT_TYPES = re.compile(r"\s*·\s*(full-time|part-time|internship|contract|freelance|self-employed)\s*$", re.I)
_DURATION_ONLY = re.compile(r"^\s*·?\s*\d+\s*(yrs?|years?|mos?|months?)(\s+\d+\s*(mos?|months?))?\s*$", re.I)
_BULLET = re.compile(r"^\s*[-•*▪●◦]\s*")


def _split_sections(text):
    sections = {"_header": [], "intro": [], "experience": [], "projects": [], "skills": [], "_ignore": []}
    current = "_header"  # lines before the first heading (name, headline, ...)
    for raw in text.splitlines():
        line = raw.strip()
        key = _HEADING.get(line.lower().rstrip(":").strip())
        if key:
            current = key
            continue
        sections[current].append(line)
    return sections


def _blocks(lines):
    """Split lines into blank-line separated blocks."""
    blocks, cur = [], []
    for line in lines:
        if line:
            cur.append(line)
        elif cur:
            blocks.append(cur)
            cur = []
    if cur:
        blocks.append(cur)
    return blocks


def _parse_experience(lines):
    items = []
    for block in _blocks(lines):
        block = [l for l in block if not _DURATION_ONLY.match(l)]
        if not block:
            continue
        dates = ""
        rest = []
        for l in block:
            m = _DATE_RE.search(l)
            if m and not dates and len(l) < 80:
                dates = re.sub(r"\s*·.*$", "", l).strip()
            else:
                rest.append(l)
        title = rest[0] if rest else ""
        company = _EMPLOYMENT_TYPES.sub("", rest[1]) if len(rest) > 1 else ""
        desc = "\n".join(_BULLET.sub("- ", l) if _BULLET.match(l) else l for l in rest[2:])
        items.append({"title": title, "company": company, "dates": dates, "description": desc})
    return items


def _parse_projects(lines):
    items = []
    for block in _blocks(lines):
        url = ""
        rest = []
        for l in block:
            m = _URL_RE.search(l)
            if m and not url:
                url = m.group(0).rstrip(").,")
                leftover = _URL_RE.sub("", l).strip(" -:|")
                if leftover:
                    rest.append(leftover)
            else:
                rest.append(l)
        name = rest[0] if rest else ""
        items.append({"name": name, "url": url, "description": "\n".join(rest[1:])})
    return items


def _parse_skills(lines):
    skills = []
    for l in lines:
        if not l or re.search(r"endorsement|^\d+\s|show all", l, re.I):
            continue
        for part in re.split(r"[,;|•·]", l):
            part = _BULLET.sub("", part).strip()
            if 0 < len(part) <= 60:
                skills.append(part)
    return skills


def heuristic_parse(text):
    sections = _split_sections(text)
    # Prefer an explicit About/Summary section; otherwise use the top-of-page text
    intro_lines = sections["intro"] if any(sections["intro"]) else sections["_header"]
    intro = "\n".join(l for l in intro_lines if l and not _URL_RE.search(l)
                      and not _LINKEDIN_RE.search(l)).strip()
    linkedin = _LINKEDIN_RE.search(text)
    return normalize({
        "intro": intro,
        "linkedin_url": linkedin.group(0) if linkedin else "",
        "experience": _parse_experience(sections["experience"]),
        "projects": _parse_projects(sections["projects"]),
        "skills": _parse_skills(sections["skills"]),
    })


_EXTRACT_PROMPT = (
    "Extract a professional profile from the pasted text (often a LinkedIn profile "
    "or resume copied from a web page). Return ONLY a JSON object with this shape:\n"
    '{"intro": string (a first-person self introduction / about section; summarize '
    'from the text if there is no explicit About section), '
    '"linkedin_url": string, '
    '"experience": [{"title": string, "company": string, "dates": string, "description": string}], '
    '"projects": [{"name": string, "url": string, "description": string}], '
    '"skills": [string]}\n'
    "Ignore UI noise like 'Show all', endorsement counts, connection counts, and "
    "navigation text. Keep descriptions faithful to the source; do not invent facts. "
    "Use empty strings or empty lists for anything not present."
)


def parse_profile_text(text):
    """Returns (profile, method) where method is 'ai' or 'basic'."""
    text = (text or "")[:MAX_IMPORT_CHARS]
    if openai_available():
        try:
            raw = openai_complete(_EXTRACT_PROMPT, [{"role": "user", "content": text}],
                                  json_mode=True, temperature=0)
            return normalize(json.loads(raw)), "ai"
        except Exception as e:
            print(f"[profile_import] OpenAI extraction failed, using heuristic parser: {e}")
    return heuristic_parse(text), "basic"
