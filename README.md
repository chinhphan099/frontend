## Frontend template
  - Default HTML5/CSS3/JavaScript template
  - Technologies used:
    * [Jade](http://jade-lang.com)
    * [Less](http://lesscss.org)
    * [jQuery](http://jquery.com)
    * [Node.js](http://nodejs.org)

## IDE Configuration
- Open Sublime Text
- Choose Preferences -> Settings - User
- The number of spaces a tab is considered equal to "tab_size": 2
- Set to true to insert spaces when tab is pressed "translate_tabs_to_spaces": true
- Set to true to removing trailing white space on save "trim_trailing_white_space_on_save": true
- Set to true to ensure the last line of the file ends in a newline character when saving "ensure_newline_at_eof_on_save": true
- Preferences.sublime-settings example:
  ```
  {
    "tab_size": 2,
    "translate_tabs_to_spaces": true,
    "trim_trailing_white_space_on_save": true,
    "ensure_newline_at_eof_on_save": true,
    "word_wrap": true,
    "highlight_line": true,
    "folder_exclude_patterns":
    [
      ".svn",
      ".git",
      ".hg",
      "CVS",
      "node_modules/"
    ],
    "font_size": 11,
    "ignored_packages":
    [
      "Markdown",
      "Vintage"
    ]
  }
  ```

## Installation
### Install Node.js
  - Download [Node.js](http://nodejs.org)
  - Ensure you have administrator role when install to set the PATH environment variable

### Install Grunt
  - Open Command Line and run
    * npm install grunt-cli -g
    * npm install
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
