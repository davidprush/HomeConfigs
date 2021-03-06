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
const constants_1 = require("./constants");
const logger_1 = require("./logger");
var SuppressedKeys;
(function (SuppressedKeys) {
    SuppressedKeys["CommitHasNoPreviousCommitWarning"] = "suppressCommitHasNoPreviousCommitWarning";
    SuppressedKeys["CommitNotFoundWarning"] = "suppressCommitNotFoundWarning";
    SuppressedKeys["FileNotUnderSourceControlWarning"] = "suppressFileNotUnderSourceControlWarning";
    SuppressedKeys["GitVersionWarning"] = "suppressGitVersionWarning";
    SuppressedKeys["LineUncommittedWarning"] = "suppressLineUncommittedWarning";
    SuppressedKeys["NoRepositoryWarning"] = "suppressNoRepositoryWarning";
    SuppressedKeys["UpdateNotice"] = "suppressUpdateNotice";
    SuppressedKeys["WelcomeNotice"] = "suppressWelcomeNotice";
})(SuppressedKeys = exports.SuppressedKeys || (exports.SuppressedKeys = {}));
class Messages {
    static configure(context) {
        this.context = context;
    }
    static showCommitHasNoPreviousCommitWarningMessage(commit) {
        if (commit === undefined)
            return Messages._showMessage('info', `Commit has no previous commit`, SuppressedKeys.CommitHasNoPreviousCommitWarning);
        return Messages._showMessage('info', `Commit ${commit.shortSha} (${commit.author}, ${commit.fromNow()}) has no previous commit`, SuppressedKeys.CommitHasNoPreviousCommitWarning);
    }
    static showCommitNotFoundWarningMessage(message) {
        return Messages._showMessage('warn', `${message}. The commit could not be found`, SuppressedKeys.CommitNotFoundWarning);
    }
    static showFileNotUnderSourceControlWarningMessage(message) {
        return Messages._showMessage('warn', `${message}. The file is probably not under source control`, SuppressedKeys.FileNotUnderSourceControlWarning);
    }
    static showLineUncommittedWarningMessage(message) {
        return Messages._showMessage('warn', `${message}. The line has uncommitted changes`, SuppressedKeys.LineUncommittedWarning);
    }
    static showNoRepositoryWarningMessage(message) {
        return Messages._showMessage('warn', `${message}. No repository could be found`, SuppressedKeys.NoRepositoryWarning);
    }
    static showUnsupportedGitVersionErrorMessage(version) {
        return Messages._showMessage('error', `GitLens requires a newer version of Git (>= 2.2.0) than is currently installed (${version}). Please install a more recent version of Git.`, SuppressedKeys.GitVersionWarning);
    }
    static showUpdateMessage(version) {
        return __awaiter(this, void 0, void 0, function* () {
            const viewReleaseNotes = 'View Release Notes';
            const result = yield Messages._showMessage('info', `GitLens has been updated to v${version}`, SuppressedKeys.UpdateNotice, undefined, viewReleaseNotes);
            if (result === viewReleaseNotes) {
                vscode_1.commands.executeCommand(constants_1.BuiltInCommands.Open, vscode_1.Uri.parse('https://marketplace.visualstudio.com/items/eamodio.gitlens/changelog'));
            }
            return result;
        });
    }
    static showWelcomeMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const viewDocs = 'View Docs';
            const result = yield Messages._showMessage('info', `Thank you for choosing GitLens! GitLens is powerful, feature rich, and highly configurable, so please be sure to view the docs and tailor it to suit your needs.`, SuppressedKeys.WelcomeNotice, null, viewDocs);
            if (result === viewDocs) {
                vscode_1.commands.executeCommand(constants_1.BuiltInCommands.Open, vscode_1.Uri.parse('https://marketplace.visualstudio.com/items/eamodio.gitlens'));
            }
            return result;
        });
    }
    static _showMessage(type, message, suppressionKey, dontShowAgain = 'Don\'t Show Again', ...actions) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log(`ShowMessage(${type}, '${message}', ${suppressionKey}, ${dontShowAgain})`);
            if (Messages.context.globalState.get(suppressionKey, false)) {
                logger_1.Logger.log(`ShowMessage(${type}, ${message}, ${suppressionKey}, ${dontShowAgain}) skipped`);
                return undefined;
            }
            if (dontShowAgain !== null) {
                actions.push(dontShowAgain);
            }
            let result = undefined;
            switch (type) {
                case 'info':
                    result = yield vscode_1.window.showInformationMessage(message, ...actions);
                    break;
                case 'warn':
                    result = yield vscode_1.window.showWarningMessage(message, ...actions);
                    break;
                case 'error':
                    result = yield vscode_1.window.showErrorMessage(message, ...actions);
                    break;
            }
            if (dontShowAgain === null || result === dontShowAgain) {
                logger_1.Logger.log(`ShowMessage(${type}, '${message}', ${suppressionKey}, ${dontShowAgain}) don't show again requested`);
                yield Messages.context.globalState.update(suppressionKey, true);
                if (result === dontShowAgain)
                    return undefined;
            }
            logger_1.Logger.log(`ShowMessage(${type}, '${message}', ${suppressionKey}, ${dontShowAgain}) returned ${result}`);
            return result;
        });
    }
}
exports.Messages = Messages;
//# sourceMappingURL=messages.js.map