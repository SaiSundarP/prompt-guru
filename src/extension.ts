import * as vscode from 'vscode';

type TaskType = 'coding' | 'reasoning' | 'image' | 'writing';

type ModelPreset = {
  id: string;
  label: string;
  instruction: string;
};

const MODEL_PRESETS: Record<TaskType, ModelPreset[]> = {
  coding: [
    { id: 'copilot', label: 'GitHub Copilot / coding agent', instruction: 'Write a code-focused prompt with narrow scope, file boundaries, exact requirements, and a strict Done When clause.' },
    { id: 'claude-code', label: 'Claude Code', instruction: 'Write a coding prompt for Claude Code with explicit file scope, constraints, verification steps, and stop conditions.' },
    { id: 'cursor', label: 'Cursor / Windsurf', instruction: 'Write a focused IDE prompt with exact file paths, function names, and a do-not-touch list.' }
  ],
  reasoning: [
    { id: 'gpt4o', label: 'GPT-4o', instruction: 'Write a crisp, high-signal prompt optimized for GPT-4o with explicit scope, constraints, and direct answer structure.' },
    { id: 'claude-35', label: 'Claude 3.5 Sonnet', instruction: 'Write a structured prompt for Claude 3.5 Sonnet with clear task framing, output requirements, and guardrails.' },
    { id: 'gemini', label: 'Gemini 2.5 Pro', instruction: 'Write a grounded prompt for Gemini 2.5 Pro with clear context, constraints, and expected output.' }
  ],
  image: [
    { id: 'midjourney', label: 'Midjourney', instruction: 'Write a visual prompt with subject, mood, lighting, camera angle, composition, negative prompts, and aspect ratio.' },
    { id: 'sdxl', label: 'Stable Diffusion', instruction: 'Write a stable diffusion prompt with subject, style, composition, negative prompt, quality tags, and render setup.' },
    { id: 'dalle', label: 'DALL-E / image model', instruction: 'Write a clean image-generation prompt that is detailed, visually specific, and optimized for image quality.' }
  ],
  writing: [
    { id: 'claude-write', label: 'Claude / writing model', instruction: 'Write a concise, structured prompt with audience, tone, format, output length, and success criteria.' },
    { id: 'gpt-write', label: 'GPT / writing model', instruction: 'Write a polished writing prompt with explicit audience, structure, tone, and output requirements.' }
  ]
};

function detectTaskType(prompt: string): TaskType {
  const lower = prompt.toLowerCase();

  if (/(code|function|fix|bug|debug|api|component|module|file|class|ts|js|python|react|node|sql|implement|refactor|build)/.test(lower)) {
    return 'coding';
  }

  if (/(image|photo|illustration|midjourney|stable diffusion|dall|poster|scene|portrait|background|lighting|render|visual|art)/.test(lower)) {
    return 'image';
  }

  if (/(write|article|blog|email|summary|rewrite|headline|copy|essay|story|letter|text|script)/.test(lower)) {
    return 'writing';
  }

  return 'reasoning';
}

function getTaskDefaults(taskType: TaskType): string {
  switch (taskType) {
    case 'coding':
      return 'copilot';
    case 'image':
      return 'midjourney';
    case 'writing':
      return 'claude-write';
    default:
      return 'gpt4o';
  }
}

function cleanPrompt(raw: string): string {
  return raw
    .replace(/\bplease\b/gi, '')
    .replace(/\bcan you\b/gi, '')
    .replace(/\bkindly\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildOptimizedPrompt(raw: string, taskType: TaskType, modelId: string): string {
  const cleaned = cleanPrompt(raw);
  const base = cleaned
    .replace(/^\s*[-*]\s*/gm, '')
    .replace(/\s*:\s*/g, ': ')
    .replace(/\s+/g, ' ')
    .trim();

  const preset = MODEL_PRESETS[taskType].find((candidate) => candidate.id === modelId) ?? MODEL_PRESETS[taskType][0];

  let optimized = base;

  if (taskType === 'coding') {
    optimized = `Objective: ${base}\n\nConstraints: keep scope narrow, preserve the current contract, name the exact file or module involved, define success criteria, and avoid unrelated work.\n\nDone When: the task is precise enough to implement without guessing.`;
  } else if (taskType === 'image') {
    optimized = `Subject: ${base}\n\nVisual requirements: cinematic composition, precise subject, strong lighting, clear mood, consistent style, explicit camera framing, and a strong final aesthetic.\n\nNegative prompts: blurry, low detail, distorted anatomy, text, watermark, duplicate objects, cluttered composition.`;
  } else if (taskType === 'writing') {
    optimized = `Task: ${base}\n\nRequirements: define the audience, tone, structure, format, output length, and success criteria. Keep the answer concise, clear, and fully actionable.`;
  } else {
    optimized = `Task: ${base}\n\nRequirements: be explicit about context, constraints, desired output, and success criteria. Keep the answer compact and directly actionable.`;
  }

  return `Exact model selected: ${preset.label}\nRecommended default model for this task: ${MODEL_PRESETS[taskType][0].label}\n\nModel-specific instruction: ${preset.instruction}\n\nOptimized prompt:\n${optimized}\n\nStrategy: removed filler, clarified the task, tightened constraints, and improved signal-to-noise ratio so the model can execute correctly on the first pass.`;
}

function getPresetData(): Record<string, Array<{ id: string; label: string; instruction: string }>> {
  return {
    coding: MODEL_PRESETS.coding,
    reasoning: MODEL_PRESETS.reasoning,
    image: MODEL_PRESETS.image,
    writing: MODEL_PRESETS.writing
  };
}

function getWebviewHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const iconUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'icon.svg'));
  const nonce = getNonce();
  const presets = JSON.stringify(getPresetData());

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Prompt Guru</title>
        <style>
          :root {
            color-scheme: dark;
            --bg: #111827;
            --panel: #1f2937;
            --panel-strong: #0f172a;
            --border: #374151;
            --text: #f9fafb;
            --muted: #cbd5e1;
            --accent: #8b5cf6;
            --accent-2: #3b82f6;
            --success: #34d399;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--bg);
            color: var(--text);
            font-family: var(--vscode-font-family, sans-serif);
            padding: 12px;
          }
          .container {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border);
          }
          .header img {
            width: 28px;
            height: 28px;
            border-radius: 8px;
          }
          .header h2 {
            margin: 0;
            font-size: 20px;
          }
          label {
            display: block;
            font-size: 12px;
            color: var(--muted);
            margin-bottom: 6px;
          }
          textarea, select, button {
            width: 100%;
            border-radius: 8px;
            border: 1px solid var(--border);
            background: var(--panel-strong);
            color: var(--text);
            font: inherit;
          }
          textarea, select {
            padding: 10px 12px;
          }
          textarea {
            min-height: 130px;
            resize: vertical;
          }
          .actions {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
          }
          button {
            cursor: pointer;
            padding: 10px 12px;
            background: linear-gradient(135deg, var(--accent), var(--accent-2));
            border: none;
            font-weight: 600;
          }
          button.secondary {
            background: var(--panel);
            border: 1px solid var(--border);
          }
          .status {
            min-height: 18px;
            font-size: 12px;
            color: var(--muted);
          }
          .result {
            min-height: 180px;
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 12px;
            white-space: pre-wrap;
            overflow: auto;
            font-size: 12px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${iconUri}" alt="Prompt Guru icon" />
            <h2>Prompt Guru</h2>
          </div>

          <div>
            <label for="taskType">Task type</label>
            <select id="taskType">
              <option value="auto">Auto detect</option>
              <option value="coding">Coding</option>
              <option value="reasoning">Reasoning</option>
              <option value="image">Image</option>
              <option value="writing">Writing</option>
            </select>
          </div>

          <div>
            <label for="modelPreset">Model preset</label>
            <select id="modelPreset"></select>
          </div>

          <div>
            <label for="promptInput">Prompt</label>
            <textarea id="promptInput" placeholder="Paste a rough or vague prompt here..."></textarea>
          </div>

          <div class="actions">
            <button id="generateBtn">Generate</button>
            <button id="copyBtn" class="secondary">Copy</button>
            <button id="clearBtn" class="secondary">Clear</button>
          </div>

          <div id="status" class="status"></div>
          <div id="result" class="result">Generated output will appear here.</div>
        </div>

        <script nonce="${nonce}">
          const vscode = acquireVsCodeApi();
          const presets = ${presets};
          const taskTypeSelect = document.getElementById('taskType');
          const modelSelect = document.getElementById('modelPreset');
          const promptInput = document.getElementById('promptInput');
          const resultBox = document.getElementById('result');
          const statusBox = document.getElementById('status');

          function populateModels() {
            const selectedTask = taskTypeSelect.value;
            const options = presets[selectedTask] || presets.coding || [];
            modelSelect.innerHTML = '';
            modelSelect.disabled = selectedTask === 'auto';
            options.forEach((preset) => {
              const option = document.createElement('option');
              option.value = preset.id;
              option.textContent = preset.label;
              modelSelect.appendChild(option);
            });
            modelSelect.value = options[0]?.id || '';
          }

          taskTypeSelect.addEventListener('change', populateModels);

          document.getElementById('generateBtn').addEventListener('click', () => {
            const prompt = promptInput.value.trim();
            if (!prompt) {
              statusBox.textContent = 'Please enter a prompt first.';
              return;
            }
            statusBox.textContent = 'Generating optimized prompt...';
            vscode.postMessage({
              type: 'generate',
              prompt,
              taskType: taskTypeSelect.value,
              modelId: modelSelect.value
            });
          });

          document.getElementById('copyBtn').addEventListener('click', () => {
            const text = resultBox.textContent.trim();
            if (!text || text === 'Generated output will appear here.') {
              statusBox.textContent = 'There is no generated prompt to copy yet.';
              return;
            }
            statusBox.textContent = 'Copying to clipboard...';
            vscode.postMessage({ type: 'copy', value: text });
          });

          document.getElementById('clearBtn').addEventListener('click', () => {
            promptInput.value = '';
            resultBox.textContent = 'Generated output will appear here.';
            statusBox.textContent = 'Cleared.';
          });

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (!message) return;

            if (message.type === 'setTaskType') {
              taskTypeSelect.value = message.value;
              populateModels();
            }

            if (message.type === 'setModel') {
              modelSelect.value = message.value;
            }

            if (message.type === 'result') {
              resultBox.textContent = message.value;
              statusBox.textContent = 'Prompt optimized successfully.';
            }

            if (message.type === 'copyStatus') {
              statusBox.textContent = message.value;
            }

            if (message.type === 'prefill') {
              promptInput.value = message.value || '';
              statusBox.textContent = 'Loaded selection into the prompt panel.';
            }
          });

          populateModels();
          vscode.postMessage({ type: 'ready' });
        </script>
      </body>
    </html>`;
}

function getNonce(): string {
  return Array.from({ length: 16 }, () => Math.random().toString(16).slice(2)).join('');
}

let extensionContext: vscode.ExtensionContext | undefined;

function openPromptGuruPanel(initialText?: string, taskType?: TaskType, modelId?: string): vscode.WebviewPanel {
  if (!extensionContext) {
    throw new Error('Prompt Guru extension context is not initialized.');
  }

  const panel = vscode.window.createWebviewPanel(
    'promptGuruPanel',
    'Prompt Guru',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(extensionContext.extensionUri, 'media')],
      retainContextWhenHidden: true
    }
  );

  panel.webview.html = getWebviewHtml(panel.webview, extensionContext.extensionUri);

  panel.webview.onDidReceiveMessage(async (message) => {
    switch (message.type) {
      case 'ready': {
        if (initialText) {
          panel.webview.postMessage({ type: 'prefill', value: initialText });
        }

        if (taskType) {
          panel.webview.postMessage({ type: 'setTaskType', value: taskType });
        }

        if (modelId) {
          panel.webview.postMessage({ type: 'setModel', value: modelId });
        }
        break;
      }

      case 'generate': {
        const taskType = MODEL_PRESETS[message.taskType as TaskType]
          ? message.taskType as TaskType
          : detectTaskType(message.prompt || '');
        const selectedPreset = MODEL_PRESETS[taskType].some((preset) => preset.id === message.modelId)
          ? message.modelId
          : getTaskDefaults(taskType);
        const result = buildOptimizedPrompt(message.prompt, taskType, selectedPreset);
        panel.webview.postMessage({ type: 'result', value: result });
        break;
      }

      case 'copy': {
        await vscode.env.clipboard.writeText(String(message.value || ''));
        panel.webview.postMessage({ type: 'copyStatus', value: 'Copied to clipboard.' });
        break;
      }

      default:
        break;
    }
  });

  return panel;
}

async function optimizePromptFromInput(): Promise<void> {
  const input = await vscode.window.showInputBox({
    prompt: 'Enter a rough prompt to optimize',
    placeHolder: 'Example: create a landing page for a SaaS product',
    ignoreFocusOut: true
  });

  if (!input || !input.trim()) {
    return;
  }

  openPromptGuruPanel(input);
}

async function optimizeSelection(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('Open a file or select text before running Prompt Guru.');
    return;
  }

  const selection = editor.document.getText(editor.selection);
  const raw = selection || editor.document.getText();

  if (!raw.trim()) {
    vscode.window.showInformationMessage('No prompt text was selected.');
    return;
  }

  openPromptGuruPanel(raw);
}

async function optimizeForExactModel(): Promise<void> {
  const taskSelection = await vscode.window.showQuickPick(
    [
      { label: 'Coding', value: 'coding' },
      { label: 'Reasoning', value: 'reasoning' },
      { label: 'Image', value: 'image' },
      { label: 'Writing', value: 'writing' }
    ],
    { placeHolder: 'Choose task type', ignoreFocusOut: true }
  );

  if (!taskSelection) {
    return;
  }

  const modelSelection = await vscode.window.showQuickPick(
    MODEL_PRESETS[taskSelection.value as TaskType].map((preset) => ({ label: preset.label, value: preset.id })),
    { placeHolder: 'Choose exact model', ignoreFocusOut: true }
  );

  if (!modelSelection) {
    return;
  }

  const input = await vscode.window.showInputBox({
    prompt: `Enter the rough prompt to optimize for ${modelSelection.label}`,
    placeHolder: 'Example: create a SaaS dashboard with a crisp modern UI',
    ignoreFocusOut: true
  });

  if (!input || !input.trim()) {
    return;
  }

  openPromptGuruPanel(input, taskSelection.value as TaskType, modelSelection.value);
}

export function activate(context: vscode.ExtensionContext): void {
  extensionContext = context;

  const openPanelCommand = vscode.commands.registerCommand('promptGuru.openPanel', () => openPromptGuruPanel());
  const optimizeSelectionCommand = vscode.commands.registerCommand('promptGuru.optimizeSelection', optimizeSelection);
  const optimizeInputCommand = vscode.commands.registerCommand('promptGuru.optimizeInput', optimizePromptFromInput);
  const optimizeForModelCommand = vscode.commands.registerCommand('promptGuru.optimizeForModel', optimizeForExactModel);

  context.subscriptions.push(openPanelCommand, optimizeSelectionCommand, optimizeInputCommand, optimizeForModelCommand);
}

export function deactivate(): void {
  extensionContext = undefined;
}
