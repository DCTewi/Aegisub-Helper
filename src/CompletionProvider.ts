import * as vscode from "vscode";

const variables: string[] = [
    "$layer",
    "$lstart",
    "$lend",
    "$ldur",
    "$lmid",
    "$style",
    "$actor",
    "$margin_l",
    "$margin_r",
    "$syln",
    "$li",
    "$lleft",
    "$lcenter",
    "$lright",
    "$ltop",
    "$lmiddle",
    "$lbottom",
    "$lx",
    "$ly",
    "$lwidth",
    "$lheight",
    "$sstart",
    "$send",
    "$smid",
    "$sdur",
    "$skdur",
    "$si",
    "$sleft",
    "$scenter",
    "$sright",
    "$sbottom",
    "$smiddle",
    "$stop",
    "$sx",
    "$sy",
    "$swidth",
    "$sheight",
    "$start",
    "$end",
    "$mid",
    "$dur",
    "$kdur",
    "$i",
    "$left",
    "$center",
    "$right",
    "$top",
    "$middle",
    "$bottom",
    "$x",
    "$y",
    "$width",
    "$height",
];

const keywords: string[] = [
    "\\n",
    "\\N",
    "\\h",
    "\\i",
    "\\b",
    "\\u",
    "\\s",
    "\\bord",
    "\\xbord",
    "\\ybord",
    "\\shad",
    "\\xshad",
    "\\yshad",
    "\\be",
    "\\blur",
    "\\fn",
    "\\fs",
    "\\fsp",
    "\\fax",
    "\\fay",
    "\\fe",
    "\\fscx",
    "\\fscy",
    "\\frx",
    "\\fry",
    "\\frz",
    "\\fr",
    "\\c",
    "\\1c",
    "\\2c",
    "\\3c",
    "\\4c",
    "\\alpha",
    "\\1a",
    "\\2a",
    "\\3a",
    "\\4a",
    "\\an",
    "\\a",
    "\\k",
    "\\K",
    "\\kf",
    "\\ko",
    "\\r",
    "\\pos",
    "\\move",
    "\\org",
    "\\fad",
    "\\fade",
    "\\t",
    "\\clip",
    "\\iclip",
    "\\p",
    "\\pbo",
];

const luakeywords = {
    math: [
        "abs",
        "acos",
        "asin",
        "atan",
        "atan2",
        "ceil",
        "cos",
        "cosh",
        "deg",
        "exp",
        "floor",
        "fmod",
        "frexp",
        "huge",
        "ldexp",
        "log",
        "log10",
        "max",
        "min",
        "modf",
        "pi",
        "pow",
        "rad",
        "random",
        "randomseed",
        "sin",
        "sinh",
        "sqrt",
        "tan",
        "tanh",
    ],
    string: [
        "byte",
        "char",
        "dump",
        "find",
        "format",
        "match",
        "gmatch",
        "gsub",
        "len",
        "lower",
        "upper",
        "rep",
        "reverse",
        "sub",
    ],
};

export const plainTriggerCompletionProvider = vscode.languages.registerCompletionItemProvider(
    "aegs",
    {
        provideCompletionItems(
            document: vscode.TextDocument,
            position: vscode.Position,
            token: vscode.CancellationToken,
            context: vscode.CompletionContext
        ) {
            let allCompletions: vscode.CompletionItem[] = [];

            variables.forEach((x) => {
                allCompletions.push(new vscode.CompletionItem(x));
            });
            keywords.forEach((x) => {
                allCompletions.push(new vscode.CompletionItem(x));
            });

            return allCompletions;
        },
    }
);

export const variablesCompletionProvider = vscode.languages.registerCompletionItemProvider(
    "aegs",
    {
        provideCompletionItems(
            document: vscode.TextDocument,
            position: vscode.Position,
            token: vscode.CancellationToken,
            context: vscode.CompletionContext
        ) {
            const linePrefix = document
                .lineAt(position)
                .text.substr(0, position.character);
            if (!linePrefix.endsWith("$")) {
                return undefined;
            }
            let variablesCompletions: vscode.CompletionItem[] = [];

            variables.forEach((x) => {
                x = x.substr(1);
                variablesCompletions.push(new vscode.CompletionItem(x));
            });

            return variablesCompletions;
        },
    },
    "$"
);

export const keywordsCompletionProvider = vscode.languages.registerCompletionItemProvider(
    "aegs",
    {
        provideCompletionItems(
            document: vscode.TextDocument,
            position: vscode.Position,
            token: vscode.CancellationToken,
            context: vscode.CompletionContext
        ) {
            const linePrefix = document
                .lineAt(position)
                .text.substr(0, position.character);
            if (!linePrefix.endsWith("\\")) {
                return undefined;
            }

            let keywordCompletions: vscode.CompletionItem[] = [];

            keywords.forEach((x) => {
                x = x.substr(1);
                keywordCompletions.push(new vscode.CompletionItem(x));
            });

            return keywordCompletions;
        },
    },
    "\\"
);

export const luaCompletionProvider = vscode.languages.registerCompletionItemProvider(
    "aegs",
    {
        provideCompletionItems(
            document: vscode.TextDocument,
            position: vscode.Position
        ) {
            const linePrefix = document
                .lineAt(position)
                .text.substr(0, position.character);
            let luaCompletions: vscode.CompletionItem[] = [];

            if (linePrefix.endsWith("math.")) {
                luakeywords.math.forEach((x) => {
                    luaCompletions.push(
                        new vscode.CompletionItem(
                            x,
                            vscode.CompletionItemKind.Method
                        )
                    );
                });
            } else if (linePrefix.endsWith("string.")) {
                luakeywords.string.forEach((x) => {
                    luaCompletions.push(
                        new vscode.CompletionItem(
                            x,
                            vscode.CompletionItemKind.Method
                        )
                    );
                });
            } else {
                return undefined;
            }

            return luaCompletions;
        },
    },
    "."
);
