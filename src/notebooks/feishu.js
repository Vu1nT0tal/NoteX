const vscode = require("vscode");
const lark = require("@larksuiteoapi/node-sdk");
const {
  feishuUrl,
  feishuAppId,
  feishuAppSecret,
  feishuSpaceId,
} = require("../config");

// 创建实例
const client = new lark.Client({
  appId: feishuAppId,
  appSecret: feishuAppSecret,
  appType: lark.AppType.SelfBuild,
  domain: lark.Domain.Feishu,
});

// 获取节点信息
const getNodeInfo = async (token) => {
  try {
    const resp = await client.wiki.space.getNode({
      params: {
        token: token
      }
    });
    if (resp.code !== 0) {
      throw new Error(resp.msg);
    }
    return resp.data.node;
  } catch (error) {
    vscode.window.showErrorMessage("getNodeInfo Error: ", error);
  };
};

// 创建节点
const _createNode = async (title, parent_token='') => {
  if (title === '') {
    return null;
  }

  try {
    const resp = await client.wiki.spaceNode.create({
      data: {
        obj_type: "docx",
        parent_node_token: parent_token,
        node_type: "origin",
        title: title,
      },
      path: {
        space_id: feishuSpaceId,
      }
    });
    if (resp.code !== 0) {
      throw new Error(resp.msg);
    }
    return resp.data.node;
  } catch (error) {
    vscode.window.showErrorMessage("createNode Error: ", error);
    return null;
  };
};

// 获取根节点
const getRootNode = async (repo_name) => {
  let root_token = '';
  const pages = await getNodeChildren();
  for (const page of pages) {
    if (page.title === repo_name) {
      root_token = page.node_token;
      break;
    }
  }
  if (!root_token) {
    const page = await _createNode(repo_name);
    root_token = page.node_token;
  }

  console.log("root_token", root_token);
  return root_token;
};

// 寻找页面，不存在则创建
const createNode = async (repo_name, fileUri) => {
  let root_token = await getRootNode(repo_name);

  const uriList = fileUri.split('/');
  console.log("fileUri", fileUri);

  let parent_token = root_token;
  for (const item of uriList) {
    root_token = parent_token;
    const pages = await getNodeChildren(parent_token);
    for (const page of pages) {
      if (page.title === item) {
        parent_token = page.node_token;
        break;
      }
    }
    if (root_token === parent_token) {
      const page = await _createNode(item, root_token);
      if (!page) {
        return null;
      }
      parent_token = page.node_token;
    }
    console.log(item, root_token, parent_token);
  }
  return parent_token;
};

// 获取子节点
const getNodeChildren = async (parent_token='', page_token='') => {
  try {
    const resp = await client.wiki.spaceNode.list({
      params: {
        page_size: 50,
        page_token: page_token,
        parent_node_token: parent_token,
      },
      path: {
        space_id: feishuSpaceId,
      }
    });
    if (resp.code !== 0) {
      throw new Error(resp.msg);
    }
    const {data} = resp;
    let result = data.items || [];

    if (data.has_more) {
      const children = await getNodeChildren(parent_token, data.page_token);
      result = result.concat(children);
    }
    return result;
  } catch (error) {
    vscode.window.showErrorMessage("getNodeChildren Error: ", error);
    return [];
  };
};

// 构建节点树
const getSource = async (repo_name) => {
  let root_token = await getRootNode(repo_name);
  const nodeTree = await getNodeTree(root_token);
  return getSourceFromTree(nodeTree);
};

// 取出节点树中的终端节点
const getSourceFromTree = (nodeTree, prefix='') => {
  let fileUri = prefix + "/" + nodeTree.title;
  if (nodeTree.children.length === 0) {
    const item = {
      name: nodeTree.title,
      description: "",
      fileUri: fileUri.split('/').slice(3).join('/'),
      noteUrl: feishuUrl + "/" + nodeTree.node_token,
    }
    return [item];
  } else {
    let result = [];
    for (const node of nodeTree.children) {
      const items = getSourceFromTree(node, fileUri);
      result = result.concat(items);
    }
    return result;
  }
};

// 构建节点树
const getNodeTree = async (root_token) => {
  let nodeInfo = await getNodeInfo(root_token);
  const item = {
    title: nodeInfo.title,
    node_token: nodeInfo.node_token,
    children: [],
  };
  if (nodeInfo.has_child) {
    const pages = await getNodeChildren(root_token);
    for (const page of pages) {
      const node = await getNodeTree(page.node_token);
      item.children.push(node);
    }
  }
  return item;
};

module.exports = {
  createNode,
  getSource,
};
