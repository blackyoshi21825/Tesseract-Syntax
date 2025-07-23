# Tesseract Language Syntax Highlighting

This extension provides syntax highlighting and diagnostic features for the Tesseract programming language.

## Features

### Syntax Highlighting

Syntax highlighting for:
- Keywords (let$, func$, class$, if$, etc.) - blue
- Variables - light blue
- Function parameters - italic light blue
- Strings - orange/brown
- String escape sequences - gold
- Format specifiers (@s, @d, @f) - bold blue
- Comments - green
- Operators - white
- Numbers - light green
- Built-in functions (::print, ::len, etc.) - teal
- Dictionary type (dict) - teal
- Advanced data types (<stack>, <queue>, <linkedlist>) - purple
- Self keyword - italic blue
- Brackets and punctuation - white
- Function names - yellow
- Object properties - bright blue
- Import paths - italic orange
- Boolean constants (true/false) - bold blue
- Dictionary structures - special highlighting

Custom file icons:
- Tesseract files (.tesseract) - blue cube
- C files (.c) - green "C" in circle
- Header files (.h) - blue "H" in circle
- SVG files (.svg) - orange "SVG" in rectangle
- Markdown files (.md) - yellow "MD" in rectangle
- JSON files (.json) - teal "JSON" in rounded rectangle
- Makefiles (makefile, Makefile) - green "MK" in rectangle

Custom folder icons:
- Default folders - gray folder
- .vscode folders - blue VS folder
- lib folders - yellow LIB folder
- src folders - green SRC folder
- include folders - light blue INC folder
- tesseract-syntax/tesseract_syntax folders - blue SYN folder

## Installation

### Local Installation
1. Copy this folder to your VS Code extensions folder:
   - Windows: `%USERPROFILE%\.vscode\extensions`
   - macOS/Linux: `~/.vscode/extensions`
2. Restart VS Code
3. Files with `.tesseract` extension will automatically use this syntax highlighting

### Enabling File Icons
1. After installing the extension, go to File → Preferences → File Icon Theme
2. Select "Tesseract Icons" from the list
3. All supported files and folders will now display with their custom icons

### Building VSIX Package
To create a shareable extension:
1. Install Node.js and npm
2. Install vsce: `npm install -g vsce`
3. Run `vsce package` in this directory
4. Install the generated .vsix file in VS Code

### Diagnostic Features

The extension provides real-time error detection for:

- **Syntax Errors**
  - Missing $ in keywords (if$, else$, func$, etc.)
  - Unclosed brackets, braces, and parentheses
  - Unclosed string literals
  - Missing semicolons at the end of statements

- **Semantic Warnings**
  - Undefined variables
  - Built-in functions used without :: prefix

- **Data Structure Validation**
  - Malformed advanced data types (<stack>, <queue>, <linked>)
  - Invalid data type names
  - Malformed dictionary declarations

- **Code Structure Validation**
  - Incomplete control structures (if$, else$, loop$, etc. without body)
  - Incomplete function definitions
  - Incomplete class definitions

### IntelliSense Features

- **Code Completion**
  - Keywords and language constructs
  - Built-in functions
  - Data types

- **Hover Information**
  - Documentation for keywords
  - Documentation for built-in functions
  - Documentation for data types

## Color Theme

This extension defines syntax scopes. The actual colors depend on your VS Code theme.
For the best experience, you may want to customize your theme to match the Tesseract language conventions.