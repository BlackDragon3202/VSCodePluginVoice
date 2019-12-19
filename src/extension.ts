import * as vscode from 'vscode';
import * as say from 'say';
import {window, ExtensionContext} from 'vscode';

const getVoice = (): string| undefined =>
    vscode.workspace.getConfiguration('speech').get<string>('malevoice');

const getSpeed = (): number | undefined =>
    vscode.workspace.getConfiguration('speech').get<number>('speed');


const stopSpeaking = () => {
    say.stop();
}

const speakCurrentSelection = (editor: vscode.TextEditor, speed: number | undefined) => {
    const selection = editor.selection;
    if (!selection) {
        return;
    }

    speakText(editor.document.getText(selection), speed);
};

const speakDocument = (editor: vscode.TextEditor) => {
    speakText(editor.document.getText(), getSpeed());
};

const speakText = (text: string, speed: number | undefined) => {
    text = text.trim();
    if (text.length > 0) {
        say.speak(text, getVoice(), speed);
    }
};

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('speech.speakDocument', (editor) => {
        stopSpeaking();
        if (!editor) {
            return;
        }
        speakDocument(editor);
    }));

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('speech.speakSelectedText(doubleSpeed)', (editor) => {
        stopSpeaking();
        if (!editor) {

            return;
        }
        speakCurrentSelection(editor, 2);
    }));

   

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('speech.speakTextWithSpeedSelection', async (editor) => {
        stopSpeaking();
        if (!editor) {
            return;
        }

       const result = await window.showInputBox({
           placeHolder: 'Choose speed voice. For example: 1.5, 3',
        });
        let val = result as unknown as (number | undefined);
        speakCurrentSelection(editor, val);
		
    }));

    

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('speech.speakSelectedText(oneAndHalfSpeed)', (editor) => {
        stopSpeaking();
        if (!editor) {
            return;
        }
        speakCurrentSelection(editor, 1.5);
    }));

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('speech.speakSelectedText(halfSpeed)', (editor) => {
        stopSpeaking();
        if (!editor) {
            return;
        }
        
        speakCurrentSelection(editor, 0.5);
    }));

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('speech.speakSelectedText', (editor) => {
        stopSpeaking();
        if (!editor) {
            return;
        }
        speakCurrentSelection(editor, getSpeed());
    }));
    

    context.subscriptions.push(vscode.commands.registerCommand('speech.stopSpeaking', () => {
        stopSpeaking();
    }));
}
