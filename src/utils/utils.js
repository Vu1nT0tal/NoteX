const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const axios = require("axios");
const { exec } = require("child_process");
const {
  allowExt,
  ignorePath,
  noteXFolderName,
  manifestName
} = require("../config");

// 网络代理
const axiosProxy = axios.create({
  proxy: {
    host: '127.0.0.1',
    port: 7890,
    protocol: 'http',
  },
});

// 渲染模板
const viewWeb = (data) => {
  const templ = fs
    .readFileSync(path.join(__dirname, "../template/template.ejs"))
    .toString();
  return ejs.render(templ, data);
};

// 打开Webview
const openWeb = (src) => {
  console.log("openWeb:", src);
  const panel = vscode.window.createWebviewPanel(
    src.noteUrl,
    src.name,
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      enableForms: true,
    }
  );

  panel.webview.html = viewWeb({
    src: src.noteUrl,
  });
};

// 判断文件是否需要创建笔记
const isValidExt = (path) => {
  return allowExt.some(item => path.toLowerCase().endsWith(`.${item}`));
};

// 判断是否是忽略目录
const isValidDir = (path) => {
  return ignorePath.some(item => path.toLowerCase().startsWith(item)) === false;
}

// 执行系统命令
function executeCommand(command, cwd=vscode.workspace.workspaceFolders[0].uri.path) {
  const commandStr = `cd ${cwd} && ${command}`;
  console.log("commandStr:", commandStr);

  return new Promise((resolve, reject) => {
    exec(commandStr, {
      maxBuffer: 2048 * 2048,
    }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

// 获取git仓库地址
const getGitUrl = async (uri) => {
  let url = '';
  let key = '';

  try {
    url = await executeCommand("git remote get-url origin", uri.path);
    key = url.split('/').slice(-2).join('/').split('.')[0];
  } catch (error) {
    console.error(`exec error: ${error}`);
  };

  return [url, key];
};

const getWorkspaceUri = () => {
  return vscode.workspace.workspaceFolders[0].uri; // 获取第一个工作目录
};

const getNotexFolderPath = () => {
  const notexFolder = path.join(getWorkspaceUri().path, noteXFolderName);
  if (!fs.existsSync(notexFolder)) {
    fs.mkdirSync(notexFolder, { recursive: true });
  }
  return notexFolder;
};

const getManifestPath = () => {
  return path.join(getNotexFolderPath(), manifestName);
};

const getManifestData = () => {
  try {
    return JSON.parse(fs.readFileSync(getManifestPath()).toString());
  } catch (error) {
    console.error("getManifestData Error: ", error);
    return {};
  };
};

const writeManifestData = (data) => {
  try {
    fs.writeFileSync(getManifestPath(), JSON.stringify(data, null, 2));
  } catch (error) {
    vscode.window.showErrorMessage("writeManifestData Error: ", error);
  };
};

module.exports = {
  axiosProxy,
  openWeb,
  isValidExt,
  isValidDir,
  executeCommand,
  getGitUrl,
  getWorkspaceUri,
  getNotexFolderPath,
  getManifestPath,
  getManifestData,
  writeManifestData,
};
