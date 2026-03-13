# Remyx Editor Roadmap

**Current Version:** 0.22.16-beta
**Status:** Feature-complete for core editing, not yet thoroughly tested

A living document outlining planned features, improvements, and long-term direction for the Remyx rich-text editor.

---

## Autosave

- Periodic autosave to `localStorage` / `sessionStorage` with configurable interval
- Crash-recovery banner: "Unsaved content was recovered — restore it?"
- Optional server-side autosave via a user-supplied `onAutoSave(html)` callback
- Debounced save on every content change with deduplication
- Visual save-status indicator (Saved / Saving... / Unsaved)

## Enhanced Tables & Spreadsheet Features

- Inline cell formulas (`=SUM(A1:A5)`, `=AVERAGE(B2:B8)`) with a lightweight expression engine
- Column and row resize handles with drag support
- Cell merging and splitting
- Sortable columns (click header to sort ascending/descending)
- Filterable rows with a compact filter UI per column
- Cell formatting: number, currency, percentage, date
- Copy/paste between Remyx tables and external spreadsheets (Excel, Google Sheets)
- Freeze header row on scroll for large tables

## Expanded Plugin Architecture

- Formal `createPlugin()` lifecycle hooks: `onInit`, `onDestroy`, `onContentChange`, `onSelectionChange`
- Plugin dependency resolution and load ordering
- Scoped plugin settings with a per-plugin configuration schema
- Plugin marketplace/registry concept — discover and install community plugins
- First-party plugin packs: code editing, diagramming, math (LaTeX/KaTeX), footnotes
- Plugin sandboxing to prevent one plugin from breaking the editor or other plugins

## AI Integration

- `aiProvider` prop accepting an adapter interface for any LLM backend (OpenAI, Anthropic, local models)
- Inline AI actions: rewrite selection, summarize, expand, translate, adjust tone
- AI-powered autocomplete with ghost-text suggestions (Tab to accept)
- Context-aware AI — sends surrounding content for better suggestions
- Slash-command menu (`/ai summarize`, `/ai translate to Spanish`, etc.)
- Privacy-first: no data sent anywhere unless the consumer explicitly configures a provider

## Spelling & Grammar Checking

- Built-in spellcheck layer using the browser's native `Intl` / spellcheck API
- Optional integration with LanguageTool, Grammarly SDK, or a custom grammar service
- Inline red/blue underlines with right-click correction suggestions
- "Ignore" and "Add to dictionary" per-session or persistent
- Language detection and multi-language support
- Grammar rule categories: punctuation, passive voice, wordiness, clichés
- Writing-style presets (formal, casual, technical, academic)

## Template System & Merge Tags

- `{{merge_tag}}` syntax with visual tag chips rendered inline
- Template designer mode: drag-and-drop merge tags from a sidebar palette
- Conditional blocks: `{{#if has_coupon}}...{{/if}}`
- Repeatable sections: `{{#each items}}...{{/each}}`
- Live preview with sample data injection
- Export templates as reusable JSON objects
- Pre-built template library: email, invoice, letter, report, newsletter

## Image & Video Optimization

- Client-side image compression before upload (configurable quality/max dimensions)
- Automatic WebP/AVIF conversion for supported browsers
- Lazy-loading for images below the fold (`loading="lazy"`)
- Responsive `srcset` generation from a single upload
- Video thumbnail extraction and poster frame selection
- Embedded video player with playback controls (not just raw `<video>`)
- Image editing toolbar: crop, rotate, brightness, contrast, filters
- Drag-to-resize with aspect ratio lock

## Service Integrations

- **Cloud storage**: Google Drive, Dropbox, OneDrive — browse and insert files/images directly
- **Media**: Unsplash, Pexels, Giphy — search and insert royalty-free images/GIFs
- **Embeds**: YouTube, Vimeo, Twitter/X, CodePen, Figma — rich embed previews
- **Collaboration**: Slack, Microsoft Teams — share editor content or receive webhook notifications
- **CMS**: WordPress, Contentful, Strapi, Sanity — bidirectional content sync
- **Email**: Mailchimp, SendGrid — export editor HTML as email-ready templates
- Integration SDK with a standardized adapter pattern for adding custom services

## Real-Time Collaborative Editing

- CRDT-based conflict-free real-time co-editing (Yjs or Automerge)
- Awareness protocol: live cursors with user names and colors
- Presence indicators showing who is currently viewing/editing
- Offline-first: queue changes locally, sync when reconnected
- Operation history with per-user attribution
- Configurable transport: WebSocket, WebRTC, or custom
- `collaborationProvider` prop — bring your own signaling server or use a hosted option

## Multiple Editor Instances

- Full instance isolation: each editor gets its own engine, history, and event bus
- No DOM ID collisions — all selectors scoped to the editor root
- Shared configuration via a `<RemyxProvider>` context wrapper
- Inter-editor communication bus for linked editors (e.g., source + preview)
- Memory-efficient shared singleton for icons, sanitizer schema, and toolbar config
- Stress-tested with 10+ concurrent editors on a single page

## External Configuration

- Load toolbar layout, theme, fonts, and plugin list from a JSON/YAML config file
- `RemyxEditor.fromConfig(url)` static method for fully declarative setup
- Environment-based config merging (development vs. production defaults)
- Admin panel concept: a standalone UI for building editor configurations visually
- Runtime config reloading without unmounting the editor

## Framework Support

| Framework | Status | Package |
| --- | --- | --- |
| **React** | Available | `remyx-editor` |
| **Vue 3** | Planned | `remyx-editor-vue` |
| **Angular** | Planned | `remyx-editor-angular` |
| **Svelte** | Planned | `remyx-editor-svelte` |
| **Vanilla JS** | Planned | `remyx-editor-core` |
| **Node.js (SSR)** | Planned | Server-side HTML sanitization & rendering |
| **Django** | Planned | `django-remyx` form widget + template tag |
| **Rails** | Planned | `remyx-rails` Action Text integration |

- Shared core engine across all framework wrappers
- Framework-specific bindings for reactivity, lifecycle, and two-way data binding
- Web Component wrapper (`<remyx-editor>`) for framework-agnostic embedding

## Quality Improvements

- Comprehensive unit test suite (Vitest) for engine, commands, sanitizer, and converters
- End-to-end tests (Playwright) covering toolbar interactions, paste, drag-and-drop, and modals
- Visual regression tests for theme and layout stability
- Accessibility audit: full WCAG 2.1 AA compliance, screen reader testing, keyboard navigation
- RTL (right-to-left) language support with `dir="rtl"` auto-detection
- Internationalization (i18n): externalized strings, locale packs, pluralization
- Improved undo/redo with operation coalescing (batch rapid keystrokes into a single undo step)
- Better large-document performance: virtualized rendering for 10k+ paragraph documents
- Print stylesheet for clean printed output

## Performance Optimizations

- Tree-shakeable ESM build — import only what you use
- Code-split heavy features (PDF import, markdown, syntax highlighting) behind dynamic `import()`
- Reduce initial bundle size to < 50 KB gzipped for the core editor
- Memoized toolbar rendering — skip re-renders when selection state hasn't changed
- Batch DOM mutations with `requestAnimationFrame` for smoother typing
- Web Worker offloading for expensive operations (sanitization, markdown parsing, document conversion)
- Profiled and optimized hot paths: keystroke handling, selection polling, content serialization
- Lighthouse performance score target: 95+

---

*This roadmap is subject to change. Contributions, feedback, and feature requests are welcome.*
