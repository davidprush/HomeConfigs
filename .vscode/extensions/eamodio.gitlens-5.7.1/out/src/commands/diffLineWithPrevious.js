'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const common_1 = require("./common");
const gitService_1 = require("../gitService");
const logger_1 = require("../logger");
const messages_1 = require("../messages");
class DiffLineWithPreviousCommand extends common_1.ActiveEditorCommand {
    constructor(git) {
        super(common_1.Commands.DiffLineWithPrevious);
        this.git = git;
    }
    execute(editor, uri, args = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            uri = common_1.getCommandUri(uri, editor);
            if (uri === undefined)
                return undefined;
            const gitUri = yield gitService_1.GitUri.fromUri(uri, this.git);
            args = Object.assign({}, args);
            if (args.line === undefined) {
                args.line = editor === undefined ? 0 : editor.selection.active.line;
            }
            if (args.commit === undefined || gitService_1.GitService.isUncommitted(args.commit.sha)) {
                if (editor !== undefined && editor.document !== undefined && editor.document.isDirty)
                    return undefined;
                const blameline = args.line;
                if (blameline < 0)
                    return undefined;
                try {
                    const blame = yield this.git.getBlameForLine(gitUri, blameline);
                    if (blame === undefined)
                        return messages_1.Messages.showFileNotUnderSourceControlWarningMessage('Unable to open compare');
                    args.commit = blame.commit;
                }
                catch (ex) {
                    logger_1.Logger.error(ex, 'DiffLineWithPreviousCommand', `getBlameForLine(${blameline})`);
                    return vscode_1.window.showErrorMessage(`Unable to open compare. See output channel for more details`);
                }
            }
            const diffArgs = {
                repoPath: args.commit.repoPath,
                lhs: {
                    sha: args.commit.previousSha !== undefined ? args.commit.previousSha : gitService_1.GitService.fakeSha,
                    uri: args.commit.previousUri
                },
                rhs: {
                    sha: args.commit.sha,
                    uri: args.commit.uri
                },
                line: args.line,
                showOptions: args.showOptions
            };
            return vscode_1.commands.executeCommand(common_1.Commands.DiffWith, diffArgs);
        });
    }
}
exports.DiffLineWithPreviousCommand = DiffLineWithPreviousCommand;
//# sourceMappingURL=diffLineWithPrevious.js.map