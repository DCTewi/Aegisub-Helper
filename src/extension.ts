import * as vscode from "vscode";
import {
	variablesCompletionProvider,
    keywordsCompletionProvider,
    luaCompletionProvider,
} from "./CompletionProvider";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
		variablesCompletionProvider,
        keywordsCompletionProvider,
        luaCompletionProvider
    );
}

export function deactivate() {}
