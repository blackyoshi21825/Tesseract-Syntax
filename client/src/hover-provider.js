const vscode = require('vscode');

/**
 * Provides hover information for Tesseract language elements
 */
const hoverProvider = {
    /**
     * Provide hover information for the given position
     * @param {vscode.TextDocument} document 
     * @param {vscode.Position} position 
     * @param {vscode.CancellationToken} token 
     * @returns {vscode.Hover}
     */
    provideHover(document, position, token) {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }

        const word = document.getText(wordRange);

        // Check for keywords
        const keywordInfo = this.getKeywordInfo(word);
        if (keywordInfo) {
            return new vscode.Hover(keywordInfo);
        }

        // Check for built-in functions
        const builtinInfo = this.getBuiltinFunctionInfo(word);
        if (builtinInfo) {
            return new vscode.Hover(builtinInfo);
        }

        // Check for types
        const typeInfo = this.getTypeInfo(word);
        if (typeInfo) {
            return new vscode.Hover(typeInfo);
        }

        return null;
    },

    /**
     * Get information about Tesseract types
     * @param {string} type 
     * @returns {vscode.MarkdownString | null}
     */
    getTypeInfo(type) {
        const typeMap = {
            'regex': new vscode.MarkdownString('**Regular Expression Type**\n\nUsed for pattern matching operations.\n\n```tesseract\nlet$ pattern := <regex> "pattern"//flags\n```\n\n**Flags:**\n- `i` - Case insensitive\n- `g` - Global matching')
        };

        return typeMap[type] || null;
    },

    /**
     * Get information about Tesseract keywords
     * @param {string} keyword 
     * @returns {vscode.MarkdownString | null}
     */
    getKeywordInfo(keyword) {
        const keywordMap = {
            'if$': new vscode.MarkdownString('**Conditional Statement**\n\nUsed for conditional execution of code.\n\n```tesseract\nif$ condition {\n    # code\n}\n```'),
            'else': new vscode.MarkdownString('**Else Clause**\n\nUsed with if$ for alternative execution path.\n\n```tesseract\nif$ condition {\n    # code\n} else {\n    # alternative code\n}\n```'),
            'elseif$': new vscode.MarkdownString('**Else If Clause**\n\nUsed for multiple conditional branches.\n\n```tesseract\nif$ condition1 {\n    # code\n} elseif$ condition2 {\n    # alternative code\n}\n```'),
            'loop$': new vscode.MarkdownString('**Loop Statement**\n\nUsed for iterative execution.\n\n```tesseract\nloop$ condition {\n    # code\n}\n```'),
            'while$': new vscode.MarkdownString('**Loop Statement**\n\nUsed for conditional execution.\n\n```tesseract\nwhile$ condition {\n    # code\n}\n```'),
            'import$': new vscode.MarkdownString('**Import Statement**\n\nUsed to import modules.\n\n```tesseract\nimport$ "module_name"\n```'),
            'let$': new vscode.MarkdownString('**Variable Declaration**\n\nUsed to declare variables.\n\n```tesseract\nlet$ variable_name = value\n```'),
            'func$': new vscode.MarkdownString('**Function Declaration**\n\nUsed to declare functions.\n\n```tesseract\nfunc$ function_name(param1, param2) {\n    # code\n}\n```'),
            'class$': new vscode.MarkdownString('**Class Declaration**\n\nUsed to declare classes.\n\n```tesseract\nclass$ ClassName {\n    # properties and methods\n}\n```'),
            'if': new vscode.MarkdownString('**Conditional Statement Keyword**\n\nUse with $ suffix: `if$`'),
            'else': new vscode.MarkdownString('**Else Clause Keyword**\n\nUse with $ suffix: `else$`'),
            'elseif': new vscode.MarkdownString('**Else If Clause Keyword**\n\nUse with $ suffix: `elseif$`'),
            'loop': new vscode.MarkdownString('**Loop Statement Keyword**\n\nUse with $ suffix: `loop$`'),
            'import': new vscode.MarkdownString('**Import Statement Keyword**\n\nUse with $ suffix: `import$`'),
            'let': new vscode.MarkdownString('**Variable Declaration Keyword**\n\nUse with $ suffix: `let$`'),
            'func': new vscode.MarkdownString('**Function Declaration Keyword**\n\nUse with $ suffix: `func$`'),
            'class': new vscode.MarkdownString('**Class Declaration Keyword**\n\nUse with $ suffix: `class$`'),
            'and': new vscode.MarkdownString('**Logical AND Operator**\n\nReturns true if both operands are true.'),
            'or': new vscode.MarkdownString('**Logical OR Operator**\n\nReturns true if at least one operand is true.'),
            'not': new vscode.MarkdownString('**Logical NOT Operator**\n\nReturns the opposite boolean value of the operand.'),
            'true': new vscode.MarkdownString('**Boolean Value: True**\n\nRepresents a boolean true value.'),
            'false': new vscode.MarkdownString('**Boolean Value: False**\n\nRepresents a boolean false value.')
        };

        return keywordMap[keyword] || null;
    },

    /**
     * Get information about built-in functions
     * @param {string} funcName 
     * @returns {vscode.MarkdownString | null}
     */
    getBuiltinFunctionInfo(funcName) {
        const functionMap = {
            'print': new vscode.MarkdownString('**Print Function**\n\nPrints values to the console.\n\n```tesseract\n::print(value)\n```'),
            'len': new vscode.MarkdownString('**Length Function**\n\nReturns the length of a collection.\n\n```tesseract\n::len(collection)\n```'),
            'append': new vscode.MarkdownString('**Append Function**\n\nAppends an element to the end of a collection.\n\n```tesseract\n::append(collection, element)\n```'),
            'prepend': new vscode.MarkdownString('**Prepend Function**\n\nAdds an element to the beginning of a collection.\n\n```tesseract\n::prepend(collection, element)\n```'),
            'pop': new vscode.MarkdownString('**Pop Function**\n\nRemoves and returns the last element of a collection.\n\n```tesseract\n::pop(collection)\n```'),
            'insert': new vscode.MarkdownString('**Insert Function**\n\nInserts an element at a specific position in a collection.\n\n```tesseract\n::insert(collection, position, element)\n```'),
            'remove': new vscode.MarkdownString('**Remove Function**\n\nRemoves an element from a collection.\n\n```tesseract\n::remove(collection, element)\n```'),
            'pattern_match': new vscode.MarkdownString('**Pattern Match Function**\n\nMatches a pattern against a value.\n\n```tesseract\n::pattern_match(value, pattern)\n```'),
            'get': new vscode.MarkdownString('**Get Function**\n\nRetrieves a value by key from a dictionary.\n\n```tesseract\n::get(dictionary, key)\n```'),
            'set': new vscode.MarkdownString('**Set Function**\n\nSets a value by key in a dictionary.\n\n```tesseract\n::set(dictionary, key, value)\n```'),
            'keys': new vscode.MarkdownString('**Keys Function**\n\nReturns all keys in a dictionary.\n\n```tesseract\n::keys(dictionary)\n```'),
            'values': new vscode.MarkdownString('**Values Function**\n\nReturns all values in a dictionary.\n\n```tesseract\n::values(dictionary)\n```'),
            'push': new vscode.MarkdownString('**Push Function**\n\nPushes an element onto a stack.\n\n```tesseract\n::push(stack, element)\n```'),
            'peek': new vscode.MarkdownString('**Peek Function**\n\nReturns the top element of a stack without removing it.\n\n```tesseract\n::peek(stack)\n```'),
            'size': new vscode.MarkdownString('**Size Function**\n\nReturns the number of elements in a collection.\n\n```tesseract\n::size(collection)\n```'),
            'empty': new vscode.MarkdownString('**Empty Function**\n\nChecks if a collection is empty.\n\n```tesseract\n::empty(collection)\n```'),
            'enqueue': new vscode.MarkdownString('**Enqueue Function**\n\nAdds an element to the end of a queue.\n\n```tesseract\n::enqueue(queue, element)\n```'),
            'dequeue': new vscode.MarkdownString('**Dequeue Function**\n\nRemoves and returns the first element of a queue.\n\n```tesseract\n::dequeue(queue)\n```'),
            'front': new vscode.MarkdownString('**Front Function**\n\nReturns the first element of a queue without removing it.\n\n```tesseract\n::front(queue)\n```'),
            'back': new vscode.MarkdownString('**Back Function**\n\nReturns the last element of a queue without removing it.\n\n```tesseract\n::back(queue)\n```'),
            'isEmpty': new vscode.MarkdownString('**IsEmpty Function**\n\nChecks if a collection is empty.\n\n```tesseract\n::isEmpty(collection)\n```'),
            'qsize': new vscode.MarkdownString('**Queue Size Function**\n\nReturns the number of elements in a queue.\n\n```tesseract\n::qsize(queue)\n```'),
            'addNode': new vscode.MarkdownString('**Add Node Function**\n\nAdds a new node to a linked list.\n\n```tesseract\n::addNode(linkedlist, value)\n```'),
            'removeNode': new vscode.MarkdownString('**Remove Node Function**\n\nRemoves a node with the specified value from a linked list.\n\n```tesseract\n::removeNode(linkedlist, value)\n```'),
            'find': new vscode.MarkdownString('**Find Function**\n\nFinds a node with the specified value in a linked list.\n\n```tesseract\n::find(linkedlist, value)\n```'),
            'head': new vscode.MarkdownString('**Head Function**\n\nReturns the first node of a linked list.\n\n```tesseract\n::head(linkedlist)\n```'),
            'tail': new vscode.MarkdownString('**Tail Function**\n\nReturns the last node of a linked list.\n\n```tesseract\n::tail(linkedlist)\n```'),
            'rmatch': new vscode.MarkdownString('**Regex Match Function**\n\nTests if pattern matches text (returns 1 for match, 0 for no match).\n\n```tesseract\n::rmatch(regex, text)\n```'),
            'rfind_all': new vscode.MarkdownString('**Regex Find All Function**\n\nFinds all match positions in text.\n\n```tesseract\n::rfind_all(regex, text)\n```'),
            'rreplace': new vscode.MarkdownString('**Regex Replace Function**\n\nReplaces first match with replacement text.\n\n```tesseract\n::rreplace(regex, text, replacement)\n```'),
            'lsize': new vscode.MarkdownString('**Linked List Size Function**\n\nReturns the number of nodes in a linked list.\n\n```tesseract\n::lsize(linkedlist)\n```'),
            'input': new vscode.MarkdownString('**Input Function**\n\nGets user input from the console.\n\n```tesseract\n::input(prompt)\n```'),
            'fopen': new vscode.MarkdownString('**File Open Function**\n\nOpens a .txt file.\n\n```::fopen(filename, mode)\n```'),
            'fread': new vscode.MarkdownString('**File Read Function**\n\nRead from a .txt file.\n\n```::fread(filename)\n```'),
            'fwrite': new vscode.MarkdownString('**File Write Function**\n\nWrites from a .txt file.\n\n```::fwrite(filename, content)\n```'),
            'fclose': new vscode.MarkdownString('**File Close Function**\n\nCloses a .txt file.\n\n```::fclose(filename)\n```'),
            'ladd': new vscode.MarkdownString('**Linked List Add Function**\n\nAdd value to the list.\n\n```::ladd(list, value)\n```'),
            'lremove': new vscode.MarkdownString('**Linked List Remove Function**\n\nRemove first occurrence of value.\n\n```::lremove(list, value)\n```'),
            'lget': new vscode.MarkdownString('**Linked List Get Function**\n\nGet element at index.\n\n```::lget(list, index)\n```'),
            'lisEmpty': new vscode.MarkdownString('**Linked List Empty Function**\n\nCheck if list is empty (returns 1 for empty, 0 for non-empty).\n\n```::lisEmpty(list)\n```'),
            'to_str': new vscode.MarkdownString('**Int to Str Function**\n\nConvert an integer to a string.\n\n```::to_str(integer)\n```'),
            'to_int': new vscode.MarkdownString('**Str to Int Function**\n\nConvert a string to an integer.\n\n```::to_int(string)\n```'),
            'http_get': new vscode.MarkdownString('**HTTP GET Function**\n\nMakes an HTTP GET request to a URL.\n\n```tesseract\n::http_get(url, [headers])\n```'),
            'http_post': new vscode.MarkdownString('**HTTP POST Function**\n\nMakes an HTTP POST request to a URL with data.\n\n```tesseract\n::http_post(url, data, [headers])\n```'),
            'http_put': new vscode.MarkdownString('**HTTP PUT Function**\n\nMakes an HTTP PUT request to a URL with data.\n\n```tesseract\n::http_put(url, data, [headers])\n```'),
            'http_delete': new vscode.MarkdownString('**HTTP DELETE Function**\n\nMakes an HTTP DELETE request to a URL.\n\n```tesseract\n::http_delete(url, [headers])\n```'),
        };

        return functionMap[funcName] || null;
    },

    /**
     * Get information about Tesseract types
     * @param {string} typeName 
     * @returns {vscode.MarkdownString | null}
     */
    getTypeInfo(typeName) {
        const typeMap = {
            'dict': new vscode.MarkdownString('**Dictionary Type**\n\nA key-value collection type.\n\n```tesseract\nlet$ myDict = dict{key1: value1, key2: value2}\n```'),
            'stack': new vscode.MarkdownString('**Stack Type**\n\nA last-in-first-out (LIFO) collection.\n\n```tesseract\nlet$ myStack = <stack>\n```'),
            'queue': new vscode.MarkdownString('**Queue Type**\n\nA first-in-first-out (FIFO) collection.\n\n```tesseract\nlet$ myQueue = <queue>\n```'),
            'linked': new vscode.MarkdownString('**Linked List Type**\n\nA linear collection of elements where each element points to the next.\n\n```tesseract\nlet$ myList = <linked>\n```')
        };

        return typeMap[typeName] || null;
    }
};

module.exports = hoverProvider;