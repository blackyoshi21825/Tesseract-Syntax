const vscode = require('vscode');
const completionProvider = require('./completion-provider');
const hoverProvider = require('./hover-provider');

/**
 * Activates the language server for Tesseract
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Register the completion provider
    const completionDisposable = vscode.languages.registerCompletionItemProvider(
        'tesseract',
        completionProvider,
        '.', // Trigger completion when typing a dot
        ':', // Trigger completion when typing a colon
        'k', // Trigger for keywords like 'keys'
        'v'  // Trigger for keywords like 'values'
    );

    // Register the hover provider
    const hoverDisposable = vscode.languages.registerHoverProvider(
        'tesseract',
        hoverProvider
    );

    // Add disposables to context
    context.subscriptions.push(completionDisposable, hoverDisposable);
}

/**
 * Deactivates the extension
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};