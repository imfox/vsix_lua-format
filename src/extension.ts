// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import luaStyle from "lua_styles";
const config = vscode.workspace.getConfiguration("lua-format");
const indentSize = config.get<number>("indentSize", 4);

const output = vscode.window.createOutputChannel("lua styles");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const formatter = vscode.languages.registerDocumentFormattingEditProvider("lua", {
		provideDocumentFormattingEdits(
			document: vscode.TextDocument
		): vscode.TextEdit[] {
			const fullText = document.getText();

			let errs: luaStyle.FormatError[] = [];
			// 👇 你的格式化逻辑
			const formatted = luaStyle.styles(fullText, { space: indentSize }, errs);
			errs.forEach(t => output.appendLine(`${document.fileName}:${t.row}:${t.col} '${t.token.value}'`));

			const fullRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(fullText.length)
			);

			return [vscode.TextEdit.replace(fullRange, formatted)];
		}

	});
	context.subscriptions.push(formatter);
}

// This method is called when your extension is deactivated
export function deactivate() {
	output.clear();
}
