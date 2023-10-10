const vscode = require("vscode");
const {
    wolaiUrl,
    wolaiAppId,
    wolaiAppSecret,
    wolaiToken,
} = require("../config");

const URL_API = 'https://openapi.wolai.com/v1';

// 获取Token
const getToken = async (appId, appSecret, token) => {
    if (token !== "") {
        return token;
    }

    try {
        return await fetch(`${URL_API}/token`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                appId: appId,
                appSecret: appSecret,
            })
        }).json().data.app_token;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// 寻找页面，不存在则创建
const createNode = async (repo_name, fileUri) => {

};

// 构建节点树
const getSource = async (repo_name) => {

};

module.exports = {
    createNode,
    getSource,
};
