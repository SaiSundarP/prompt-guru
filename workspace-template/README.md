# Use Prompt Master in any workspace

This folder is a copy-ready template for enabling the prompt optimizer in any VS Code workspace when you want it.

## Copy steps

1. Copy both files from this folder into the target workspace root:
   - copilot-instructions.md
   - .github/copilot-instructions.md
   - .github/prompts/prompt-master.prompt.md
2. Open the workspace in VS Code.
3. Open Copilot Chat and use prompts normally.
4. If the workspace is a repo that already has its own instruction files, keep this one as a reusable override template.

## Trigger behavior

When a user provides a weak, vague, or ambiguous prompt, the assistant should:

- detect the target model or tool
- reduce noise and token waste
- rewrite the prompt into a tighter version
- route to the correct model when Auto mode is enabled
- keep the final output compact and copyable

## Quick invocation

Use this prompt in Copilot Chat whenever needed:

```
Optimize this prompt for the selected model or best-fit tool.
Goal: improve clarity, reduce token waste, and preserve intent.
If the request is vague, rewrite it into a compact, high-signal prompt.
Then provide:
1. final optimized prompt
2. target model or tool
3. one-line strategy note
```
