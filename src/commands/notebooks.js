const vscode = require("vscode");

const addNotebook = async () => {
  vscode.window.showInformationMessage("addNotebook");
};

const editNotebook = async () => {
  vscode.window.showInformationMessage("editNotebook");
};

const deleteNotebook = async () => {
  vscode.window.showInformationMessage("deleteNotebook");
};

module.exports = {
  addNotebook,
  editNotebook,
  deleteNotebook,
};
