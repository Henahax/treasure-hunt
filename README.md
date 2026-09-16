# Treasure Hunt

## Planning

### Technologies

- Svelte
- SvelteKit
- PostgreSQL

### Features

- available treasure hunts
- load/unlock hunt via code
- QR Code Reader
- share treasure hunts

### Dialogs

- Start menu
- Treasure Hunt Browser
- Treasure Hunt
  - Intro
  - Steps (one or more)
  - Finished

```mermaid
flowchart TD
    start[Start menu]
    browser[Treasure hunt browser]

    intro([Intro])
    first[First step]
    more[More steps ...]
    last[Last step]
    finish([Finished])

    start --> browser
    start -->|enter code| intro
    browser -->|select hunt| intro
    intro -->|start| first
    first --> more
    more --> last
    last --> finish
    browser -.->|back| start
    intro -.->|back| browser
    finish -.->|back| browser
```

### modals

- QR code scanner
- Step menu

## ideas

- generate a hunt from a JSON file
- store Markdown step text in separate files or inside the JSON file
