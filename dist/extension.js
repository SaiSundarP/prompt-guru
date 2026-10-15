"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const MODEL_PRESETS = {
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
function detectTaskType(prompt) {
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
function getTaskDefaults(taskType) {
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
function cleanPrompt(raw) {
    return raw
        .replace(/\bplease\b/gi, '')
        .replace(/\bcan you\b/gi, '')
        .replace(/\bkindly\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
}
function buildOptimizedPrompt(raw, taskType, modelId, targetModel) {
    const cleaned = cleanPrompt(raw);
    const base = cleaned
        .replace(/^\s*[-*]\s*/gm, '')
        .replace(/\s*:\s*/g, ': ')
        .replace(/\s+/g, ' ')
        .trim();
    const preset = MODEL_PRESETS[taskType].find((candidate) => candidate.id === modelId) ?? MODEL_PRESETS[taskType][0];
    const selectedModel = targetModel ?? preset;
    let optimized = base;
    if (taskType === 'coding') {
        optimized = `Objective: ${base}\n\nConstraints: keep scope narrow, preserve the current contract, name the exact file or module involved, define success criteria, and avoid unrelated work.\n\nDone When: the task is precise enough to implement without guessing.`;
    }
    else if (taskType === 'image') {
        optimized = `Subject: ${base}\n\nVisual requirements: cinematic composition, precise subject, strong lighting, clear mood, consistent style, explicit camera framing, and a strong final aesthetic.\n\nNegative prompts: blurry, low detail, distorted anatomy, text, watermark, duplicate objects, cluttered composition.`;
    }
    else if (taskType === 'writing') {
        optimized = `Task: ${base}\n\nRequirements: define the audience, tone, structure, format, output length, and success criteria. Keep the answer concise, clear, and fully actionable.`;
    }
    else {
        optimized = `Task: ${base}\n\nRequirements: be explicit about context, constraints, desired output, and success criteria. Keep the answer compact and directly actionable.`;
    }
    return `Exact model selected: ${selectedModel.label}\nRecommended default model for this task: ${MODEL_PRESETS[taskType][0].label}\n\nModel-specific instruction: ${selectedModel.instruction}\n\nOptimized prompt:\n${optimized}\n\nStrategy: removed filler, clarified the task, tightened constraints, and improved signal-to-noise ratio so the model can execute correctly on the first pass.`;
}
function getPresetData() {
    return {
        coding: MODEL_PRESETS.coding,
        reasoning: MODEL_PRESETS.reasoning,
        image: MODEL_PRESETS.image,
        writing: MODEL_PRESETS.writing
    };
}
function getWebviewHtml(webview, extensionUri) {
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
function getNonce() {
    return Array.from({ length: 16 }, () => Math.random().toString(16).slice(2)).join('');
}
let extensionContext;
function openPromptGuruPanel(initialText, taskType, modelId) {
    if (!extensionContext) {
        throw new Error('Prompt Guru extension context is not initialized.');
    }
    const panel = vscode.window.createWebviewPanel('promptGuruPanel', 'Prompt Guru', vscode.ViewColumn.One, {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionContext.extensionUri, 'media')],
        retainContextWhenHidden: true
    });
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
                const taskType = MODEL_PRESETS[message.taskType]
                    ? message.taskType
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
async function optimizePromptFromInput() {
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
async function optimizeSelection() {
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
async function optimizeForExactModel() {
    const taskSelection = await vscode.window.showQuickPick([
        { label: 'Coding', value: 'coding' },
        { label: 'Reasoning', value: 'reasoning' },
        { label: 'Image', value: 'image' },
        { label: 'Writing', value: 'writing' }
    ], { placeHolder: 'Choose task type', ignoreFocusOut: true });
    if (!taskSelection) {
        return;
    }
    const modelSelection = await vscode.window.showQuickPick(MODEL_PRESETS[taskSelection.value].map((preset) => ({ label: preset.label, value: preset.id })), { placeHolder: 'Choose exact model', ignoreFocusOut: true });
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
    openPromptGuruPanel(input, taskSelection.value, modelSelection.value);
}
const workspaceTools = [
    {
        name: 'list_workspace_files',
        description: 'List relevant files in the open workspace before making a coding change.',
        inputSchema: {
            type: 'object',
            properties: { query: { type: 'string', description: 'Optional filename or path substring to filter by.' } }
        }
    },
    {
        name: 'read_workspace_file',
        description: 'Read a UTF-8 text file from the open workspace. Read files before editing them.',
        inputSchema: {
            type: 'object',
            properties: { path: { type: 'string', description: 'Workspace-relative file path.' } },
            required: ['path']
        }
    },
    {
        name: 'edit_workspace_file',
        description: 'Propose replacing an existing workspace file or creating a new one with UTF-8 text. Read existing files first. The user must approve each edit.',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Workspace-relative file path previously read.' },
                content: { type: 'string', description: 'Complete updated file contents.' }
            },
            required: ['path', 'content']
        }
    }
];
function getWorkspaceTarget(relativePath) {
    const root = vscode.workspace.workspaceFolders?.[0];
    if (!root) {
        return 'No workspace folder is open.';
    }
    if (typeof relativePath !== 'string' || !relativePath.trim()) {
        return 'A non-empty workspace-relative path is required.';
    }
    const normalized = relativePath.replace(/\\/g, '/');
    const segments = normalized.split('/');
    if (normalized.startsWith('/') || /^[A-Za-z]:/.test(normalized) || segments.some((segment) => segment === '..' || segment === '')) {
        return 'The path must stay inside the workspace and cannot contain parent-directory segments.';
    }
    return { root, uri: vscode.Uri.joinPath(root.uri, ...segments), relativePath: segments.join('/') };
}
async function runWorkspaceTool(name, input, readSnapshots, token) {
    if (token.isCancellationRequested) {
        return 'Cancelled.';
    }
    if (name === 'list_workspace_files') {
        const root = vscode.workspace.workspaceFolders?.[0];
        if (!root) {
            return 'No workspace folder is open.';
        }
        const files = await vscode.workspace.findFiles('**/*', '**/{node_modules,.git,dist,out,build}/**', 120, token);
        const query = typeof input.query === 'string' ? input.query.toLowerCase() : '';
        const relativeFiles = files
            .filter((file) => file.path.startsWith(`${root.uri.path}/`))
            .map((file) => file.path.slice(root.uri.path.length + 1))
            .filter((file) => !query || file.toLowerCase().includes(query));
        return relativeFiles.length ? relativeFiles.join('\n') : 'No matching workspace files found.';
    }
    const target = getWorkspaceTarget(input.path);
    if (typeof target === 'string') {
        return target;
    }
    if (name === 'read_workspace_file') {
        try {
            const document = await vscode.workspace.openTextDocument(target.uri);
            const content = document.getText();
            if (content.length > 24000) {
                return `File is ${content.length} characters; refusing to read more than 24,000 characters in one call. Read a more specific file instead.`;
            }
            readSnapshots.set(target.relativePath, content);
            return content;
        }
        catch {
            try {
                await vscode.workspace.fs.stat(target.uri);
                return `Could not read ${target.relativePath}. It exists but could not be opened as a text file.`;
            }
            catch {
                readSnapshots.set(target.relativePath, null);
                return `File ${target.relativePath} does not exist yet. You may create it with edit_workspace_file after checking the workspace structure.`;
            }
        }
    }
    if (name === 'edit_workspace_file') {
        if (typeof input.content !== 'string') {
            return 'The replacement content must be a string.';
        }
        if (input.content.length > 500000) {
            return 'Refusing to apply a file replacement larger than 500,000 characters.';
        }
        const originalContent = readSnapshots.get(target.relativePath);
        if (originalContent === undefined) {
            return 'Read or check this path with read_workspace_file before proposing an edit.';
        }
        try {
            if (originalContent === null) {
                try {
                    await vscode.workspace.fs.stat(target.uri);
                    return 'The file now exists. Read it again before proposing an edit.';
                }
                catch {
                    const approval = await vscode.window.showWarningMessage(`Prompt Guru wants to create ${target.relativePath}. Apply this model-generated change?`, { modal: true }, 'Create File');
                    if (approval !== 'Create File') {
                        return 'The user declined this file creation. Do not retry the same creation; continue without creating this file.';
                    }
                    const edit = new vscode.WorkspaceEdit();
                    edit.createFile(target.uri);
                    edit.insert(target.uri, new vscode.Position(0, 0), input.content);
                    const applied = await vscode.workspace.applyEdit(edit);
                    if (!applied) {
                        return `VS Code could not create ${target.relativePath}.`;
                    }
                    readSnapshots.set(target.relativePath, input.content);
                    return `Created the approved file ${target.relativePath}.`;
                }
            }
            const document = await vscode.workspace.openTextDocument(target.uri);
            if (document.getText() !== originalContent) {
                return 'The file changed since it was read. Read it again before proposing an edit.';
            }
            const approval = await vscode.window.showWarningMessage(`Prompt Guru wants to replace ${target.relativePath}. Apply this model-generated change?`, { modal: true }, 'Apply Edit');
            if (approval !== 'Apply Edit') {
                return 'The user declined this file edit. Do not try to make the same edit again; continue without modifying this file.';
            }
            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
            edit.replace(target.uri, fullRange, input.content);
            const applied = await vscode.workspace.applyEdit(edit);
            if (!applied) {
                return `VS Code could not apply the edit to ${target.relativePath}.`;
            }
            readSnapshots.set(target.relativePath, input.content);
            return `Applied the approved edit to ${target.relativePath}.`;
        }
        catch (error) {
            return `Could not apply the edit: ${error instanceof Error ? error.message : String(error)}`;
        }
    }
    return `Unknown workspace tool: ${name}`;
}
async function handlePromptGuruChat(request, context, response, token) {
    const prompt = request.prompt.trim();
    if (!prompt) {
        response.markdown('Enter a request after `@prompt-guru` and I will optimize it before sending it to the selected chat model.');
        return;
    }
    const taskType = detectTaskType(prompt);
    const selectedModel = request.model;
    const modelLabel = `${selectedModel.name} (${selectedModel.vendor}/${selectedModel.family})`;
    const optimizedPrompt = buildOptimizedPrompt(prompt, taskType, getTaskDefaults(taskType), {
        id: selectedModel.id,
        label: modelLabel,
        instruction: `Optimize this request specifically for the selected ${selectedModel.name} model. Preserve the user's intent, avoid adding unsupported capabilities, and make the task and expected result explicit.`
    });
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0];
    const canEditWorkspace = taskType === 'coding' && Boolean(workspaceRoot);
    const agentInstructions = canEditWorkspace
        ? `\n\nImplementation requirements: Treat this as an agent task and implement the requested change in the open workspace (${workspaceRoot?.name}). First inspect relevant files with list_workspace_files and read_workspace_file. Use edit_workspace_file for changes; each edit requires explicit user approval. Keep changes scoped. After editing, explain exactly what changed and state plainly if you could not run tests or validation. You have no shell, terminal, or automatic test execution tool. Never claim code was changed unless an edit tool reports success.`
        : '\n\nRespond directly to the user. This request is not classified as a workspace coding task, so do not attempt workspace edits.';
    const history = context.history.flatMap((turn) => {
        if (turn instanceof vscode.ChatRequestTurn) {
            return [vscode.LanguageModelChatMessage.User(turn.prompt)];
        }
        if (turn instanceof vscode.ChatResponseTurn) {
            const text = turn.response
                .filter((part) => part instanceof vscode.ChatResponseMarkdownPart)
                .map((part) => part.value.value)
                .join('\n');
            return text ? [vscode.LanguageModelChatMessage.Assistant(text)] : [];
        }
        return [];
    });
    response.markdown(`**Optimized prompt sent to ${modelLabel}:**\n\n${optimizedPrompt}\n\n---\n\n**Response:**\n\n`);
    try {
        const messages = [...history, vscode.LanguageModelChatMessage.User(`${optimizedPrompt}${agentInstructions}`)];
        const readSnapshots = new Map();
        const tools = canEditWorkspace ? workspaceTools : [];
        let toolCallCount = 0;
        for (let round = 0; round < 8; round += 1) {
            const modelResponse = await selectedModel.sendRequest(messages, { tools }, token);
            const assistantContent = [];
            const toolCalls = [];
            for await (const part of modelResponse.stream) {
                if (part instanceof vscode.LanguageModelTextPart) {
                    assistantContent.push(part);
                    response.markdown(part.value);
                }
                else if (part instanceof vscode.LanguageModelToolCallPart) {
                    assistantContent.push(part);
                    toolCalls.push(part);
                }
                else if (part instanceof vscode.LanguageModelDataPart) {
                    assistantContent.push(part);
                }
            }
            if (!toolCalls.length) {
                return;
            }
            messages.push(new vscode.LanguageModelChatMessage(vscode.LanguageModelChatMessageRole.Assistant, assistantContent));
            const toolResults = [];
            for (const toolCall of toolCalls) {
                toolCallCount += 1;
                if (toolCallCount > 16) {
                    response.markdown('\n\nStopped after reaching the workspace tool-call limit.');
                    return;
                }
                const toolInput = toolCall.input;
                response.progress(`${toolCall.name}: ${String(toolInput.path ?? toolInput.query ?? 'workspace')}`);
                const result = await runWorkspaceTool(toolCall.name, toolInput, readSnapshots, token);
                toolResults.push(new vscode.LanguageModelToolResultPart(toolCall.callId, [new vscode.LanguageModelTextPart(result)]));
            }
            messages.push(new vscode.LanguageModelChatMessage(vscode.LanguageModelChatMessageRole.User, toolResults));
        }
        response.markdown('\n\nStopped after reaching the model tool-round limit.');
    }
    catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        response.markdown(`\n\nPrompt Guru prepared the prompt, but the selected model could not complete the request: ${detail}`);
    }
}
function activate(context) {
    extensionContext = context;
    const openPanelCommand = vscode.commands.registerCommand('promptGuru.openPanel', () => openPromptGuruPanel());
    const optimizeSelectionCommand = vscode.commands.registerCommand('promptGuru.optimizeSelection', optimizeSelection);
    const optimizeInputCommand = vscode.commands.registerCommand('promptGuru.optimizeInput', optimizePromptFromInput);
    const optimizeForModelCommand = vscode.commands.registerCommand('promptGuru.optimizeForModel', optimizeForExactModel);
    const chatParticipant = vscode.chat.createChatParticipant('prompt-guru.chat', handlePromptGuruChat);
    context.subscriptions.push(openPanelCommand, optimizeSelectionCommand, optimizeInputCommand, optimizeForModelCommand, chatParticipant);
}
function deactivate() {
    extensionContext = undefined;
}
//# sourceMappingURL=extension.js.map