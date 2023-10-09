const allowExt = [
  "sh", "pl", "bat",
  "c", "cpp", "cc", "cxx", "h", "hpp", "hxx", "s",
  "py",
  "go",
  "js", "mjs", "cjs", "jsx", "ts",
  "java", "kt",
  "php",
  "rb",
  "rs", "rust",
  "cs",
  "hs",
  "sql",
  "swift",
  "ql", "qll",
];
const ignorePath = [
  "node_modules", "docs", "bin", "build", "tests", "test",
  "src/test", "src/tests"
];
const noteXFolderName = ".notex";
const manifestName = "notex.json";
const defaultManifestName = "notex-default.json";

// 飞书
const feishuUrl = "https://xxxxxxxxxx.feishu.cn/wiki";
const feishuAppId = "cli_xxxxxxxxxx";
const feishuAppSecret = "xxxxxxxxxx";
const feishuSpaceId = "xxxxxxxxxx";

// 我来
const wolaiUrl = "";
const wolaiAppId = "";
const wolaiAppSecret = "";

module.exports = {
  allowExt,
  ignorePath,
  noteXFolderName,
  manifestName,
  defaultManifestName,

  feishuUrl,
  feishuAppId,
  feishuAppSecret,
  feishuSpaceId,
};
