# Skill: Code Review

Review staged changes or a specified file/PR for correctness, security, and style issues.

## Usage

```
/code-review [path or diff]
```

## Checklist

- [ ] No plaintext passwords or secrets
- [ ] IPC handlers validate input types and lengths
- [ ] DB errors are not leaked to the renderer
- [ ] No `sandbox: false` without justification
- [ ] Null-checks on `window.electronAPI` calls
- [ ] No unused imports or dead code

## Output Format

Report findings as a markdown table:

| Severity | File:Line | Issue | Suggested Fix |
|---|---|---|---|
| HIGH | ... | ... | ... |
