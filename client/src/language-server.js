const vscode = require('vscode');
const completionProvider = require('./completion-provider');
const hoverProvider = require('./hover-provider');
const TesseractDiagnosticProvider = require('./diagnostic-provider');

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

    // Create and register the diagnostic provider
    const diagnosticProvider = new TesseractDiagnosticProvider();
    context.subscriptions.push(diagnosticProvider);
    
    // Update diagnostics for the active editor when activated
    if (vscode.window.activeTextEditor) {
        diagnosticProvider.updateDiagnostics(vscode.window.activeTextEditor.document);
    }
    
    // Update diagnostics when the active editor changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                diagnosticProvider.updateDiagnostics(editor.document);
            }
        })
    );
    
    // Update diagnostics when the document changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            diagnosticProvider.updateDiagnostics(event.document);
        })
    );
    
    // Update diagnostics when a document is opened
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(document => {
            diagnosticProvider.updateDiagnostics(document);
        })
    );
    
    // Clear diagnostics when a document is closed/deleted
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(document => {
            diagnosticProvider.diagnosticCollection.delete(document.uri);
        })
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