# Language Client について

## `/package.json` 

このセクションは、プレーン テキスト ファイル (たとえば、拡張子 .txt のファイル) が開かれるとすぐに拡張機能を有効にするように VS Code に指示します。
```json
"activationEvents": [
    "onLanguage:plaintext"
]
```

このセクションでは、構成設定を VS Code に提供します。この例では、起動時および設定の変更ごとに、これらの設定が言語サーバーにどのように送信されるかを説明します。
```json
"configuration": {
    "type": "object",
    "title": "Example configuration",
    "properties": {
        "languageServerExample.maxNumberOfProblems": {
            "scope": "resource",
            "type": "number",
            "default": 100,
            "description": "Controls the maximum number of problems produced by the server."
        }
    }
}
```

## `/client/package.json`

実際の Language Client ソース コードと対応する package.json は、/client フォルダーにあります。

`/client/package.json` ファイルの興味深い部分は、エンジン フィールドを介して vscode 拡張ホスト API を参照し、`vscode-languageclient` ライブラリに依存関係を追加することです。

```json
"engines": {
    "vscode": "^1.52.0"
},
"dependencies": {
    "vscode-languageclient": "^7.0.0"
}
```

## `/client/src/extension.ts`

lsp-sample 拡張機能のエントリです．

# Language Server について

VS Code には既に Node.js ランタイムが付属しているため、ランタイムに特定の要件がない限り、独自のものを提供する必要はありません。

Language Server のソース コードは /server にあります。

## `./server/package.json`

vscode-languageserver ライブラリを使用しています．

```json
	"dependencies": {
		"vscode-languageserver": "^7.0.0",
		"vscode-languageserver-textdocument": "^1.0.4"
	},
```

## `./server/src/server.ts`

`./server/src/server.ts` は提供されているテキスト ドキュメント マネージャーを使用するサーバーの実装です。このマネージャーは、常に VS Code からサーバーに増分デルタを送信することによってテキスト ドキュメントを同期します。

# 診断

1. Ctrl + Shift + B で client と server の両方をビルドする．
1. Launch Client を選択して， Start Debugging でデバッガを起動する(新しい VS Code が開く)．
1. test.txt を作る．
1. 以下を貼り付ける．
```
TypeScript lets you write JavaScript the way you really want to.
TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
ANY browser. ANY host. ANY OS. Open Source.
```

---

# LSP Example

Heavily documented sample code for https://code.visualstudio.com/api/language-extensions/language-server-extension-guide

## Functionality

This Language Server works for plain text file. It has the following language features:
- Completions
- Diagnostics regenerated on each file change or configuration change

It also includes an End-to-End test.

## Structure

```
.
├── client // Language Client
│   ├── src
│   │   ├── test // End to End tests for Language Client / Server
│   │   └── extension.ts // Language Client entry point
├── package.json // The extension manifest.
└── server // Language Server
    └── src
        └── server.ts // Language Server entry point
```

## Running the Sample

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to start compiling the client and server in [watch mode](https://code.visualstudio.com/docs/editor/tasks#:~:text=The%20first%20entry%20executes,the%20HelloWorld.js%20file.).
- Switch to the Run and Debug View in the Sidebar (Ctrl+Shift+D).
- Select `Launch Client` from the drop down (if it is not already).
- Press ▷ to run the launch config (F5).
- If you want to debug the server as well, use the launch configuration `Attach to Server`
- In the [Extension Development Host](https://code.visualstudio.com/api/get-started/your-first-extension#:~:text=Then%2C%20inside%20the%20editor%2C%20press%20F5.%20This%20will%20compile%20and%20run%20the%20extension%20in%20a%20new%20Extension%20Development%20Host%20window.) instance of VSCode, open a document in 'plain text' language mode.
  - Type `j` or `t` to see `Javascript` and `TypeScript` completion.
  - Enter text content such as `AAA aaa BBB`. The extension will emit diagnostics for all words in all-uppercase.
