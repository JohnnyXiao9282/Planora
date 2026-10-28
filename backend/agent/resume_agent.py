"""Resume advisor agent.

Uses OpenAI (if OPENAI_API_KEY is set) to give resume template recommendations
and feedback. Falls back to a rule-based advisor otherwise, so the chat works
with no API key. When the user has filled out their profile, the agent reads it
and uses it to pick the best-fitting template.
"""
import json
import os
import re
import ssl
import urllib.request

from repo.resume_template_repository import get_all_static
from repo.profile_repository import is_empty, profile_to_text

try:  # use certifi's CA bundle if available (fixes macOS cert errors)
    import certifi
    _SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    _SSL_CTX = ssl.create_default_context()

OPENAI_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")


# ---------------------------------------------------------------- OpenAI ---

def openai_available():
    return bool(os.environ.get("OPENAI_API_KEY"))


def openai_complete(system, messages, json_mode=False, temperature=0.5):
    """Call OpenAI chat completions. Raises on failure."""
    payload = {
        "model": OPENAI_MODEL,
        "messages": [{"role": "system", "content": system}] + messages,
        "temperature": temperature,
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}
    req = urllib.request.Request(
        OPENAI_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
        },
    )
    with urllib.request.urlopen(req, timeout=45, context=_SSL_CTX) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"].strip()


def _template_catalog():
    return [
        {
            "template_id": t["template_id"],
            "name": t["name"],
            "description": t["description"],
            "price": t["price"],
            "skills": t.get("skills", []),
        }
        for t in get_all_static()
    ]


def _system_prompt(profile):
    prompt = (
        "You are Planora's resume advisor. Help users figure out which resume "
        "template fits their background and target role, and give concise, "
        "actionable feedback on their resume content (structure, bullet points, "
        "quantified impact, skills). Recommend templates only from this catalog, "
        "by name and template_id:\n"
        + json.dumps(_template_catalog(), indent=2)
    )
    if profile and not is_empty(profile):
        prompt += (
            "\n\nThe user has filled out their Planora profile:\n"
            + profile_to_text(profile)
            + "\n\nWhen they ask which resume or template suits them, base your "
            "answer on this profile: name the single best-fitting template, explain "
            "why using specific details from their experience, projects, and skills, "
            "and mention a runner-up if one is close. Point out gaps in their profile "
            "that would strengthen the resume."
        )
    else:
        prompt += (
            "\n\nThe user has not filled out their profile yet. If they ask which "
            "template suits them, ask about their target role and experience, and "
            "suggest filling out the Profile page so you can give a better match."
        )
    return prompt + "\nKeep answers short and friendly."


# -------------------------------------------------------------- Fallback ---

_KEYWORDS = {
    "software": ["software", "sde", "developer", "engineer", "engineering", "programmer", "full-stack",
                 "backend", "frontend", "react", "java", "c\\+\\+", "javascript", "typescript", "api"],
    "data": ["data", "analytics", "analyst", "sql", "tableau", "power bi", "machine learning",
             "scientist", "pandas", "statistics", "dashboard"],
    "sales": ["sales", "account executive", "sdr", "bdr", "business development", "quota",
              "salesforce", "pipeline", "prospecting", "crm"],
    "marketing": ["marketing", "seo", "sem", "social media", "brand", "growth", "content",
                  "campaign", "google ads", "copywriting"],
    "product": ["product manager", "product management", "pm", "roadmap", "user research",
                "prd", "product owner"],
    "finance": ["finance", "financial", "fp&a", "accounting", "accountant", "investment",
                "banking", "valuation", "budget", "forecasting", "excel"],
    "student": ["student", "intern", "internship", "graduate", "new grad", "college", "university"],
    "design": ["design", "designer", "ux", "ui", "figma", "creative"],
}
# Whole-word matching so short keywords like "ui" or "pm" don't match inside other words
_PATTERNS = {
    role: [re.compile(r"(?<![a-z0-9])" + w + r"(?![a-z0-9])") for w in words]
    for role, words in _KEYWORDS.items()
}

# Which template fits each role, plus one role-specific tip
_ROLE_TEMPLATES = {
    "software": ("template_001", "Lead bullets with strong verbs and quantify impact (e.g. 'reduced latency by 30%')."),
    "sales": ("template_002", "Put quota attainment and revenue closed front and center (e.g. '124% of quota')."),
    "marketing": ("template_003", "Show campaign results with metrics like CPA, conversion rate, and traffic growth."),
    "data": ("template_004", "Pair each tool (SQL, Python, Tableau) with the business decision your analysis drove."),
    "product": ("template_005", "Frame bullets as outcomes: the metric you moved and the team you led to ship it."),
    "finance": ("template_006", "Highlight modeling, forecasting accuracy, and dollar amounts of savings or budgets."),
}

_ASKS_FOR_MATCH = re.compile(
    r"\b(which|what|best|suit|suits|fit|fits|recommend|match|should i|for me|template|resume)\b"
)


def _role_scores(text):
    text = text.lower()
    return {role: sum(len(p.findall(text)) for p in pats) for role, pats in _PATTERNS.items()}


def best_templates_for_profile(profile, extra_text=""):
    """Rank templates for a profile. Returns [(template, score, role)] best first."""
    scores = _role_scores(profile_to_text(profile))
    for role, s in _role_scores(extra_text).items():  # the question itself counts extra
        scores[role] += 3 * s
    by_id = {t["template_id"]: t for t in _template_catalog()}
    ranked = [
        (by_id[tid], scores[role], role)
        for role, (tid, _) in _ROLE_TEMPLATES.items()
        if tid in by_id and scores[role] > 0
    ]
    return sorted(ranked, key=lambda x: -x[1])


def _fmt(t):
    return f"**{t['name'].replace('_', ' ')}** ({t['template_id']}, ${t['price']})"


def _profile_reply(profile, user_text):
    ranked = best_templates_for_profile(profile, user_text)
    if not ranked:
        return None
    best, _, role = ranked[0]
    lines = [f"- Based on your profile, the best fit is {_fmt(best)}: {best['description']}"]
    skills = [s for s in profile.get("skills", []) if _role_scores(s).get(role)]
    if skills:
        lines.append(f"- Your skills that match this template: {', '.join(skills[:6])}.")
    if len(ranked) > 1 and ranked[1][1] >= ranked[0][1] * 0.6:
        lines.append(f"- Runner-up: {_fmt(ranked[1][0])}.")
    lines.append("- " + _ROLE_TEMPLATES[role][1])
    missing = [name for key, name in (("intro", "self introduction"), ("experience", "experience"),
                                      ("projects", "projects"), ("skills", "skills"))
               if not profile.get(key)]
    if missing:
        lines.append(f"- Add your {', '.join(missing)} on the Profile page for a sharper recommendation.")
    return "\n".join(lines)


def _fallback_reply(user_text, profile=None):
    text = user_text.lower()
    if profile and not is_empty(profile) and _ASKS_FOR_MATCH.search(text):
        reply = _profile_reply(profile, user_text)
        if reply:
            return reply

    catalog = _template_catalog()
    by_id = {t["template_id"]: t for t in catalog}
    scores = _role_scores(text)
    tips = []
    for role, (tid, tip) in _ROLE_TEMPLATES.items():
        if scores[role] and tid in by_id:
            tips.append(f"I'd recommend {_fmt(by_id[tid])}: {by_id[tid]['description']}")
            tips.append(tip)
    if scores["student"]:
        tips.append("As a student or new grad, place Education first and highlight projects and internships.")
    if scores["design"]:
        tips.append("For design roles, link a portfolio and keep the layout clean with plenty of whitespace.")
    if any(w in text for w in ["feedback", "review", "my resume", "bullet"]):
        tips.append("Paste a section of your resume here and I'll point out what to tighten.")

    if not tips:
        names = ", ".join(t["name"].replace("_", " ") for t in catalog) or "none yet"
        hint = "" if profile and not is_empty(profile) else \
            " Or fill out your Profile page and ask me again, and I'll match a template to it."
        return (
            "Tell me your target role, experience level, and industry, and I'll suggest a template."
            f"{hint} Currently available templates: {names}."
        )
    return "\n".join(f"- {tip}" for tip in tips)


# ------------------------------------------------------------------ Chat ---

def chat(messages, profile=None):
    """messages: list of {role: 'user'|'assistant', content: str}"""
    clean = [
        {"role": m["role"], "content": str(m["content"])[:4000]}
        for m in messages
        if isinstance(m, dict) and m.get("role") in ("user", "assistant") and m.get("content")
    ][-20:]
    if not clean:
        return "Hi! What kind of role are you applying for?"

    if openai_available():
        try:
            return openai_complete(_system_prompt(profile), clean)
        except Exception as e:  # network/API failure -> graceful fallback
            print(f"[resume_agent] OpenAI call failed: {e}")
    last_user = next((m["content"] for m in reversed(clean) if m["role"] == "user"), "")
    return _fallback_reply(last_user, profile)
