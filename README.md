## Frontend template
  - Default HTML5/CSS3/JavaScript template
  - Technologies used:
    * [Pug](https://pugjs.org/)
    * [Less](http://lesscss.org)
    * [Node.js](http://nodejs.org)

## IDE Configuration
- Visual Studio Code
- .editorconfig settup:
  ```
  root = true
  [*]
  indent_style = space
  indent_size = 2
  charset = utf-8
  trim_trailing_whitespace = true
  insert_final_newline = true
  tab_width = 2
  ```
- Setup Theme
  ```
  {
    "explorer.confirmDelete": false,
    "workbench.colorTheme": "Monokai",
    "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
    "editor.renderWhitespace": "all",
    "files.trimFinalNewlines": true,
    "files.trimTrailingWhitespace": true,
    "html.format.endWithNewline": true,
    "files.insertFinalNewline": true,
    "editor.fontSize": 17,
    "editor.mouseWheelZoom": true,
    "editor.wordWrap": "on",
    "editor.formatOnPaste": false,
    "editor.multiCursorModifier": "ctrlCmd",
    "editor.snippetSuggestions": "top",
    "workbench.iconTheme": "vscode-icons",
    "vsicons.dontShowNewVersionMessage": true,
    "editor.tabSize": 2,
    "workbench.startupEditor": "newUntitledFile",
    "workbench.editor.highlightModifiedTabs": true,
    "files.defaultLanguage": "less",
    "workbench.colorCustomizations": {
      "tab.hoverBackground": "#000",
      "tab.activeBackground": "#000",
      "tab.activeModifiedBorder": "#f00",
      "tab.inactiveModifiedBorder": "#f00",
      "tab.activeBorderTop": "#00c8fd",
      "tab.inactiveBackground": "#313131"
    }
  }
  ```

## Installation
### Install Node.js
  - Download [Node.js](http://nodejs.org)
  - Ensure you have administrator role when install to set the PATH environment variable

### Install Grunt
  - Open Command Line and run
    * npm install gulp-cli -g
    * npm install -g gulp
    * npm install

### RUN
  - gulp

## Notes
  - Use **rimraf** to delete **node_modules** folder. See [rimraf](https://github.com/isaacs/rimraf)

## VS Code plugins
  - [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)
  - [Babel JavaScript](https://marketplace.visualstudio.com/items?itemName=mgmcdermott.vscode-language-babel)
  - [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)
  - [css snippet](https://marketplace.visualstudio.com/items?itemName=PriyankPatel.csssnippet)
  - [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
  - [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
  - [HTML Snippets](https://marketplace.visualstudio.com/items?itemName=abusaidm.html-snippets)
  - [JS-CSS-HTML Formatter](https://marketplace.visualstudio.com/items?itemName=lonefy.vscode-JS-CSS-HTML-formatter)
  - [Monokai Theme](https://marketplace.visualstudio.com/items?itemName=gerane.Theme-Monokai)
  - [open in browser](https://marketplace.visualstudio.com/items?itemName=techer.open-in-browser)
  - [Pug](https://marketplace.visualstudio.com/items?itemName=amandeepmittal.pug&ssr=false#overview)
  - [Reactjs code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets)
  - [Reload](https://marketplace.visualstudio.com/items?itemName=natqe.reload)
  - [Sublime Text Keymap and Settings Importer](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sublime-keybindings)
  - [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight)
  - [Velocity](https://marketplace.visualstudio.com/items?itemName=sodatea.velocity)
  - [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)
