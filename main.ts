import { type Editor, Plugin } from "obsidian";

export default class CheckboxReorderPlugin extends Plugin {
	private isProcessing = false;

	async onload() {
		this.registerEvent(
			this.app.workspace.on("editor-change", (editor: Editor) => {
				this.processEditor(editor);
			})
		);
	}

	async processEditor(editor: Editor) {
		if (this.isProcessing) return;

		const content = editor.getValue();
		const lines = content.split("\n");
		const checkedLines: string[] = [];
		const uncheckedLines: string[] = [];

		// Separate checked and unchecked checkboxes
		for (const line of lines) {
			const trimmed = line.trim();
			if (trimmed.startsWith("- [x]") || trimmed.startsWith("- [X]")) {
				checkedLines.push(line);
			} else if (trimmed.startsWith("- [ ]")) {
				uncheckedLines.push(line);
			}
		}

		// Skip if no checkboxes found
		if (checkedLines.length === 0) return;

		// Combine checked first, then unchecked
		const newContent = [...checkedLines, ...uncheckedLines].join("\n");

		// Update editor content if changed
		if (newContent !== content) {
			this.isProcessing = true;
			editor.setValue(newContent);
			this.isProcessing = false;
		}
	}
}

// import { Plugin } from 'obsidian';

// export default class TodoPlugin extends Plugin {
// 	statusBarTextElement: HTMLElement;

// 	async onload() {
// 		this.statusBarTextElement = this.addStatusBarItem().createEl('span')

// 		this.app.workspace.on('active-leaf-change', async () => {
// 			const file = this.app.workspace.getActiveFile();

// 			if (file) {
// 				const content = await this.app.vault.read(file);
// 				this.updateLineCount(content);
// 			} else { this.updateLineCount("0"); }
// 		})

// 		this.app.workspace.on('editor-change', (editor) => {
// 			const content = editor.getDoc().getValue();
// 			this.updateLineCount(content);
// 		})
// 	}

// 	updateLineCount(fileContent?: string) {
// 		if (fileContent) {
// 			this.statusBarTextElement.textContent = fileContent === "0" ?
// 				"0 lines" : `${fileContent.split('\n').length} lines`;
// 		}
// 	}
// }