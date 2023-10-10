# NoteX

VSCode扩展，实现代码和笔记的关联。

- 每个项目对应一个笔记清单，每个源码文件对应一个笔记。
- 在阅读代码的同时，快速创建笔记，记录自己的想法和思考。
- 每个人阅读和修改的都是同一份笔记，方便团队协作，提高效率。
- 笔记和代码分离，无需在代码中添加注释，Git更新代码不会影响笔记。
- 充分利用云笔记的优势，比如图片、表格、双链跳转等，比注释更加灵活丰富。
- 代码和笔记左右对照，方便查看，无需离开VSCode。
- 使用的人越多，笔记越丰富，越能体现价值。
- 目前支持飞书作为笔记托管平台。

这里是我的开源代码笔记，欢迎大家一起来完善：[打开笔记](https://www.wolai.com/chao96/hozK3fTYuXusj7g1yMGUZL)

# 安装

由于一些配置项需要填写，所以暂时只能从源码安装。

```js
// 笔记托管平台
export const notebook = "feishu";

// 飞书
export const feishuUrl = "https://xxxx.feishu.cn/wiki";
export const feishuAppId = "cli_xxxxxxxxxx";
export const feishuAppSecret = "xxxxxxxxxx";
export const feishuSpaceId = "xxxxxxxxxx";
```

拉取项目，用VSCode打开后，在菜单栏选择`运行`->`启动调试`，或使用快捷键`F5`。

```sh
$ git clone https://github.com/VulnTotal-Team/NoteX.git
```

修改完成后打包发布：

```sh
$ npm install -g @vscode/vsce   # 安装打包工具
$ vsce package -o release       # 打包成.vsix
```

最后，打开扩展页面，点击右上角`...`->`从VSIX安装`。

# 使用方法

> 注意：云端所有文件名都是自动生成的，与源码一一对应，切勿修改！
> 在使用中如果遇到什么问题，可以删掉`.notex`目录重来。

打开任意Git项目，右键点击`NoteX:刷新笔记清单`进行初始化，在项目根目录生成`.notex/notex.json`。

在任意源码文件上右键，或者使用快捷键：

- 创建笔记：Mac `Option+A`、Windows `Alt+A`
- 删除笔记：Mac `Option+D`、Windows `Alt+D`（暂未实现，请在网页上删除）

# 参考资料

- Extension API：https://code.visualstudio.com/api

# TODO

- 支持更多笔记平台：我来、Notion等
- 支持本地存储：Markdown文件
