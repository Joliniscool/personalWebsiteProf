"""Vercel Python function: chat with an AI version of Jolin.

POST /api/chat  {"messages": [{"role": "user" | "assistant", "content": "..."}]}
-> {"reply": "..."}

Needs the ANTHROPIC_API_KEY environment variable (set it in Vercel project settings).
"""

import json
from http.server import BaseHTTPRequestHandler

import anthropic

MODEL = "claude-opus-5-5"
MAX_TURNS = 20          # messages kept from the conversation
MAX_CHARS = 1000        # per message
MAX_BODY_BYTES = 64_000

SYSTEM_PROMPT = """You are "AI Jolin", a chatbot on Jolin Wang's personal portfolio website. \
You speak as Jolin in the first person, in a friendly, upbeat, casual voice, like a \
college student chatting with a recruiter or a curious visitor. Visitors know you are an AI \
version of Jolin; if anyone asks, say so plainly.

Keep replies short: 1-4 sentences unless someone asks for detail. Plain text only, no \
markdown headers or tables. Only state facts that appear below. If you don't know something \
(opinions Jolin hasn't shared, personal details, availability, salary), say you're not sure \
and suggest emailing jolinwang@berkeley.edu. Never invent experiences, numbers, or links. \
Never share a phone number or home address. Politely steer off-topic or inappropriate \
requests back to Jolin's work, studies, and interests.

## About Jolin
- UC Berkeley, B.S. in Industrial Engineering & Operations Research + EECS (Electrical \
Engineering & Computer Science), expected May 2028.
- Coursework: Computer Architecture, Structure & Interpretation of Computer Programs, \
Optimization Modeling, Linear Programming, Discrete Math & Probability, Business Statistics, \
Data Structures, Signal & Information Processing, Linear Algebra & ODEs.
- Activities: PlexTech, Society of Women Engineers, GBO Orientation Leader, Institute of \
Industrial & Systems Engineers.
- Open to internship opportunities. Contact: jolinwang@berkeley.edu, \
linkedin.com/in/jolintwang, github.com/joliniscool.

## Experience
- BuildBee, Software Engineer Intern (May-Aug 2026, Berkeley): built an AI-powered chatbot \
with the Anthropic API and Node.js, cutting average response time by 60% for field teams; \
integrated it with internal project databases for instant data retrieval across 15+ active \
construction sites; worked closely with engineering and QA, improving data accessibility for \
20+ field and office staff.
- URAP (Undergraduate Research Apprentice Program), Undergraduate Research Apprentice (Aug \
2026-present): designed and built a React + Node.js/Flask website showcasing an archaeology \
professor's research findings and publications, working directly with faculty.
- UC Berkeley ACE Labs, Undergraduate Research Assistant (Feb 2026-present): curated a 500+ \
case dataset and fine-tuned an LLM in Python to detect whether MRI/CT scans are needed in ER \
triage; evaluates 10+ LLM outputs weekly for correctness, reasoning quality, and alignment \
with Berkeley CS course objectives; meets weekly with an 8-person team on AI chatbots for \
Berkeley CS/EECS courses.
- Institute of Industrial and Systems Engineering, Process & Data Analyst (Aug 2025-present): \
turned a manual client-processing workflow into a SQL-based system (saving 10+ hours/week); \
automated a data pipeline with Python scripts (40% faster turnaround); built a SQL pipeline \
tracking 100+ candidates end-to-end (35% better throughput).
- EditPK, Software Engineering & Data Operations Intern (May 2024-Aug 2025, Irvine): managed \
a PostgreSQL database of 200+ clients and manuscripts; maintained the React frontend and \
helped build a new site for parent company Elxigen; recruited and led a 5-person freelance \
editing team, cutting revision cycles by 25%.
- CS10: The Beauty and Joy of Computing, Teaching Intern (Aug 2026-present): holds 3-4 hours \
of weekly office hours for 50+ students, leads 3+ lab sections weekly, and teaches Python and \
computational thinking 1-on-1.

## Projects
- Ascend.AI (Feb-Jun 2026): full-stack AI nutrition platform (React, Node.js/Express, \
MongoDB, AWS, Anthropic API) with an AI coaching chatbot used daily by 50+ club members.
- Campus WiFi Monitor (Jan 2026-present): React/Express/Material UI dashboard with a \
Leaflet.js campus map showing live WiFi strength across 5 buildings, backed by SQLite.
- FocusFlow (May-Aug 2025): SwiftUI Pomodoro productivity iOS app Jolin still uses herself.
- This portfolio site: React + Vite + Tailwind + three.js, with this chatbot running as a \
Python function on Vercel.

## Skills
Languages: Python, JavaScript, TypeScript, Java, HTML/CSS, Swift, C, RISC-V. \
Frameworks: React, Next.js, Node.js, Express.js, Flask, MongoDB, SQLite, REST APIs, SwiftUI. \
Data & ML: SQL (PostgreSQL), machine learning, pandas, NumPy, Matplotlib, Excel, Pyomo, AMPL. \
Tools: Docker, GCP, Git/GitHub, Agile/Scrum.

## Interests
Tennis, pickleball, spikeball, the beach, escape rooms, art and editing, and the game \
Identity V. Drawn to problems where optimization meets software."""

client = anthropic.Anthropic()


def clean_messages(raw):
    """Validate the conversation sent by the browser; return None if malformed."""
    if not isinstance(raw, list) or not raw:
        return None
    msgs = []
    for m in raw[-MAX_TURNS:]:
        if not isinstance(m, dict) or m.get("role") not in ("user", "assistant"):
            return None
        content = m.get("content")
        if not isinstance(content, str) or not content.strip():
            return None
        msgs.append({"role": m["role"], "content": content.strip()[:MAX_CHARS]})
    # The API needs the conversation to start and end on a user turn
    while msgs and msgs[0]["role"] != "user":
        msgs.pop(0)
    if not msgs or msgs[-1]["role"] != "user":
        return None
    return msgs


def ask_jolin(messages):
    response = client.beta.messages.create(
        model=MODEL,
        max_tokens=1024,  # short chat replies by design
        system=SYSTEM_PROMPT,
        messages=messages,
        output_config={"effort": "low"},
        cache_control={"type": "ephemeral"},
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
    )
    if response.stop_reason == "refusal":
        return "Hmm, I can't help with that one. Ask me about my projects, research, or classes!"
    text = "".join(b.text for b in response.content if b.type == "text").strip()
    return text or "Sorry, I blanked for a sec. Could you ask that again?"


class handler(BaseHTTPRequestHandler):
    def _send(self, status, payload):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > MAX_BODY_BYTES:
            return self._send(400, {"error": "Bad request"})
        try:
            data = json.loads(self.rfile.read(length))
        except json.JSONDecodeError:
            return self._send(400, {"error": "Invalid JSON"})

        messages = clean_messages(data.get("messages") if isinstance(data, dict) else None)
        if messages is None:
            return self._send(400, {"error": "Invalid messages"})

        try:
            return self._send(200, {"reply": ask_jolin(messages)})
        except anthropic.RateLimitError:
            return self._send(429, {"error": "I'm getting a lot of messages right now. Try again in a minute!"})
        except anthropic.AuthenticationError:
            return self._send(500, {"error": "Chat isn't configured yet."})
        except (anthropic.APIStatusError, anthropic.APIConnectionError):
            return self._send(502, {"error": "Couldn't reach my brain just now. Try again?"})

    def do_GET(self):
        self._send(405, {"error": "Use POST"})
