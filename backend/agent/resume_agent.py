"""Resume advisor agent.

Uses OpenAI (if OPENAI_API_KEY is set) to give resume template recommendations
and feedback. Falls back to a simple rule-based advisor otherwise, so the chat
works out of the box with no API key.
"""
import json
import os
import ssl
import urllib.request

from repo.resume_template_repository import get_all_static

try:  # use certifi's CA bundle if available (fixes macOS cert errors)
    import certifi
    _SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    _SSL_CTX = ssl.create_default_context()

OPENAI_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")


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


def _system_prompt():
    return (
        "You are Planora's resume advisor. Help users figure out which resume "
        "template fits their background and target role, and give concise, "
        "actionable feedback on their resume content (structure, bullet points, "
        "quantified impact, skills). When relevant, recommend templates from this "
        "catalog by name and template_id:\n"
        + json.dumps(_template_catalog(), indent=2)
        + "\nKeep answers short and friendly."
    )


def _call_openai(messages, api_key):
    payload = {
        "model": OPENAI_MODEL,
        "messages": [{"role": "system", "content": _system_prompt()}] + messages,
        "temperature": 0.5,
    }
    req = urllib.request.Request(
        OPENAI_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
    )
    with urllib.request.urlopen(req, timeout=30, context=_SSL_CTX) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"].strip()


_KEYWORDS = {
    "software": ["software", "sde", "developer", "engineer", "programmer", "full-stack", "backend", "frontend"],
    "data": ["data", "analyst", "machine learning", "ml", "ai", "scientist"],
    "student": ["student", "intern", "graduate", "new grad", "college", "university"],
    "design": ["design", "ux", "ui", "creative"],
}


def _fallback_reply(user_text):
    text = user_text.lower()
    catalog = _template_catalog()
    tips = []
    matched = [k for k, words in _KEYWORDS.items() if any(w in text for w in words)]

    if "software" in matched or "data" in matched:
        t = catalog[0] if catalog else None
        if t:
            tips.append(f"I'd recommend **{t['name']}** ({t['template_id']}, ${t['price']}): {t['description']}")
        tips.append("Lead each bullet with a strong verb and quantify impact (e.g. 'reduced latency by 30%').")
        tips.append("Put a focused skills section near the top, grouped by languages / frameworks / tools.")
    if "student" in matched:
        tips.append("As a student or new grad, place Education first and highlight projects and internships.")
    if "design" in matched:
        tips.append("For design roles, link a portfolio and keep the layout clean with plenty of whitespace.")
    if any(w in text for w in ["feedback", "review", "my resume", "bullet"]):
        tips.append("Paste a section of your resume here and I'll point out what to tighten.")

    if not tips:
        names = ", ".join(t["name"] for t in catalog) or "none yet"
        return (
            "Tell me your target role, experience level, and industry, and I'll suggest a template. "
            f"Currently available templates: {names}."
        )
    return "\n".join(f"- {tip}" for tip in tips)


def chat(messages):
    """messages: list of {role: 'user'|'assistant', content: str}"""
    clean = [
        {"role": m["role"], "content": str(m["content"])[:4000]}
        for m in messages
        if m.get("role") in ("user", "assistant") and m.get("content")
    ][-20:]
    if not clean:
        return "Hi! What kind of role are you applying for?"

    api_key = os.environ.get("OPENAI_API_KEY")
    if api_key:
        try:
            return _call_openai(clean, api_key)
        except Exception as e:  # network/API failure -> graceful fallback
            print(f"[resume_agent] OpenAI call failed: {e}")
    last_user = next((m["content"] for m in reversed(clean) if m["role"] == "user"), "")
    return _fallback_reply(last_user)
