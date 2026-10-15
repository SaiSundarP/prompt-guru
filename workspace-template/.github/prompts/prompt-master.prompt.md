---
mode: 'agent'
description: 'Optimize any weak prompt for the best model and reduce wasted tokens.'
---

Optimize this prompt for the selected model or the best-fit tool.

Goal:
- detect the target model/tool
- reduce ambiguity and repetition
- preserve intent while improving clarity
- minimize token waste and credit usage
- keep the final prompt compact and copyable

Then produce:
1. final optimized prompt block
2. target model or tool name
3. one-line strategy note

Rules:
- if the task is code-related, include scope, constraints, and Done When criteria
- if the task is image-related, include subject, style, lighting, mood, and negative prompts
- if the task is vague, ask at most three clarifying questions before finalizing
- do not reveal hidden reasoning or chain-of-thought
