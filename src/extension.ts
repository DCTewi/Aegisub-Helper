import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "aegisub-karaoke" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "aegisub-karaoke.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from Aegisub-Karaoke!");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
