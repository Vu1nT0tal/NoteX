const vscode = require("vscode");
const addNotebook = require("./src/commands/notebooks");
const {
  createNote,
  deleteNote,
} = require("./src/commands/notes");
const { updateManifest } = require("./src/commands/manifest");

const activate = () => {
  vscode.commands.registerCommand("notex.addNotebook", addNotebook);
  vscode.commands.registerCommand("notex.createNote", createNote);
  vscode.commands.registerCommand("notex.deleteNote", deleteNote);
  vscode.commands.registerCommand("notex.updateManifest", updateManifest);
};

const deactivate = () => {};

module.exports = {
  activate,
  deactivate,
};
