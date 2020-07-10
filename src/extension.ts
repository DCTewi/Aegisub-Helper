import * as vscode from "vscode";
import {
    plainTriggerCompletionProvider,
    variablesCompletionProvider,
    keywordsCompletionProvider,
    luaCompletionProvider,
} from "./CompletionProvider";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        plainTriggerCompletionProvider,
        variablesCompletionProvider,
        keywordsCompletionProvider,
        luaCompletionProvider
    );
}

export function deactivate() {}
