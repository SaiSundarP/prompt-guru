---
mode: 'agent'
description: 'Automatically refine weak prompts, reduce token waste, and route them to the best model or tool.'
---

Create a clean, optimized prompt for the target AI tool or model.

Goal:
- identify the model or tool the user is targeting
- detect whether the request is vague, weak, or inefficient
- convert rough input into a compact, high-signal prompt
- reduce wasted tokens, credits, retries, and bad output
- route the final prompt to the best-fit model when Auto mode is active

Use the prompt-master workflow automatically in normal chat whenever the user enters a weak or under-specified prompt.

Ask up to three clarifying questions only if a critical detail is missing.

Then produce:
1. the final optimized prompt block
2. a short strategy note
3. a brief routing note only if model selection is relevant

Use the project’s prompt-engineering rules:
- be specific about scope and constraints
- define success criteria clearly
- avoid hidden reasoning requests
- include exact file paths, functions, or constraints for coding tasks
- include negative prompts and concrete visual descriptors for image prompts
- maintain one task per prompt unless the user explicitly asks otherwise
- prefer the shortest prompt that still preserves intent and quality
