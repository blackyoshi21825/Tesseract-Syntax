const vscode = require('vscode');

/**
 * Provides diagnostic information for Tesseract code
 */
class TesseractDiagnosticProvider {
    /**
     * Create a new diagnostic collection
     */
    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('tesseract');
    }

    /**
     * Dispose of the diagnostic collection
     */
    dispose() {
        this.diagnosticCollection.dispose();
    }

    /**
     * Update diagnostics for the given document
     * @param {vscode.TextDocument} document 
     */
    updateDiagnostics(document) {
        if (document.languageId !== 'tesseract') {
            return;
        }

        const text = document.getText();
        const diagnostics = [];

        // Check for unclosed brackets
        this.checkUnclosedBrackets(text, document, diagnostics);
        
        // Check for missing $ in keywords
        this.checkKeywordSyntax(text, document, diagnostics);
        
        // Check for unclosed strings
        this.checkUnclosedStrings(text, document, diagnostics);
        
        // Check for invalid function calls
        this.checkFunctionCalls(text, document, diagnostics);

        // Update the diagnostic collection
        this.diagnosticCollection.set(document.uri, diagnostics);
    }

    /**
     * Check for unclosed brackets in the code
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     */
    checkUnclosedBrackets(text, document, diagnostics) {
        const brackets = {
            '{': '}',
            '[': ']',
            '(': ')'
        };
        
        const stack = [];
        const positions = [];
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (brackets[char]) {
                stack.push(char);
                positions.push(i);
            } else if (Object.values(brackets).includes(char)) {
                const expected = brackets[stack.pop()];
                positions.pop();
                
                if (expected !== char) {
                    const pos = document.positionAt(i);
                    const range = new vscode.Range(pos, pos.translate(0, 1));
                    
                    diagnostics.push(new vscode.Diagnostic(
                        range,
                        `Mismatched bracket: found '${char}' but expected '${expected}'`,
                        vscode.DiagnosticSeverity.Error
                    ));
                }
            }
        }
        
        // Check for unclosed brackets
        while (stack.length > 0) {
            const bracket = stack.pop();
            const position = positions.pop();
            const pos = document.positionAt(position);
            const range = new vscode.Range(pos, pos.translate(0, 1));
            
            diagnostics.push(new vscode.Diagnostic(
                range,
                `Unclosed '${bracket}': missing '${brackets[bracket]}'`,
                vscode.DiagnosticSeverity.Error
            ));
        }
    }

    /**
     * Check for missing $ in keywords
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     */
    checkKeywordSyntax(text, document, diagnostics) {
        const keywordsRequiringDollar = ['if', 'else', 'elseif', 'loop', 'while', 'import', 'let', 'func', 'class'];
        
        // Regular expression to find keywords without $ suffix
        // Looks for keywords followed by space, but not by $
        const regex = new RegExp(`\\b(${keywordsRequiringDollar.join('|')})\\b(?!\\$)\\s`, 'g');
        
        let match;
        while ((match = regex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[1].length);
            const range = new vscode.Range(startPos, endPos);
            
            diagnostics.push(new vscode.Diagnostic(
                range,
                `Keyword '${match[1]}' should be followed by $ (use '${match[1]}$')`,
                vscode.DiagnosticSeverity.Error
            ));
        }
    }

    /**
     * Check for unclosed strings
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     */
    checkUnclosedStrings(text, document, diagnostics) {
        let inString = false;
        let stringStart = 0;
        let escaped = false;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char === '\\') {
                escaped = !escaped;
                continue;
            }
            
            if (char === '"' && !escaped) {
                if (inString) {
                    inString = false;
                } else {
                    inString = true;
                    stringStart = i;
                }
            }
            
            if (char !== '\\') {
                escaped = false;
            }
            
            // Check for end of line while in string
            if (inString && (char === '\n' || i === text.length - 1)) {
                const startPos = document.positionAt(stringStart);
                const endPos = document.positionAt(i);
                const range = new vscode.Range(startPos, endPos);
                
                diagnostics.push(new vscode.Diagnostic(
                    range,
                    'Unclosed string literal',
                    vscode.DiagnosticSeverity.Error
                ));
                
                inString = false;
            }
        }
    }

    /**
     * Check for invalid function calls
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     */
    checkFunctionCalls(text, document, diagnostics) {
        // Check for built-in functions without :: prefix
        const builtinFunctions = [
            'print', 'len', 'append', 'prepend', 'pop', 'insert', 'remove', 
            'pattern_match', 'get', 'set', 'keys', 'values', 'push', 'peek', 
            'size', 'empty', 'enqueue', 'dequeue', 'front', 'back', 'isEmpty', 
            'qsize', 'addNode', 'removeNode', 'find', 'head', 'tail', 'lsize',
            'http_get', 'http_post', 'http_put', 'http_delete', 'fopen', 
            'fread', 'fwrite', 'fclose', 'to_str', 'to_int'
        ];
        
        // Look for built-in function names followed by opening parenthesis but not preceded by ::
        const regex = new RegExp(`(?<!::)\\b(${builtinFunctions.join('|')})\\s*\\(`, 'g');
        
        let match;
        while ((match = regex.exec(text)) !== null) {
            // Make sure it's not part of a variable name or other identifier
            const prevChar = text[match.index - 1] || ' ';
            if (/[a-zA-Z0-9_]/.test(prevChar)) {
                continue;
            }
            
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[1].length);
            const range = new vscode.Range(startPos, endPos);
            
            diagnostics.push(new vscode.Diagnostic(
                range,
                `Built-in function '${match[1]}' should be prefixed with :: (use '::${match[1]}')`,
                vscode.DiagnosticSeverity.Warning
            ));
        }
    }
}

module.exports = TesseractDiagnosticProvider;