// Offline answers so the chat works (and stays free) without the API.
// Each topic scores by how many of its keywords appear in the question.
const TOPICS = [
  {
    keys: ['working on', 'right now', 'currently', 'these days', 'busy', 'up to'],
    reply: "right now i'm fine-tuning LLMs for ER triage at ACE Labs, building a research website for an archaeology professor through URAP, building data pipelines at IISE, and teaching Python as a CS10 intern. busy semester!",
  },
  {
    keys: ['ascend'],
    reply: "Ascend.AI is a full-stack AI nutrition platform i built with React, Node.js/Express, MongoDB and AWS. it has an AI coaching chatbot (Anthropic API) that 50+ club members use daily. check it out at plexascend.com!",
  },
  {
    keys: ['wifi', 'wi-fi', 'campus map', 'leaflet'],
    reply: 'Campus WiFi Monitor is a React/Express/Material UI dashboard where people submit WiFi signal strength. a Leaflet.js campus map shows live strength across 5 buildings, stored in SQLite.',
  },
  {
    keys: ['focusflow', 'pomodoro', 'ios', 'swift', 'app'],
    reply: "FocusFlow is my SwiftUI pomodoro app with customizable focus and break timers. i built it for myself and i still use it, which is honestly its best review 🍅",
  },
  {
    keys: ['buildbee', 'summer', 'internship', 'intern'],
    reply: 'this summer i was a software engineer intern at BuildBee. i built an AI chatbot with the Anthropic API and Node.js that cut average response time for field teams by 60%, connected to project data across 15+ construction sites.',
  },
  {
    keys: ['ace', 'triage', 'mri', 'fine-tun', 'fine tun', 'llm'],
    reply: 'at UC Berkeley ACE Labs i curated a 500+ case dataset and fine-tuned an LLM to predict whether ER patients need MRI/CT scans. i also evaluate LLM outputs weekly for course chatbots with an 8-person team.',
  },
  {
    keys: ['urap', 'archaeology', 'professor'],
    reply: "through URAP i'm building a React + Node.js/Flask website that showcases an archaeology professor's research and publications, working directly with faculty.",
  },
  {
    keys: ['iise', 'sql', 'pipeline', 'data analyst'],
    reply: 'as a process & data analyst at IISE i turned a manual workflow into a SQL system (saving 10+ hours a week), automated a Python data pipeline (40% faster), and built a pipeline tracking 100+ candidates.',
  },
  {
    keys: ['editpk', 'elxigen', 'irvine', 'postgres'],
    reply: 'at EditPK i managed a PostgreSQL database of 200+ clients and manuscripts, maintained the React frontend, helped build a site for parent company Elxigen, and led a 5-person freelance editing team.',
  },
  {
    keys: ['cs10', 'teach', 'office hours', 'lab section', 'ta'],
    reply: "i'm a teaching intern for CS10: The Beauty and Joy of Computing. i hold 3-4 hours of office hours a week for 50+ students and lead 3+ lab sections. helping people get unstuck is the best feeling",
  },
  {
    keys: ['project', 'built', 'build', 'portfolio', 'github'],
    reply: 'my main projects are Ascend.AI (AI nutrition platform), Campus WiFi Monitor (live WiFi map), FocusFlow (pomodoro iOS app), and this site (React + Vite + three.js). code is at github.com/joliniscool!',
  },
  {
    keys: ['experience', 'work', 'job', 'resume', 'worked'],
    reply: "i've been at BuildBee (SWE intern), ACE Labs (LLM research), URAP (research website), IISE (data analyst), EditPK (SWE & data ops), and CS10 (teaching intern). scroll to the experience section for details!",
  },
  {
    keys: ['major', 'study', 'studying', 'school', 'berkeley', 'graduat', 'degree', 'ieor', 'eecs'],
    reply: "i'm at UC Berkeley double-majoring in Industrial Engineering & Operations Research and EECS, graduating May 2028. i love problems where optimization meets software.",
  },
  {
    keys: ['class', 'course', 'coursework'],
    reply: "i've taken Computer Architecture, SICP, Data Structures, Optimization Modeling, Linear Programming, Discrete Math & Probability, Business Statistics, Signal Processing, and Linear Algebra & ODEs.",
  },
  {
    keys: ['club', 'activit', 'plextech', 'swe', 'women', 'orientation'],
    reply: "i'm involved in PlexTech, Society of Women Engineers, GBO Orientation Leaders, and the Institute of Industrial & Systems Engineers.",
  },
  {
    keys: ['skill', 'language', 'stack', 'tech', 'framework', 'python', 'react', 'javascript'],
    reply: 'languages: Python, JavaScript, TypeScript, Java, Swift, C, RISC-V. frameworks: React, Next.js, Node/Express, Flask, MongoDB, SwiftUI. data: SQL, pandas, NumPy, Pyomo, AMPL. tools: Docker, GCP, Git.',
  },
  {
    keys: ['fun', 'hobb', 'free time', 'tennis', 'pickleball', 'spikeball', 'identity', 'art', 'beach', 'escape'],
    reply: "outside of CS i play tennis, pickleball and spikeball, do art and editing, and i'm always down for the beach, an escape room, or a round of Identity V ✨",
  },
  {
    keys: ['contact', 'email', 'reach', 'linkedin', 'hire', 'hiring', 'available', 'opportunit', 'recruit'],
    reply: "i'm open to internship opportunities! email is best: jolinwang@berkeley.edu. you can also find me at linkedin.com/in/jolintwang.",
  },
  {
    keys: ['this site', 'this website', 'made this', 'chatbot', 'are you ai', 'are you real', 'bot'],
    reply: "i'm an AI version of Jolin! this site is React + Vite + Tailwind + three.js, and the chat runs as a Python function on Vercel.",
  },
  {
    keys: ['hi', 'hello', 'hey', 'yo', 'sup'],
    exact: true,
    reply: "hi!! ask me about my projects, research, classes, or what i do for fun ✨",
  },
];

const words = (text) => text.toLowerCase().replace(/[^a-z0-9.\- ]/g, ' ').split(/\s+/).filter(Boolean);

const score = (topic, text, tokens) =>
  topic.keys.reduce((n, k) => {
    if (topic.exact || (k.length <= 3 && !k.includes(' '))) return n + (tokens.includes(k) ? 1 : 0);
    return n + (text.includes(k) ? 1 : 0);
  }, 0);

// Returns a canned reply when a question clearly matches a topic, else null.
// Long, detailed questions return null in `quick` mode so the real AI handles them.
export const localAnswer = (question, { quick = false } = {}) => {
  const text = question.toLowerCase();
  const tokens = words(question);
  let best = null;
  let bestScore = 0;
  for (const topic of TOPICS) {
    const s = score(topic, text, tokens);
    if (s > bestScore) { best = topic; bestScore = s; }
  }
  // Greetings only count for short messages, so "hi, what's your stack?" goes to the real topic
  if (best?.exact && tokens.length > 3) return null;
  if (quick && tokens.length > 12) return null;
  return best ? best.reply : null;
};

export const OFFLINE_REPLY =
  "my AI brain is taking a nap right now 😴 but i can still answer the basics: try asking about my projects, experience, classes, skills, or hobbies. or email me at jolinwang@berkeley.edu!";
