const vscode = require("vscode");
const {
  openWeb,
  isValidDir,
  isValidExt,
  getManifestData,
  writeManifestData,
} = require("../utils/utils");
const { initManifest } = require("./manifest");

let baseUrl;
let createNode;
const {notebook} = require("../config");
if (notebook === "feishu") {
  createNode = require("../notebooks/feishu").createNode;
  baseUrl = require("../config").feishuUrl;
} else if (notebook === "wolai") {
  createNode = require("../notebooks/wolai").createNode;
  baseUrl = require("../config").wolaiUrl;
}

// 创建并打开
const createNote = async () => {
  await initManifest();
  let manifest = getManifestData();

  const currentDocument = vscode.window.activeTextEditor.document;
  const fileUri = vscode.workspace.asRelativePath(currentDocument.uri);

  // 如果不是有效文件，则打开默认笔记
  if (!isValidDir(fileUri) || !isValidExt(fileUri)) {
    return vscode.window.showQuickPick(manifest.default)
    .then(value => {
      value && value.noteUrl && openWeb(value);
    });
  }

  // 找到当前文件的笔记
  let noteItem;
  for (const item of manifest.source) {
    if (item.fileUri === fileUri && item.noteUrl) {
      noteItem = item;
      break;
    };
  };

  // 如果没有笔记，则创建
  if (!noteItem) {
    const node_token = await createNode(manifest.repo_name, fileUri);
    const noteUrl = `${baseUrl}/${node_token}`;

    // 在manifest中
    manifest.source.forEach(item => {
      if (item.fileUri === fileUri) {
        item.noteUrl = noteUrl;
        noteItem = item;
      }
    });

    // 不在manifest中
    if (!noteItem) {
      noteItem = {
        name: currentDocument.fileName.split('/').pop(),
        description: "",
        fileUri: fileUri,
        noteUrl: noteUrl,
      };
      manifest.source.push(noteItem);
    }

    // 写回manifest
    writeManifestData(manifest);
  }

  // 打开笔记
  openWeb(noteItem);
};

const deleteNote = async () => {

};

module.exports = {
  createNote,
  deleteNote,
};
