# Prompt Guru

Prompt Guru is a VS Code extension that turns vague or low-quality prompts into clear, model-specific prompts and routes the task to the most suitable AI model. It is designed to reduce wasted tokens, credits, and retries while improving first-pass output quality.

This project is a modified and extended version of the original Prompt Master concept created by Nidhin Joseph Nelson. It has been customized and expanded by Sai Sundar P to support a more direct VS Code workflow and stronger exact-model routing.

---

## What Prompt Guru does

- transforms weak prompts into cleaner, sharper prompts
- detects the task type: coding, reasoning, image, or writing
- routes to the best-fit AI model automatically
- allows exact model selection when needed
- outputs a final prompt that is ready to send to a target AI system
- keeps prompts compact so they use fewer tokens and credits

## Supported model categories

- GPT / OpenAI-style models
- Claude / Anthropic models
- Gemini / Google models
- Copilot / coding agents
- Midjourney / image generation
- Stable Diffusion / image generation
- Other reasoning or writing models

## Why it exists

Bad prompts create wasted cycles:

- vague instruction
- low-quality output
- re-prompting
- more credits consumed
- slower result delivery

Prompt Guru fixes this by optimizing the prompt before execution and choosing the right model for the job.

---

## Installation

1. Open the project folder in VS Code.
2. Run `npm install`.
3. Press `F5` to launch the Extension Development Host.
4. Use the Command Palette and run one of these commands:
   - Prompt Guru: Optimize Selected Prompt
   - Prompt Guru: Optimize Prompt from Input
   - Prompt Guru: Optimize for Exact AI Model

---

## Usage

### Optimize selected text

Select a rough prompt in a file and run:

- Prompt Guru: Optimize Selected Prompt

### Optimize from input

Run:

- Prompt Guru: Optimize Prompt from Input

Then paste the rough prompt when prompted.

### Optimize for a specific exact model

Run:

- Prompt Guru: Optimize for Exact AI Model

Then choose the exact target model. The extension will rewrite the prompt for that exact model and include routing guidance.

---

## Example

Input:

```
make a cool landing page for my SaaS product
```

Optimized output:

```
Target model/tool: Best-fit coding model (Copilot / Code-focused model)

Optimized prompt:
Objective: make a cool landing page for my SaaS product

Constraints: keep scope narrow, preserve existing contracts, define exact file paths or modules affected, include success criteria, and avoid unrelated changes.

Done When: the request is specific enough to implement without ambiguity.

Strategy: removed filler, clarified scope, tightened constraints, and improved signal-to-noise ratio to reduce retries and wasted tokens.
```

---

## Credits

- Original concept and inspiration: Prompt Master by Nidhin Joseph Nelson
- Modified and extended by: Sai Sundar P
- This project retains the original MIT licensing terms while adding attribution for the modified version

---

## License

This project is distributed under the MIT License. The original software was created by Nidhin Joseph Nelson, and this version is a modified and extended version created by Sai Sundar P.

---

## Notes

This extension is intended to be installed once per user and then reused across workspaces for rapid prompt improvement and AI model routing.

| **Figma Make** | Full-stack generator | Component name references, frame-to-code scope |
| **Google Stitch** | Full-stack generator | Interface goal over implementation, Material Design 3 spec |
| **Devin / SWE-agent** | Autonomous agent | Starting state, target state, stop conditions |
| **Manus** | Autonomous agent | Task outcome focus, permission scope, memory anchors |
| **OpenAI Computer Use** | Computer-use agent | Screen state, allowed apps, stop before irreversible actions |
| **Perplexity Computer** | Computer-use agent | Artifact-first prompting, scoped permissions, verification steps |
| **OpenClaw** | Computer-use agent | Conversational precision, persistent memory, security constraints |
| **Perplexity / SearchGPT** | Search AI | Mode spec: search vs analyze vs compare |
| **Midjourney** | Image AI | Comma-separated descriptors, parameters, negative prompts |
| **DALL-E 3** | Image AI | Prose description, text exclusion — edit vs generate detection |
| **Stable Diffusion** | Image AI | Weight syntax `(word:1.3)`, CFG guidance, mandatory negative prompt |
| **SeeDream** | Image AI | Art style first, mood and atmosphere descriptors, negative prompt |
| **ComfyUI** | Image AI | Positive/negative node split, checkpoint-specific syntax |
| **Meshy / Tripo / Rodin** | 3D AI | Style + export format + polygon budget + rig requirements |
| **BlenderGPT** | 3D AI | Python script output, Blender version, scene context |
| **Unity AI** | 3D / Game AI | Game genre, platform target, mechanic description over code |
| **Sora / Runway** | Video AI | Camera movement, duration, cut style |
| **LTX / Dream Machine / Kling** | Video AI | Cinematic language, motion intensity, style reference |
| **ElevenLabs** | Voice AI | Emotion, pacing, emphasis, speech rate |
| **Zapier / Make / n8n** | Workflow automation | Trigger app + event, action app + field mapping |

</details>

---

## 📐 13 Prompt Templates (Auto-Selected)

Prompt Master picks the right architecture for every task automatically and routes silently — you never see the framework name, just the prompt.

<details>
<summary><h3> Click to view all 13 templates</h3></summary>

| Template | Best For |
|----------|----------|
| **RTF** (Role, Task, Format) | Fast one-shot tasks |
| **CO-STAR** (Context, Objective, Style, Tone, Audience, Response) | Professional documents, reports, business writing |
| **RISEN** (Role, Instructions, Steps, End Goal, Narrowing) | Complex multi-step projects |
| **CRISPE** (Capacity, Role, Insight, Statement, Personality, Experiment) | Creative work, brand voice, iterative content |
| **Auditable Reasoning** | Checkable math, logic, debugging, and analysis without hidden reasoning requests |
| **Few-Shot** | Consistent structured output, pattern replication |
| **File-Scope Template** | Cursor, Windsurf, Copilot — any code editing AI |
| **ReAct + Stop Conditions** | Claude Code, Devin, AutoGPT — any autonomous agent |
| **Visual Descriptor** | Midjourney, DALL-E, Stable Diffusion, Sora — generation |
| **Reference Image Editing** | Editing an existing image — detects edit vs generate automatically |
| **ComfyUI** | Node-based image workflows — positive/negative split per checkpoint |
| **Prompt Decompiler** | Breaking down, adapting, simplifying, or splitting existing prompts |
| **Current Claude Task Brief** | Complex, multi-step, or agentic tasks on current Claude models |

</details>

---

## 🛡️ 5 Safe Techniques, Applied When Needed

Prompt Master only uses techniques with reliable, bounded effects. Methods known to produce hallucinations or unpredictable output (Tree of Thought, Graph of Thought, Universal Self-Consistency, prompt chaining) are explicitly excluded.

| Technique | What It Does |
|-----------|-------------|
| **Role Assignment** | Assigns a specific expert identity to calibrate depth and vocabulary |
| **Few-Shot Examples** | Adds 2-5 examples when format consistency matters more than instructions |
| **XML Structural Tags** | Wraps sections in XML for Claude-based tools that parse it reliably |
| **Grounding Anchors** | Adds anti-hallucination rules for factual and citation tasks |
| **Auditable Reasoning** | Requests conclusions, assumptions, evidence, and verification without hidden reasoning |

---

## 🚫 37 Credit-Killing Patterns Detected (with Before/After Examples)

<details>
<summary><h3> Task Patterns (7)</h3></summary>

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 1 | **Vague task verb** | "help me with my code" | "Refactor `getUserData()` to use async/await and handle null returns" |
| 2 | **Two tasks in one prompt** | "explain AND rewrite this function" | Split: explain first, rewrite second |
| 3 | **No success criteria** | "make it better" | "Done when function passes existing unit tests and handles null input" |
| 4 | **Over-permissive agent** | "do whatever it takes" | Explicit allowed + forbidden actions list |
| 5 | **Emotional task description** | "it's totally broken, fix everything" | "Throws uncaught TypeError on line 43 when `user` is null" |
| 6 | **Build-the-whole-thing** | "build my entire app" | Break into Prompt 1 (scaffold), Prompt 2 (feature), Prompt 3 (polish) |
| 7 | **Implicit reference** | "now add the other thing we discussed" | Always restate the full task, never reference "the thing we discussed" |

</details>

<details>
<summary><h3> Context Patterns (6)</h3></summary>

### Context Patterns

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 8 | **Assumed prior knowledge** | "continue where we left off" | Include Memory Block with all prior decisions |
| 9 | **No project context** | "write a cover letter" | "PM role at B2B fintech, 2yr SWE experience, shipped 3 features as tech lead" |
| 10 | **Forgotten stack** | New prompt contradicts prior tech choice | Always include Memory Block |
| 11 | **Hallucination invite** | "what do experts say about X?" | "Cite only sources you are certain of. If uncertain, say so." |
| 12 | **Undefined audience** | "write something for users" | "Non-technical B2B buyers, no coding knowledge, decision-maker level" |
| 13 | **No mention of prior failures** | (blank) | "I already tried X and it failed because Y. Do not suggest X." |

</details>


<details>
<summary><h3> Format Patterns (6)</h3></summary>

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 14 | **Missing output format** | "explain this concept" | "3 bullet points, each under 20 words, one-sentence summary at top" |
| 15 | **Implicit length** | "write a summary" | "Write a summary in exactly 3 sentences" |
| 16 | **No role assignment** | (blank) | "You are a senior backend engineer specializing in Node.js and PostgreSQL" |
| 17 | **Vague aesthetic adjectives** | "make it look professional" | "Monochrome palette, 16px base font, 24px line height, no decorative elements" |
| 18 | **No negative prompts (image AI)** | "a portrait of a woman" | Add: "no watermark, no blur, no extra fingers, no distortion, no text" |
| 19 | **Prose prompt for Midjourney** | Full descriptive sentence | "subject, style, mood, lighting, --ar 16:9 --v 6" |

</details>


<details>
<summary><h3> Scope Patterns (6)</h3></summary>

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 20 | **No scope boundary** | "fix my app" | "Fix only login form validation in `src/auth.js`. Touch nothing else." |
| 21 | **No stack constraints** | "build a React component" | "React 18, TypeScript strict, no external libraries, Tailwind only" |
| 22 | **No stop condition for agents** | "build the whole feature" | Explicit stop conditions + checkpoint after each step |
| 23 | **No file path for IDE AI** | "update the login function" | "Update `handleLogin()` in `src/pages/Login.tsx` only" |
| 24 | **Wrong template for tool** | GPT-style prose used in Cursor | Adapted to File-Scope Template with path + scope |
| 25 | **Pasting entire codebase** | Full repo context every prompt | Scoped to relevant function and file only |

</details>


<details>
<summary><h3> Reasoning Patterns (5)</h3></summary>

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 26 | **No audit contract for logic task** | "which approach is better?" | Request the recommendation, assumptions, criteria, evidence, and checks |
| 27 | **Requesting hidden reasoning** | "show your chain of thought" | Ask for a concise rationale, evidence, and verification instead |
| 28 | **Expecting inter-session memory** | "you already know my project" | Re-provide the Memory Block in every new session |
| 29 | **Contradicting prior work** | New prompt ignores earlier architecture | Include established decisions in the Memory Block |
| 30 | **No grounding rule for factual tasks** | "summarize what experts say about X" | Require verifiable sources and explicit uncertainty |

</details>

<details>
<summary><h3> Agentic Patterns (7)</h3></summary>

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 31 | **No starting state** | "build me a REST API" | "Empty Node.js project, Express installed, `src/app.js` exists" |
| 32 | **No target state** | "add authentication" | "`/src/middleware/auth.js` with JWT verify. `POST /login` and `POST /register` in `/src/routes/auth.js`" |
| 33 | **Silent agent** | No progress output | "After each step output: ✅ [what was completed]" |
| 34 | **Unlocked filesystem** | No file restrictions | "Only edit files inside `src/`. Do not touch `package.json`, `.env`, or any config file." |
| 35 | **No human review trigger** | Agent decides everything | "Stop and ask before: deleting any file, adding any dependency, or touching the database schema" |
| 36 | **Vague first turn for an agentic model** | "fix the auth bug" with no scope, files, or criteria | Front-load outcome, context, scope, boundaries, and acceptance criteria |
| 37 | **Context rot on long sessions** | Repeated corrections leave stale assumptions in context | Start fresh for unrelated work or compact around current decisions and state |

</details>

---

## 🧠 Memory Block System

When your conversation has history, Prompt Master pulls out prior decisions and prepends a Memory Block so the AI never contradicts earlier work:

```
## Memory (Carry Forward from Previous Context)
- Stack: React 18 + TypeScript + Supabase
- Auth uses JWT stored in httpOnly cookies, not localStorage
- Component naming convention: PascalCase, no default exports
- Design system: Tailwind only, no custom CSS files
- Architecture: no Redux, context API only
```

This is the single biggest fix for long sessions. Most wasted re-prompts come from the AI forgetting what you already decided.

---

## ℹ️ Version History

- **1.8.0** — Current-model refresh. Added Claude Fable 5, Opus 5, Sonnet 5, GPT-5.6 Sol/Terra/Luna, Codex, and Grok 4.6 routing. Replaced hidden chain-of-thought requests with auditable reasoning and generalized the Claude task brief for current adaptive-thinking models.
- **1.7.0** — Opus 4.8 compatibility. Made Claude 4.x routing version-aware: durable advice generalized across 4.6/4.7/4.8, added Opus 4.8 (current default) profile, kept Opus 4.7 labeled. De-hardcoded the effort-level note (now harness-managed). Template M and pattern 36 cover 4.7 and 4.8. Fixed a stray fragment in patterns.md.
- **1.6.0** — Opus 4.7 update. Added Template M (Opus 4.7 Task Brief). Updated Claude and Claude Code routing for literalism, adaptive thinking, xhigh effort, and session hygiene. Added patterns 36–37.
- **1.5.0** — Added more tool routing. New Agentic AI and 3D Model AI routing added. Fixed description to 189 chars. Removed token estimate from output. Added instruction layer and copywriting placeholders
- **1.4.0** — Added reference image editing detection, ComfyUI support, Prompt Decompiler mode. Fixed trigger description to invoke correctly in Claude Code. 3 new templates added to references folder
- **1.3.0** — Rebuilt around PAC2026 positional structure (30/55/15). Silent routing replaces user-facing framework selection. References folder introduced
- **1.2.0** — Restructured for attention architecture. Removed fabrication-prone techniques (ToT, GoT, USC, prompt chaining). Templates and patterns moved to references folder
- **1.1.0** — Expanded tool coverage, added memory block system, 35 credit killing patterns
- **1.0.0** — Initial release

---

## 📄 License

MIT: See [LICENSE](LICENSE) for details.

---

## ⭐ Star History

[![Star History Chart](https://star-history.dera.page/svg?repos=nidhinjs/prompt-master&type=Date)](https://star-history.dera.page/#nidhinjs/prompt-master&Date)

---
