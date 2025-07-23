# Installing the Tesseract Syntax Highlighting Extension

## Manual Installation

1. Copy the `tesseract-syntax` folder to your VS Code extensions directory:
   - Windows: `%USERPROFILE%\.vscode\extensions`
   - macOS: `~/.vscode/extensions`
   - Linux: `~/.vscode/extensions`

2. Restart Visual Studio Code

3. The extension should now be active. Files with the `.tesseract` extension will automatically use the syntax highlighting and diagnostic features.

4. To use the Tesseract color theme:
   - Open VS Code settings (Ctrl+,)
   - Search for "color theme"
   - Select "Tesseract Dark" from the dropdown

## Creating a VSIX Package (For Sharing)

If you want to create a shareable extension package:

1. Install Node.js and npm if you haven't already

2. Install the VS Code Extension Manager (vsce):
   ```
   npm install -g vsce
   ```

3. Navigate to the extension directory and run:
   ```
   vsce package
   ```

4. This will create a `.vsix` file that can be installed in VS Code by:
   - Opening VS Code
   - Going to Extensions view
   - Clicking the "..." menu
   - Selecting "Install from VSIX..."
   - Choosing the generated file