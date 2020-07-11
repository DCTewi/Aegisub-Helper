import * as vscode from "vscode";
import { writeFileSync } from "fs";

export const compileProvider = vscode.commands.registerCommand(
    "aegisub-helper.compile",
    compilePromise
);

function ezLoc(zh: string, en: string): string {
    return vscode.env.language === "zh-cn" ? zh : en;
}

function compilePromise() {
    if (!vscode.window.activeTextEditor?.document.fileName.endsWith('.aegs')) {
        vscode.window.showErrorMessage(ezLoc('[Aegsiub Helper] 不支持的文件类型!', '[Aegsiub Helper] Unsupported file type!'));
        return;
    }

    vscode.window.setStatusBarMessage(
        ezLoc("[Aegsiub Helper] 编译中...", "[Aegsiub Helper] Compiling..."),
        new Promise(compileAction)
    );
}

function compileAction(resolve: (value?: unknown) => void) {
    const crtEditor = vscode.window.activeTextEditor;
    if (!crtEditor) {
        vscode.window.showErrorMessage(
            ezLoc("[Aegsiub Helper] 请先打开aegs文件再编译", "[Aegsiub Helper] Please open .aegs file first")
        );
        resolve.apply(undefined);
        return;
    }

    const content = crtEditor.document.getText();
    const crtpath = crtEditor.document.fileName;
    let templateLines: string[] = [];
    content.match(/(?<=\%\[)[^]*?(?=\%\])/gm)?.forEach((x) => {
        templateLines.push(x.toString());
    });

    let results: string[] = [];
    templateLines.forEach((x) => {
        results.push(zip2SingleLine(x));
    });

    const wsedit = new vscode.WorkspaceEdit();
    const outuri = vscode.Uri.file(crtpath + ".generated");

    wsedit.createFile(outuri, { ignoreIfExists: true });
    writeFileSync(outuri.fsPath, results.join("\n"), "utf8");

    vscode.workspace.applyEdit(wsedit);
    vscode.workspace.openTextDocument(outuri).then((doc) => {
        vscode.window.showTextDocument(doc);
        vscode.window.showInformationMessage(
            ezLoc("[Aegsiub Helper] 编译完成", "[Aegsiub Helper] Compilation complete")
        );
    });

    resolve.apply(undefined);
}

function zip2SingleLine(raw: string): string {
    const effecttag = raw.match(/\S.*?(?=\s*\#)/)?.toString();
    const commenttag = raw.match(/(?<=\#\s*)\S.*?(?=\s*\@)/)?.toString();
    const layerid = raw.match(/(?<=\@\s*)\S.*?(?=\s*\n)/)?.toString();

    let content = raw.substr(raw.indexOf("\n"));
    content = content.replace(/\s*--(?!\[\[).*/g, ""); // comment
    content = content.replace(/\s*\-\-\[\[[^]*?\]\]/g, ""); // multiline comment
    content = content.replace(/\r/g, "");
    content = content.replace(
        /\n/g,
        effecttag?.indexOf("code") !== -1 ? " " : ""
    ); // zip
    content = content.replace(/  /g, ""); // useless spaces

    // For Aegisub default `Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`
    const res = `Comment: ${layerid},0:00:00.00,0:00:00.00,Default,${commenttag},0,0,0,${effecttag},${content}`;

    return res;
}
