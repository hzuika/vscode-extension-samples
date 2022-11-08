/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	// サーバーは node で実装されている．
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// サーバー用のデバッグオプション．
	// --inspect=6009: Node インスペクターモードのサーバーを実行して，VS Code はサーバーにアタッチしてデバッグできる．
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// 拡張機能がデバッグモードで起動されたら， `debug` オプションが使用される．
	// そうでなければ `run` オプションが使用される．
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Language Client の制御オプション．
	const clientOptions: LanguageClientOptions = {
		// プレインテキストドキュメントに対してサーバーを登録する．
		documentSelector: [{ scheme: 'file', language: 'plaintext' }],
		synchronize: {
			// ワークスペースに含まれる `.clientrc` ファイルの変更をサーバーに通知する．
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Language Client を作成して起動する．
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// Language Client を起動する．サーバーも同時に起動する．
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
