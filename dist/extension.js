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
const MODEL_OPTIONS = [
    {
        label: 'GPT-4o',
        family: 'general',
        instruction: 'Write a crisp, high-signal prompt optimized for GPT-4o with clear scope, constraints, and direct answer structure.'
    },
    {
        label: 'Claude 3.5 Sonnet',
        family: 'general',
        instruction: 'Write a structured prompt for Claude 3.5 Sonnet with precise task instructions, output format, and guardrails.'
    },
    {
        label: 'Gemini 2.5 Pro',
        family: 'general',
        instruction: 'Write a grounded, concise prompt for Gemini 2.5 Pro with explicit context, constraints, and expected output.'
    },
    {
        label: 'GitHub Copilot / coding agent',
        family: 'coding',
        instruction: 'Write a code-focused prompt with narrow scope, file boundaries, exact requirements, and a strict Done When clause.'
    },
    {
        label: 'Midjourney',
        family: 'image',
        instruction: 'Write a visual prompt with subject, mood, lighting, camera angle, composition, negative prompts, and aspect ratio.'
    },
    {
        label: 'Stable Diffusion',
        family: 'image',
        instruction: 'Write a stable diffusion prompt with subject, style, composition, negative prompt, quality tags, and render setup.'
    },
    {
        label: 'DALL-E / image model',
        family: 'image',
        instruction: 'Write a clean image-generation prompt that is detailed, visually specific, and optimized for image quality.'
    }
];
function cleanPrompt(raw) {
    return raw
        .replace(/\bplease\b/gi, '')
        .replace(/\bcan you\b/gi, '')
        .replace(/\bkindly\b/gi, '')
        .replace(/\bI want\b/gi, 'I want')
        .replace(/\s+/g, ' ')
        .trim();
}
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
function chooseDefaultModel(taskType) {
    switch (taskType) {
        case 'coding':
            return 'GitHub Copilot / coding agent';
        case 'image':
            return 'Midjourney';
        case 'writing':
            return 'Claude 3.5 Sonnet';
        default:
            return 'GPT-4o';
    }
}
function buildModelSpecificPrompt(raw, exactModel) {
    const cleaned = cleanPrompt(raw);
    const taskType = detectTaskType(cleaned);
    const defaultModel = chooseDefaultModel(taskType);
    const base = cleaned
        .replace(/^\s*[-*]\s*/gm, '')
        .replace(/\s*:\s*/g, ': ')
        .replace(/\s+/g, ' ')
        .trim();
    let optimized = base;
    if (taskType === 'coding') {
        optimized = `Objective: ${base}\n\nConstraints: keep scope narrow, preserve the current contract, name the exact file or module involved, define success criteria, and avoid unrelated work.\n\nDone When: the task is precise enough to implement without guessing.`;
    }
    else if (taskType === 'image') {
        optimized = `Subject: ${base}\n\nVisual requirements: cinematic composition, precise subject, strong lighting, clear mood, consistent style, explicit camera framing, and a strong final aesthetic.\n\nNegative prompts: blurry, low detail, distorted anatomy, text, watermark, duplicate objects, cluttered composition.`;
    }
    else if (taskType === 'writing') {
        optimized = `Task: ${base}\n\nRequirements: define the audience, tone, structure, format, and success criteria. Make the answer concise, clear, and fully actionable.`;
    }
    else {
        optimized = `Task: ${base}\n\nRequirements: be explicit about context, constraints, desired output, and success criteria. Keep the answer compact and directly actionable.`;
    }
    const profile = MODEL_OPTIONS.find((option) => option.label === exactModel) ?? MODEL_OPTIONS[0];
    return `Exact model selected: ${exactModel}\nRecommended default model for this task: ${defaultModel}\n\nModel-specific instruction: ${profile.instruction}\n\nOptimized prompt:\n${optimized}\n\nStrategy: removed filler, clarified the task, tightened constraints, and improved signal-to-noise ratio so the model can execute correctly on the first pass.`;
}
async function promptForExactModel() {
    const models = MODEL_OPTIONS.map((option) => option.label);
    const selected = await vscode.window.showQuickPick(models, {
        placeHolder: 'Select the exact AI model for this prompt',
        ignoreFocusOut: true,
    });
    if (!selected) {
        return;
    }
    const input = await vscode.window.showInputBox({
        prompt: `Enter the rough prompt to optimize for ${selected}`,
        placeHolder: 'Example: create a product launch landing page for a productivity app',
        ignoreFocusOut: true,
    });
    if (!input || !input.trim()) {
        return;
    }
    const output = buildModelSpecificPrompt(input, selected);
    const doc = await vscode.workspace.openTextDocument({ content: output, language: 'markdown' });
    await vscode.window.showTextDocument(doc, { preview: false });
}
async function optimizePromptFromInput() {
    const input = await vscode.window.showInputBox({
        prompt: 'Paste a rough prompt to optimize',
        placeHolder: 'Example: make a cool landing page for my SaaS app',
        ignoreFocusOut: true,
    });
    if (!input || !input.trim()) {
        return;
    }
    const taskType = detectTaskType(input);
    const defaultModel = chooseDefaultModel(taskType);
    const output = buildModelSpecificPrompt(input, defaultModel);
    const doc = await vscode.workspace.openTextDocument({ content: output, language: 'markdown' });
    await vscode.window.showTextDocument(doc, { preview: false });
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
    const taskType = detectTaskType(raw);
    const defaultModel = chooseDefaultModel(taskType);
    const output = buildModelSpecificPrompt(raw, defaultModel);
    const doc = await vscode.workspace.openTextDocument({ content: output, language: 'markdown' });
    await vscode.window.showTextDocument(doc, { preview: false });
}
function activate(context) {
    const optimizeSelectionCommand = vscode.commands.registerCommand('promptGuru.optimizeSelection', optimizeSelection);
    const optimizeInputCommand = vscode.commands.registerCommand('promptGuru.optimizeInput', optimizePromptFromInput);
    const optimizeForModelCommand = vscode.commands.registerCommand('promptGuru.optimizeForModel', promptForExactModel);
    context.subscriptions.push(optimizeSelectionCommand, optimizeInputCommand, optimizeForModelCommand);
}
function deactivate() {
    // no-op
}
//# sourceMappingURL=extension.js.map