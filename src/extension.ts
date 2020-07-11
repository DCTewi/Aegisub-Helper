import * as vscode from "vscode";
import {
    plainTriggerCompletionProvider,
    variablesCompletionProvider,
    keywordsCompletionProvider,
    luaCompletionProvider,
} from "./CompletionProvider";
import { compileProvider } from "./Compiler";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        // compile
        compileProvider,
        // completions
        plainTriggerCompletionProvider,
        variablesCompletionProvider,
        keywordsCompletionProvider,
        luaCompletionProvider
    );
}

export function deactivate() {}
