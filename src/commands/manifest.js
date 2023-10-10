const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const {
  defaultManifestName,
  notebook,
} = require("../config");
const {
  isValidExt,
  isValidDir,
  executeCommand,
  getGitUrl,
  getWorkspaceUri,
  getManifestData,
  writeManifestData,
  getManifestPath,
} = require("../utils/utils");

let getSource;
if (notebook === "feishu") {
  getSource = require("../notebooks/feishu").getSource;
} else if (notebook === "wolai") {
  getSource = require("../notebooks/wolai").getSource;
}

// 本地创建manifest
const initManifest = async () => {
  if (fs.existsSync(getManifestPath())) {
    return;
  }

  const defaultManifest = path.join(__dirname, `../template/${defaultManifestName}`);

  // 获取本地笔记
  const scanFiles = async (uri) => {
    let result = [];

    // 如果.git存在，则获取仓库代码，否则遍历目录
    if (fs.existsSync(path.join(uri.path, `.git`))) {
      result = await parseGit(uri);
    }
    if (result.length === 0) {
      result = await traverseDir(uri);
    }
    return result;
  };

  // 获取git仓库代码
  const parseGit = async (uri) => {
    let files = [];

    try {
      const result = await executeCommand("git ls-tree -r --name-only HEAD | grep -v '^\\.\\|/$'", uri.path);
      const lines = result.split('\n');

      for (const fileUri of lines) {
        const name = fileUri.split('/').pop();

        if (isValidDir(fileUri) && isValidExt(name)) {
          const temp = {
            name: name,
            description: "",
            fileUri: fileUri,
            noteUrl: "",
          };
          files.push(temp);
        }
      }
    } catch (error) {
      console.error(`exec error: ${error}`);
    }

    return files;
  };

  // 获取本地代码
  const traverseDir = async (uri, files=[]) => {
    const entries = await vscode.workspace.fs.readDirectory(uri);
    for (const [name, type] of entries) {
      const entryUri = vscode.Uri.joinPath(uri, name);
      const fileUri = vscode.workspace.asRelativePath(entryUri);

      // 跳过隐藏目录和黑名单目录
      if (name.startsWith(".") || !isValidDir(fileUri)) {
        continue;
      }

      if (type === vscode.FileType.Directory) {
        // 如果是目录则递归
        await traverseDir(entryUri, files);
      }
      else if (isValidExt(name)) {
        const temp = {
          name: name,
          description: "",
          fileUri: fileUri,
          noteUrl: "",
        };
        files.push(temp);
      }
    }

    return files;
  };

  const createNoteXFile = async (uri) => {
    // 扫描仓库
    let manifest = JSON.parse(fs.readFileSync(defaultManifest));
    manifest.source = []; // await scanFiles(uri);
    [manifest.repo_url, manifest.repo_name] = await getGitUrl(uri);

    // 写入manifest
    console.log(manifest);
    writeManifestData(manifest);
    vscode.window.showInformationMessage("NoteX Created: .notex/notex.json");
  };

  // 创建NoteX
  await createNoteXFile(getWorkspaceUri());
};

// 从笔记本更新manifest
const updateManifest = async () => {
  vscode.window.showInformationMessage("NoteX Updating...");

  await initManifest();
  const manifest = getManifestData();
  if (!manifest.repo_name) {
    vscode.window.showErrorMessage("NoteX Error: .notex/notex.json");
    return;
  }

  const files = await getSource(manifest.repo_name);
  console.log(files);
  manifest.source = files;
  writeManifestData(manifest);

  vscode.window.showInformationMessage("NoteX Updated: .notex/notex.json");
};

module.exports = {
  initManifest,
  updateManifest,
};
