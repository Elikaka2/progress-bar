# Progress Bar

An Obsidian plugin that displays a progress bar based on completed Markdown checkboxes.

## Features

- Calculate progress from Markdown task checkboxes.
- Display progress in Reading View.
- Display progress in Live Preview.
- Automatically update progress when the document changes.
- Insert a progress bar using the editor context menu.
- Insert a progress bar using the Command Palette.
- Support standard Markdown task syntax.

## Usage

Add Markdown tasks:

- [x] Completed task
- [x] Another completed task
- [ ] Unfinished task
- [ ] Another unfinished task

Then add:

[progressBar]

The plugin displays the current progress.

Example:

[=============50%.............]

## Installation

### Community Plugins

Install Progress Bar from the Obsidian Community Plugins directory.

### Manual Installation

Download the latest release from GitHub and copy:

- main.js
- manifest.json
- styles.css

into:

.obsidian/plugins/progress-bar/

Then enable the plugin in Obsidian.

## Development

Install dependencies:

npm install

Run the development build:

npm run dev

Create a production build:

npm run build

## Project Structure

progress-bar/
├── src/
│   ├── main.ts
│   ├── ProgressCalculator.ts
│   ├── ProgressBarRenderer.ts
│   ├── ProgressBarCommands.ts
│   └── ProgressBarEditorExtension.ts
├── styles.css
├── manifest.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── esbuild.config.mjs
├── README.md
├── LICENSE
└── .gitignore

## License

MIT License.

## Disclaimer

This plugin is an independent community project and is not affiliated with or endorsed by Obsidian.