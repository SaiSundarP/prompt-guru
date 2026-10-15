# Prompt Guru

Prompt Guru is a VS Code extension that converts weak, vague, or under-specified prompts into clear, model-specific prompts. It detects the likely task type and provides presets for preparing prompts to use with coding, reasoning, image, and writing models. This helps reduce wasted tokens, retries, and confusion.

This project is a modified and extended version of the original Prompt Master concept created by Nidhin Joseph Nelson. It has been expanded by Sai Sundar P to support a stronger VS Code workflow, exact-model routing, and a dedicated extension panel.

---

## ✅ What Prompt Guru does

- rewrites weak prompts into cleaner, sharper prompts
- detects the task type: coding, reasoning, image, or writing
- applies model presets per task type
- recommends a task category and provides task-specific model presets
- supports exact-model prompt formatting for GPT, Claude, Gemini, Copilot, Midjourney, and Stable Diffusion
- adds an `@prompt-guru` Copilot Chat participant that optimizes requests and sends them to the model selected in that chat turn
- opens as a dedicated VS Code panel
- includes a copy-to-clipboard action for fast reuse
- packages neatly into a VSIX for installation across workspaces

---

## 🧩 Included features

### 1. Prompt Guru panel

The extension opens a dedicated panel with:
- prompt input box
- task type selector
- model preset selector
- generate action
- copy-to-clipboard action
- clear/reset action
- result area for generated prompts

### 2. Model presets per task type

The extension ships with preset groups for:
- coding: GitHub Copilot, Claude Code, Cursor/Windsurf
- reasoning: GPT-4o, Claude 3.5 Sonnet, Gemini 2.5 Pro
- image: Midjourney, Stable Diffusion, DALL-E / image model
- writing: Claude writing model, GPT writing model

### 3. Copy to clipboard

Inside the panel, the generated output can be copied directly to the clipboard with one click.

### 4. Copilot Chat routing

In VS Code Chat, address a request to `@prompt-guru`. The extension detects the task, builds an optimized prompt for the model currently selected in that chat, sends it through VS Code's Language Model API, and streams the model's answer back. The optimized prompt is shown in the chat response so you can see what was sent. The first model request may ask you to grant the extension permission.

This participant must be invoked with `@prompt-guru`; VS Code does not let extensions intercept ordinary, unprefixed messages or messages sent to other chat participants. The panel's Midjourney and Stable Diffusion presets only prepare text and do not submit to those external services.

### 5. VSIX packaging

The extension includes a packaging script to generate a `.vsix` file for installation in any VS Code environment.

---

## 🚀 Installation and development

### Run it locally in VS Code

1. Open the project folder in VS Code.
2. Run `npm install`.
3. Press `F5` to launch the Extension Development Host.
4. In the new VS Code window, open the Command Palette.
5. Run one of these commands:
   - `Prompt Guru: Open Panel`
   - `Prompt Guru: Optimize Selected Prompt`
   - `Prompt Guru: Optimize Prompt from Input`
   - `Prompt Guru: Optimize for Exact AI Model`

### Package it for global installation

From the project root:

```bash
npm install
npm run package:vsix
```

This produces a `.vsix` file. Install it in VS Code by:
1. opening the Extensions panel
2. selecting the `...` menu
3. choosing `Install from VSIX...`
4. picking the generated package

---

## 🛠️ How to use it in VS Code

### Open the main panel

Use the Command Palette and run:

- `Prompt Guru: Open Panel`

This opens the primary Prompt Guru panel.

### Optimize a selected prompt

1. Select text in any file.
2. Run `Prompt Guru: Optimize Selected Prompt`.
3. The selected prompt is loaded into the panel.

### Optimize from input

1. Run `Prompt Guru: Optimize Prompt from Input`.
2. Enter or paste the rough prompt.
3. Leave `Task type` on `Auto detect`, or choose a task type and model preset.
4. Click `Generate`.
5. Click `Copy` if you want to reuse the prompt immediately.

### Optimize for an exact model

1. Run `Prompt Guru: Optimize for Exact AI Model`.
2. Choose the task type.
3. Choose the exact model.
4. Paste the rough prompt.
5. The extension generates a model-specific prompt with guidance. Copy it into the selected AI tool to run it there.

### Send an optimized request directly from chat

1. Open VS Code Chat and select the model you want to use.
2. Enter `@prompt-guru` followed by your request, for example: `@prompt-guru explain this function and suggest a safer implementation`.
3. Prompt Guru displays the optimized prompt it sent, then streams the selected model's answer in the chat.

This integration uses the model selected in Copilot Chat for that turn. It does not silently reroute an ordinary chat message or control chat extensions other than its own `@prompt-guru` participant.

---

## 🧪 Example

### Input

```text
make a cool landing page for my SaaS product
```

### Generated output

```text
Exact model selected: GitHub Copilot / coding agent
Recommended default model for this task: GitHub Copilot / coding agent

Model-specific instruction: Write a code-focused prompt with narrow scope, file boundaries, exact requirements, and a strict Done When clause.

Optimized prompt:
Objective: make a cool landing page for my SaaS product

Constraints: keep scope narrow, preserve the current contract, name the exact file or module involved, define success criteria, and avoid unrelated work.

Done When: the task is precise enough to implement without guessing.

Strategy: removed filler, clarified the task, tightened constraints, and improved signal-to-noise ratio so the model can execute correctly on the first pass.
```

---

## 📌 Credits and attribution

- Original concept: Prompt Master by Nidhin Joseph Nelson
- Modified and extended by: Sai Sundar P
- This project retains the original MIT licensing terms while adding attribution for the revised extension

---

## 📄 License

This project is distributed under the MIT License.

This software includes the original Prompt Master concept by Nidhin Joseph Nelson and is a modified, enhanced, and redistributed version created by Sai Sundar P.

---

## 💡 Why this matters

Better prompts reduce:
- wasted token usage
- unnecessary retries
- poor AI output quality
- credit burn from vague instructions

Task detection and model presets help tailor the prompt to the intended model, while model execution remains in the AI tool you choose.

---

## Notes

This extension is intended to be installed once per user and reused across workspaces whenever a prompt needs optimization.
