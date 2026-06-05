---
'@accelint/design-toolkit': patch
---

Fix four `Sidenav` visual bugs:

- `Sidenav` headings (`SidenavMenu` titles, the closed-state popover title, `SidenavAvatar` headings, and `SidenavContent` section headings) no longer render forced uppercase — heading content now renders verbatim.
- The `SidenavLink` external-link arrow (and the `SidenavHeader` collapse chevron) now hide reliably when the sidenav is collapsed. The `__transient` collapsed-state hide previously tied on specificity with `Icon`'s own `display`, leaking icons into the collapsed rail; it is now forced so it applies uniformly to text and icon children.
- The expanded `SidenavMenu` trigger title now uses `body-s` (12px), matching its own collapsed-state popover title and sibling nav items, instead of the smaller `body-xs` (10px) section-label size it previously inherited.
- The collapsed rail now honors `--sidenav-width` in push layouts (`DrawerLayout push`), matching overlay mode. Previously `--sidenav-width` only affected overlay mode (via the collapse transform) and push-mode rails were content-driven, so the collapsed width was inconsistent between the two layouts and not themeable in push mode.
