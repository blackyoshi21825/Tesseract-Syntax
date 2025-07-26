const vscode = require('vscode');

/**
 * Provides code completion items for Tesseract language
 */
const completionProvider = {
    /**
     * Provide completion items for the given position
     * @param {vscode.TextDocument} document 
     * @param {vscode.Position} position 
     * @param {vscode.CancellationToken} token 
     * @param {vscode.CompletionContext} context 
     * @returns {vscode.CompletionItem[] | vscode.CompletionList}
     */
    provideCompletionItems(document, position, token, context) {
        const linePrefix = document.lineAt(position).text.substring(0, position.character);

        // Keywords
        const keywords = [
            { label: 'if$', kind: vscode.CompletionItemKind.Keyword, detail: 'Conditional statement' },
            { label: 'else', kind: vscode.CompletionItemKind.Keyword, detail: 'Else clause' },
            { label: 'elseif$', kind: vscode.CompletionItemKind.Keyword, detail: 'Else if clause' },
            { label: 'loop$', kind: vscode.CompletionItemKind.Keyword, detail: 'Loop statement' },
            { label: 'while$', kind: vscode.CompletionItemKind.Keyword, detail: 'While statement' },
            { label: 'temporal$', kind: vscode.CompletionItemKind.Keyword, detail: 'Temporal loop statement' },
            { label: 'import$', kind: vscode.CompletionItemKind.Keyword, detail: 'Import statement' },
            { label: 'let$', kind: vscode.CompletionItemKind.Keyword, detail: 'Variable declaration' },
            { label: 'func$', kind: vscode.CompletionItemKind.Keyword, detail: 'Function declaration' },
            { label: 'class$', kind: vscode.CompletionItemKind.Keyword, detail: 'Class declaration' },
            { label: 'and', kind: vscode.CompletionItemKind.Operator, detail: 'Logical AND' },
            { label: 'or', kind: vscode.CompletionItemKind.Operator, detail: 'Logical OR' },
            { label: 'not', kind: vscode.CompletionItemKind.Operator, detail: 'Logical NOT' },
            { label: 'true', kind: vscode.CompletionItemKind.Value, detail: 'Boolean true' },
            { label: 'false', kind: vscode.CompletionItemKind.Value, detail: 'Boolean false' }
        ];

        // Built-in functions (after ::)
        const builtinFunctions = [
            { label: 'print', kind: vscode.CompletionItemKind.Function, detail: 'Print to console' },
            { label: 'len', kind: vscode.CompletionItemKind.Function, detail: 'Get length of collection' },
            { label: 'append', kind: vscode.CompletionItemKind.Function, detail: 'Append to collection' },
            { label: 'prepend', kind: vscode.CompletionItemKind.Function, detail: 'Prepend to collection' },
            { label: 'pop', kind: vscode.CompletionItemKind.Function, detail: 'Remove and return last element' },
            { label: 'insert', kind: vscode.CompletionItemKind.Function, detail: 'Insert element at position' },
            { label: 'remove', kind: vscode.CompletionItemKind.Function, detail: 'Remove element' },
            { label: 'pattern_match', kind: vscode.CompletionItemKind.Function, detail: 'Match pattern' },
            { label: 'get', kind: vscode.CompletionItemKind.Function, detail: 'Get element by key' },
            { label: 'set', kind: vscode.CompletionItemKind.Function, detail: 'Set element by key' },
            { label: 'keys', kind: vscode.CompletionItemKind.Function, detail: 'Get dictionary keys' },
            { label: 'values', kind: vscode.CompletionItemKind.Function, detail: 'Get dictionary values' },
            { label: 'push', kind: vscode.CompletionItemKind.Function, detail: 'Push to stack' },
            { label: 'peek', kind: vscode.CompletionItemKind.Function, detail: 'Peek at stack top' },
            { label: 'size', kind: vscode.CompletionItemKind.Function, detail: 'Get collection size' },
            { label: 'empty', kind: vscode.CompletionItemKind.Function, detail: 'Check if collection is empty' },
            { label: 'enqueue', kind: vscode.CompletionItemKind.Function, detail: 'Add to queue' },
            { label: 'dequeue', kind: vscode.CompletionItemKind.Function, detail: 'Remove from queue' },
            { label: 'front', kind: vscode.CompletionItemKind.Function, detail: 'Get front of queue' },
            { label: 'back', kind: vscode.CompletionItemKind.Function, detail: 'Get back of queue' },
            { label: 'isEmpty', kind: vscode.CompletionItemKind.Function, detail: 'Check if empty' },
            { label: 'qsize', kind: vscode.CompletionItemKind.Function, detail: 'Get queue size' },
            { label: 'addNode', kind: vscode.CompletionItemKind.Function, detail: 'Add node to linked list' },
            { label: 'removeNode', kind: vscode.CompletionItemKind.Function, detail: 'Remove node from linked list' },
            { label: 'find', kind: vscode.CompletionItemKind.Function, detail: 'Find node in linked list' },
            { label: 'head', kind: vscode.CompletionItemKind.Function, detail: 'Get first node of linked list' },
            { label: 'tail', kind: vscode.CompletionItemKind.Function, detail: 'Get last node of linked list' },
            { label: 'lsize', kind: vscode.CompletionItemKind.Function, detail: 'Get linked list size' },
            { label: 'lremove', kind: vscode.CompletionItemKind.Function, detail: 'Get linked list size' },
            { label: 'ladd', kind: vscode.CompletionItemKind.Function, detail: 'Add value to the list' },
            { label: 'lget', kind: vscode.CompletionItemKind.Function, detail: 'Get element at index' },
            { label: 'lisEmpty', kind: vscode.CompletionItemKind.Function, detail: 'Get linked list size' },
            { label: 'input', kind: vscode.CompletionItemKind.Function, detail: 'Input from the console' },
            { label: 'fopen', kind: vscode.CompletionItemKind.Function, detail: 'Open a file' },
            { label: 'fread', kind: vscode.CompletionItemKind.Function, detail: 'Read from a file' },
            { label: 'fwrite', kind: vscode.CompletionItemKind.Function, detail: 'Write to a file' },
            { label: 'fclose', kind: vscode.CompletionItemKind.Function, detail: 'Close a file' },
            { label: 'to_str', kind: vscode.CompletionItemKind.Function, detail: 'Int to Str' },
            { label: 'to_int', kind: vscode.CompletionItemKind.Function, detail: 'Str to Int' },
            { label: 'http_get', kind: vscode.CompletionItemKind.Function, detail: 'Make HTTP GET request' },
            { label: 'http_post', kind: vscode.CompletionItemKind.Function, detail: 'Make HTTP POST request' },
            { label: 'http_put', kind: vscode.CompletionItemKind.Function, detail: 'Make HTTP PUT request' },
            { label: 'http_delete', kind: vscode.CompletionItemKind.Function, detail: 'Make HTTP DELETE request' },
            { label: 'rmatch', kind: vscode.CompletionItemKind.Function, detail: 'Match a string using regex' },
            { label: 'rfind_all', kind: vscode.CompletionItemKind.Function, detail: 'Find using regex' },
            { label: 'rreplace', kind: vscode.CompletionItemKind.Function, detail: 'Replace using regex' },
            { label: 'temporal_aggregate', kind: vscode.CompletionItemKind.Function, detail: 'Aggregate temporal variable values' },
            { label: 'temporal_pattern', kind: vscode.CompletionItemKind.Function, detail: 'Detect patterns in temporal variables' },
            { label: 'temporal_condition', kind: vscode.CompletionItemKind.Function, detail: 'Check conditions in temporal window' },
        ];

        // Types
        const types = [
            { label: 'dict', kind: vscode.CompletionItemKind.Class, detail: 'Dictionary type' },
            { label: '<stack>', kind: vscode.CompletionItemKind.Class, detail: 'Stack type' },
            { label: '<queue>', kind: vscode.CompletionItemKind.Class, detail: 'Queue type' },
            { label: '<linked>', kind: vscode.CompletionItemKind.Class, detail: 'Linked list type' },
            { label: '<regex>', kind: vscode.CompletionItemKind.Class, detail: 'Regex type' },
            { label: '<temp@>', kind: vscode.CompletionItemKind.Class, detail: 'Temporal variable type' }
        ];

        // Check for built-in function context (after ::)
        if (linePrefix.endsWith('::')) {
            return builtinFunctions.map(item => {
                const completionItem = new vscode.CompletionItem(item.label, item.kind);
                completionItem.detail = item.detail;
                return completionItem;
            });
        }

        // Default completions (keywords, types, and built-in functions)
        return [...keywords, ...types, ...builtinFunctions].map(item => {
            const completionItem = new vscode.CompletionItem(item.label, item.kind);
            completionItem.detail = item.detail;
            return completionItem;
        });
    }
};

module.exports = completionProvider;