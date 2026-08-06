---
'@accelint/design-toolkit': minor
---

Table now reflects `data` prop changes without a remount (e.g. polling or
refetching). Previously the data array was copied into internal state on first
render, so updates were ignored unless consumers forced a remount with a `key`.
Manual row reordering (Move Up / Move Down) is preserved across data updates;
rows added after a manual reorder append at the end. The `key` remount pattern
still works but is no longer necessary.
