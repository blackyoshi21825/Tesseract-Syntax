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

        // Check for undefined variables
        this.checkUndefinedVariables(text, document, diagnostics);

        // Check for malformed data structures
        this.checkMalformedDataStructures(text, document, diagnostics);

        // Check for incomplete language constructs
        this.checkIncompleteConstructs(text, document, diagnostics);

        // Check for missing semicolons
        this.checkMissingSemicolons(text, document, diagnostics);

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
        // Process the text to exclude string literals
        const processedText = this.removeAllStringLiterals(text);

        const keywordsRequiringDollar = ['if', 'elseif', 'loop', 'while', 'import', 'let', 'func', 'class']; // 'else' doesn't need a $ suffix

        // Regular expression to find keywords without $ suffix
        // Looks for keywords followed by space, but not by $
        const regex = new RegExp(`\\b(${keywordsRequiringDollar.join('|')})\\b(?!\\$)\\s`, 'g');

        let match;
        while ((match = regex.exec(processedText)) !== null) {
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
        // Process the text to exclude string literals
        const processedText = this.removeAllStringLiterals(text);

        // Check for built-in functions without :: prefix
        const builtinFunctions = [
            'print', 'len', 'append', 'prepend', 'pop', 'insert', 'remove',
            'pattern_match', 'get', 'set', 'keys', 'values', 'push', 'peek',
            'size', 'empty', 'enqueue', 'dequeue', 'front', 'back', 'isEmpty',
            'qsize', 'addNode', 'removeNode', 'find', 'head', 'tail', 'lsize',
            'http_get', 'http_post', 'http_put', 'http_delete', 'fopen',
            'fread', 'fwrite', 'fclose', 'to_str', 'to_int', 'lsize', 'ladd', 'lremove',
            'lget', 'lisEmpty'
        ];

        // Process the text line by line
        const lines = processedText.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const originalLine = text.split('\n')[i];
            
            // Skip comments
            if (line.trim().startsWith('#')) {
                continue;
            }
            
            // Simple approach: directly check for each built-in function name
            for (const funcName of builtinFunctions) {
                // Use word boundary to ensure we're matching whole words
                const regex = new RegExp(`\\b${funcName}\\b`, 'g');
                
                let match;
                while ((match = regex.exec(line)) !== null) {
                    // Check if this function is already properly prefixed with ::
                    const startIndex = match.index;
                    const prefixStart = Math.max(0, startIndex - 2);
                    const prefix = line.substring(prefixStart, startIndex);
                    
                    if (prefix === '::') {
                        continue; // Already has proper prefix
                    }
                    
                    // Make sure it's not part of another word
                    const prevChar = startIndex > 0 ? line[startIndex - 1] : ' ';
                    if (/[a-zA-Z0-9_]/.test(prevChar)) {
                        continue;
                    }
                    
                    // Check if it's actually being used as a function
                    // Look for opening parenthesis or string after the function name
                    const afterFuncName = line.substring(startIndex + funcName.length).trim();
                    if (afterFuncName.startsWith('(') || afterFuncName.startsWith('"') || afterFuncName.startsWith('\'')) {
                        const startPos = new vscode.Position(i, startIndex);
                        const endPos = new vscode.Position(i, startIndex + funcName.length);
                        const range = new vscode.Range(startPos, endPos);

                        diagnostics.push(new vscode.Diagnostic(
                            range,
                            `Built-in function '${funcName}' should be prefixed with :: (use '::${funcName}')`,
                            vscode.DiagnosticSeverity.Error
                        ));
                    }
                }
            }
        }
    }

    /**
     * Remove all string literals from text
     * @param {string} text 
     * @returns {string} Text with string literals replaced by spaces
     */
    removeAllStringLiterals(text) {
        let result = '';
        let inString = false;
        let escaped = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (char === '\\') {
                escaped = !escaped;
                result += inString ? ' ' : char;
                continue;
            }

            if (char === '"' && !escaped) {
                inString = !inString;
                result += char;
            } else {
                // Replace characters inside strings with spaces to preserve string length
                result += inString ? ' ' : char;
            }

            if (char !== '\\') {
                escaped = false;
            }
        }

        return result;
    }

    /**
     * Check for undefined variables
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     */
    checkUndefinedVariables(text, document, diagnostics) {
        // Parse the document to find variable declarations
        const declaredVariables = new Set();

        // Find all variable declarations (let$ variable = value or let$ variable := value)
        // More flexible regex to catch different spacing and assignment patterns
        const declarationRegex = /let\$\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*(:)?=/g;
        let match;
        while ((match = declarationRegex.exec(text)) !== null) {
            declaredVariables.add(match[1]);
        }

        // Find function parameters
        const functionRegex = /func\$\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(([^)]*)\)/g;
        while ((match = functionRegex.exec(text)) !== null) {
            const params = match[1].split(',');
            for (const param of params) {
                const trimmedParam = param.trim();
                if (trimmedParam) {
                    declaredVariables.add(trimmedParam);
                }
            }
        }

        // Find class method parameters
        const methodRegex = /func\$\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(([^)]*)\)/g;
        while ((match = methodRegex.exec(text)) !== null) {
            const params = match[1].split(',');
            for (const param of params) {
                const trimmedParam = param.trim();
                if (trimmedParam) {
                    declaredVariables.add(trimmedParam);
                }
            }
        }

        // Add 'self' as it's a special keyword in Tesseract
        declaredVariables.add('self');

        // Add common built-in variables that might be used
        declaredVariables.add('args');
        declaredVariables.add('result');

        // Debug: Log all declared variables
        console.log('Declared variables:', Array.from(declaredVariables));

        // Find variable usages
        // This is a simplified approach - a full parser would be more accurate
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Skip comments
            if (line.trim().startsWith('#')) {
                continue;
            }

            // Process the line to exclude string literals
            const processedLine = this.removeStringLiterals(line);

            // Check for variable declarations in this line and add them to declared variables
            // This ensures variables are recognized even when used later in the same line
            const lineDeclarationRegex = /let\$\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*(:)?=/g;
            while ((match = lineDeclarationRegex.exec(line)) !== null) {
                declaredVariables.add(match[1]);
            }

            // Find variable usages (not in declarations or as function parameters)
            const variableRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
            while ((match = variableRegex.exec(processedLine)) !== null) {
                const varName = match[1];

                // Skip keywords and built-in functions
                if (this.isKeywordOrBuiltin(varName)) {
                    continue;
                }

                // Skip if it's a variable declaration
                if (processedLine.includes(`let$${varName}`) ||
                    processedLine.includes(`let$ ${varName}`) ||
                    processedLine.match(new RegExp(`let\\$\\s*${varName}`))) {
                    continue;
                }

                // Skip if it's a function declaration
                if (processedLine.includes(`func$${varName}`) ||
                    processedLine.includes(`func$ ${varName}`) ||
                    processedLine.match(new RegExp(`func\\$\\s*${varName}`))) {
                    continue;
                }

                // Skip if it's a class declaration
                if (processedLine.includes(`class$${varName}`) ||
                    processedLine.includes(`class$ ${varName}`) ||
                    processedLine.match(new RegExp(`class\\$\\s*${varName}`))) {
                    continue;
                }

                // Check if the variable is declared
                if (!declaredVariables.has(varName)) {
                    const startPos = new vscode.Position(i, match.index);
                    const endPos = new vscode.Position(i, match.index + varName.length);
                    const range = new vscode.Range(startPos, endPos);

                    diagnostics.push(new vscode.Diagnostic(
                        range,
                        `Variable '${varName}' is used but not defined`,
                        vscode.DiagnosticSeverity.Error
                    ));

                    // Add to declared variables to avoid multiple warnings for the same variable
                    declaredVariables.add(varName);
                }
            }
        }
    }

    /**
     * Remove string literals from a line of code
     * @param {string} line 
     * @returns {string} Line with string literals replaced by spaces
     */
    removeStringLiterals(line) {
        let result = '';
        let inString = false;
        let escaped = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '\\') {
                escaped = !escaped;
                result += inString ? ' ' : char;
                continue;
            }

            if (char === '"' && !escaped) {
                inString = !inString;
                result += char;
            } else {
                // Replace characters inside strings with spaces to preserve string length
                result += inString ? ' ' : char;
            }

            if (char !== '\\') {
                escaped = false;
            }
        }

        return result;
    }

    /**
     * Check for malformed data structures
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     */
    checkMalformedDataStructures(text, document, diagnostics) {
        // Check for malformed advanced data types (stack, queue, linked)
        this.checkAdvancedDataTypes(text, document, diagnostics);

        // Check for malformed dictionaries
        this.checkDictionaries(text, document, diagnostics);
    }

    /**
     * Check for malformed advanced data types (stack, queue, linked)
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     */
    checkAdvancedDataTypes(text, document, diagnostics) {
        // Look for incomplete or malformed advanced data types
        // Should be <stack>, <queue>, or <linked>
        const regex = /<(stack|queue|linked)?\s*>|<\s*(stack|queue|linked)>/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const fullMatch = match[0];
            const type1 = match[1] || '';
            const type2 = match[2] || '';

            // Check if the data type is properly formed
            if (fullMatch !== `<${type1 || type2}>`) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + fullMatch.length);
                const range = new vscode.Range(startPos, endPos);

                let message = '';
                if (!type1 && !type2) {
                    message = 'Empty data type brackets. Should be <stack>, <queue>, or <linked>';
                } else {
                    const correctType = type1 || type2;
                    message = `Malformed data type. Should be <${correctType}> without spaces`;
                }

                diagnostics.push(new vscode.Diagnostic(
                    range,
                    message,
                    vscode.DiagnosticSeverity.Error
                ));
            }
        }

        // Look for invalid data types
        const invalidTypeRegex = /<([^>\s]+)>/g;
        while ((match = invalidTypeRegex.exec(text)) !== null) {
            const type = match[1];
            if (!['stack', 'queue', 'linked'].includes(type)) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const range = new vscode.Range(startPos, endPos);

                diagnostics.push(new vscode.Diagnostic(
                    range,
                    `Invalid data type <${type}>. Valid types are <stack>, <queue>, and <linked>`,
                    vscode.DiagnosticSeverity.Error
                ));
            }
        }
    }

    /**
     * Check for malformed dictionaries
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     */
    checkDictionaries(text, document, diagnostics) {
        // Look for dict declarations without proper syntax
        const dictRegex = /\bdict\s*(?!\{)/g;
        let match;

        while ((match = dictRegex.exec(text)) !== null) {
            // Make sure it's not part of a variable name or other identifier
            const prevChar = text[match.index - 1] || ' ';
            if (/[a-zA-Z0-9_]/.test(prevChar)) {
                continue;
            }

            // Check if there's a { after some whitespace
            let foundBrace = false;
            for (let i = match.index + 4; i < text.length && i < match.index + 20; i++) {
                if (text[i] === '{') {
                    foundBrace = true;
                    break;
                } else if (!/\s/.test(text[i])) {
                    break;
                }
            }

            if (!foundBrace) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + 4); // 'dict' length
                const range = new vscode.Range(startPos, endPos);

                diagnostics.push(new vscode.Diagnostic(
                    range,
                    'Dictionary declaration should be followed by { (e.g., dict{key: value})',
                    vscode.DiagnosticSeverity.Error
                ));
            }
        }

        // Check for dict{ without closing }
        const dictOpenRegex = /\bdict\{/g;
        while ((match = dictOpenRegex.exec(text)) !== null) {
            // Find the matching closing brace
            let braceCount = 1;
            let closingIndex = -1;

            for (let i = match.index + 5; i < text.length; i++) {
                if (text[i] === '{') {
                    braceCount++;
                } else if (text[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        closingIndex = i;
                        break;
                    }
                }
            }

            if (closingIndex === -1) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + 5); // 'dict{' length
                const range = new vscode.Range(startPos, endPos);

                diagnostics.push(new vscode.Diagnostic(
                    range,
                    'Unclosed dictionary. Missing closing }',
                    vscode.DiagnosticSeverity.Error
                ));
            }
        }
    }

    /**
     * Check for incomplete language constructs
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     */
    checkIncompleteConstructs(text, document, diagnostics) {
        // Check for if$ without body
        this.checkControlStructures(text, document, diagnostics, 'if$');

        // Check for else without body (note: else doesn't need a $ suffix)
        this.checkControlStructures(text, document, diagnostics, 'else');

        // Check for elseif$ without body
        this.checkControlStructures(text, document, diagnostics, 'elseif$');

        // Check for loop$ without body
        this.checkControlStructures(text, document, diagnostics, 'loop$');

        // Check for while$ without body
        this.checkControlStructures(text, document, diagnostics, 'while$');

        // Check for func$ without body
        this.checkFunctionDefinitions(text, document, diagnostics);

        // Check for class$ without body
        this.checkClassDefinitions(text, document, diagnostics);
    }

    /**
     * Check for incomplete control structures
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     * @param {string} keyword The keyword to check for
     */
    checkControlStructures(text, document, diagnostics, keyword) {
        const regex = new RegExp(`\\b${keyword}\\b(?!.*\\{).*$`, 'gm');
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Check if there's a { on the same line or next few lines
            const lineText = match[0];
            if (lineText.includes('{')) {
                continue;
            }

            // Check next few lines for opening brace
            let foundBrace = false;
            const startLine = document.positionAt(match.index).line;
            const endLine = Math.min(startLine + 3, document.lineCount - 1);

            for (let i = startLine + 1; i <= endLine; i++) {
                if (document.lineAt(i).text.trim().startsWith('{')) {
                    foundBrace = true;
                    break;
                }
            }

            if (!foundBrace) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + keyword.length);
                const range = new vscode.Range(startPos, endPos);

                diagnostics.push(new vscode.Diagnostic(
                    range,
                    `Incomplete ${keyword} statement. Missing { } body`,
                    vscode.DiagnosticSeverity.Error
                ));
            }
        }
    }

    /**
     * Check for incomplete function definitions
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     */
    checkFunctionDefinitions(text, document, diagnostics) {
        const regex = /\bfunc\$\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*(?!\{)/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const funcName = match[1];

            // Check if there's a { on the same line or next few lines
            let foundBrace = false;
            const startLine = document.positionAt(match.index).line;
            const endLine = Math.min(startLine + 3, document.lineCount - 1);

            for (let i = startLine; i <= endLine; i++) {
                if (document.lineAt(i).text.includes('{')) {
                    foundBrace = true;
                    break;
                }
            }

            if (!foundBrace) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const range = new vscode.Range(startPos, endPos);

                diagnostics.push(new vscode.Diagnostic(
                    range,
                    `Incomplete function definition for '${funcName}'. Missing { } body`,
                    vscode.DiagnosticSeverity.Error
                ));
            }
        }
    }

    /**
     * Check for incomplete class definitions
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     */
    checkClassDefinitions(text, document, diagnostics) {
        const regex = /\bclass\$\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?!\{)/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const className = match[1];

            // Check if there's a { on the same line or next few lines
            let foundBrace = false;
            const startLine = document.positionAt(match.index).line;
            const endLine = Math.min(startLine + 3, document.lineCount - 1);

            for (let i = startLine; i <= endLine; i++) {
                if (document.lineAt(i).text.includes('{')) {
                    foundBrace = true;
                    break;
                }
            }

            if (!foundBrace) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const range = new vscode.Range(startPos, endPos);

                diagnostics.push(new vscode.Diagnostic(
                    range,
                    `Incomplete class definition for '${className}'. Missing { } body`,
                    vscode.DiagnosticSeverity.Error
                ));
            }
        }
    }

    /**
     * Check for missing semicolons
     * @param {string} text 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Diagnostic[]} diagnostics 
     */
    checkMissingSemicolons(text, document, diagnostics) {
        const lines = text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Skip empty lines, comments, and lines that end with {, }, or ;
            if (line === '' || line.startsWith('#') || /[{};]\s*$/.test(line)) {
                continue;
            }

            // Skip control structures and declarations that don't need semicolons
            if (line.startsWith('if$') || line.startsWith('else') ||
                line.startsWith('elseif$') || line.startsWith('loop$') ||
                line.startsWith('while$') || line.startsWith('func$') ||
                line.startsWith('class$')) {
                continue;
            }

            // Skip lines that are continuations of multi-line statements
            if (i > 0) {
                const prevLine = lines[i - 1].trim();
                if (prevLine.endsWith('\\')) {
                    continue;
                }
            }

            // Check if the next line starts with a continuation character
            if (i < lines.length - 1) {
                const nextLine = lines[i + 1].trim();
                if (nextLine.startsWith('.') || nextLine.startsWith('->') ||
                    nextLine.startsWith('&&') || nextLine.startsWith('||')) {
                    continue;
                }
            }

            // Process the line to exclude string literals
            const processedLine = this.removeStringLiterals(line);

            // Check if the line actually ends with a semicolon (after removing comments)
            const lineWithoutComments = processedLine.split('#')[0].trim();
            if (lineWithoutComments.endsWith(';')) {
                continue;
            }

            // Check for variable declarations, assignments, and function calls
            if (processedLine.includes('=') ||
                /\b[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(processedLine) ||
                processedLine.includes('::')) {

                // Get the position at the end of the line
                const lineEndPos = new vscode.Position(i, lines[i].length);
                const range = new vscode.Range(lineEndPos, lineEndPos);

                diagnostics.push(new vscode.Diagnostic(
                    range,
                    'Missing semicolon at end of statement',
                    vscode.DiagnosticSeverity.Error
                ));
            }
        }
    }

    /**
     * Check if a word is a keyword or built-in function
     * @param {string} word 
     * @returns {boolean}
     */
    isKeywordOrBuiltin(word) {
        const keywords = [
            'if', 'else', 'elseif', 'loop', 'while', 'import', 'let', 'func', 'class',
            'and', 'or', 'not', 'true', 'false', 'dict', 'stack', 'queue', 'linked'
        ];

        const builtinFunctions = [
            'print', 'len', 'append', 'prepend', 'pop', 'insert', 'remove',
            'pattern_match', 'get', 'set', 'keys', 'values', 'push', 'peek',
            'size', 'empty', 'enqueue', 'dequeue', 'front', 'back', 'isEmpty',
            'qsize', 'addNode', 'removeNode', 'find', 'head', 'tail', 'lsize',
            'http_get', 'http_post', 'http_put', 'http_delete', 'fopen',
            'fread', 'fwrite', 'fclose', 'to_str', 'to_int', 'lsize', 'ladd', 'lremove',
            'lget', 'lisEmpty'
        ];

        return keywords.includes(word) || builtinFunctions.includes(word);
    }
}

module.exports = TesseractDiagnosticProvider;