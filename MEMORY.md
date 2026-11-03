# MEMORY - Persistent Context for All Agents

## Workspace Rules
Read C:\Users\admin\Desktop\Projects\AGENTS.md for global workspace rules.

## Lessons Learned
- Write tool appends trailing quote in some cases - always verify file content after write
- PowerShell: use Select-String instead of grep, use node/python for file edits
- CRLF/LF issues: normalize to LF before hashing
- euro sign is multi-byte (0xE2 0x82 0xAC) - string matching fails, use regex
