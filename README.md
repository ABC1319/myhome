# Sky's Personal Homepage | 个人极简美学主页

这是一个极具设计感、轻量且高度交互的**个人美学主页与数字化工作台**。主页采用全玻璃态（Glassmorphism）视觉风格和创新的微动效，适配**电脑（Desktop）、平板（Tablet）与手机（Mobile）**等全平台自适应终端。

主页集成了高精度时钟、智能天气动态挂件、每日一言（一言 Hitokoto）、快捷卡片式导航、专业技能栈树、响应式音乐电台、互动留言板，以及**基于 Gemini 大模型的个人 AI 数字化主理分身**。

---

## 🌟 核心技术栈

- **前端框架**：React 18 (TypeScript)
- **构建工具**：Vite
- **样式方案**：Tailwind CSS (自适应流畅栅格 + 高斯模糊玻璃拟态 + 暗色美学阴影)
- **动画引擎**：Framer Motion (用于流畅的多标签页和动态面板切入动画)
- **图标库**：Lucide React
- **后端支持**：Express + Vite 中间件（在全栈开发模式下提供后台 API 代理，可选静态 SPA 纯前端托管）

---

## 📱 全平台多端自适应设计 (Responsive & Interactive)

本项目专门对三大主流终端进行了微调和高灵敏度响应适配：
1. **电脑端（Desktop）**：
   - 充分利用宽屏优势，采用左右分栏大网格（2:3）布局。
   - 左侧为高精度动态时钟、今日天气与每日一言，右侧为多功能交互中央标签面板。
   - 包含桌面级自定义壁纸切换、模糊度调节等快捷控制面板（Control Center）。
2. **平板端（Tablet）**：
   - 自动收缩主网格间距，优化单页画布宽度限制，避免超宽拉伸（最大限制 1200px 宽度）。
   - 交互按钮与触控区域放大至安全触控高度，配合手势操作。
3. **手机端（Mobile）**：
   - 由双列自然降级为流畅的纵向垂直单列卡片轻量滚动流。
   - 标签导航条（Tabs）采用底栏式的精致微缩双行按键样式（高亮显示、带小红点与微标），确保单手大拇指轻松触及。
   - 自动隐藏非高频长文本统计，优化滚动性能并确保在极短屏幕下无遮挡溢出。

---

## 📂 项目文件结构及其功能详解

下面是项目完整的源码层级结构，各个组件均职责单一、无多余依赖：

```bash
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD: 推送触发 GitHub Pages 自动编译部署服务
├── .env.example            # 环境变量配置模板（如 API Key 占位符）
├── .gitignore              # Git 提交过滤文件清单
├── index.html              # 应用唯一入口 HTML 实质承载页面
├── metadata.json           # 应用元数据包描述、系统权限和核心能力特征
├── package.json            # NPM 项目声明书（包含依赖运行、构建脚本）
├── tsconfig.json           # TypeScript 编译验证规则标准文件
├── vite.config.ts          # Vite 打包规则、端口管理以及插件加载文件
├── server.ts               # Express 生产/开发混合全栈架构服务程序 (可选全栈部署)
└── src/                    # 源码核心工作目录
    ├── main.tsx            # 全局最外层 React 渲染加载锚定节点文件
    ├── index.css           # 全局样式控制中心（含 Tailwind 注入和定制玻璃态伪类）
    ├── types.ts            # 项目级核心公共接口与共享 TypeScript 规范
    ├── App.tsx             # 顶层状态管理器控制中心（承载皮肤壁纸状态、选项卡逻辑、主要布局框架）
    └── components/         # 独立功能型沙盒组件目录
        ├── Clock.tsx          # 精密动态时钟：显示人性化干支纪年、农历推荐与实时精确时间
        ├── Weather.tsx        # 动态天气部件：包含自定义切换不同气象环境
        ├── Hitokoto.tsx       # 诗意一言：展示优雅格言，提供一键刷新及复制分享
        ├── NavigatorGrid.tsx  # 导航卡片矩阵：管理高频工具箱入口，提供优雅懸浮特效
        ├── Skills.tsx         # 技能可视化树：可视化程序员、设计师的职业熟练度技能树
        ├── MusicPlayer.tsx    # 极简动态音乐网：带有实时旋转封面动效和轻盈声波谱图
        ├── AIGuestbook.tsx    # 仿社交媒体留言板：支持本地缓存与优雅时间线流动
        ├── AIChat.tsx         # AI 助手分身界面：与您专属 AI 分身或主理人实现在线流畅应答
        └── ControlCenter.tsx  # 精准控制中心：提供无缝模糊度调配、壁纸切换和字体艺术转换
```

### 🧩 核心组件模块功能速览：
- **`App.tsx`**：负责统配系统状态，整合 `localStorage` 缓存偏好（如选中的壁纸、模糊度、字体类型）。
- **`AIChat.tsx`**：极度简炼的聊天对话组件，带有滚动保持、精美呼吸状态反馈（Typing Indicator）和优雅泡泡样式。
- **`Clock.tsx` / `Weather.tsx`**：提供贴心的当下时间感知和城市气象，极大增加页面的生机感。
- **`ControlCenter.tsx`**：主控全局滤镜（Filter Blur）、预设环境壁纸库、及精美字体样式（如时尚无衬线、冷峻等宽、温润宋体等书写感偏好）。

---

## 🚀 主流平台极简部署教程 (Deployment Guides)

本主页主要为**基于 Vite 编译的 React 静态单页应用 (SPA)**，也可作为全栈 Node.js 服务部署。在不启用动态生成服务器时，推荐将其部署到**纯静态托管服务**中（更省成本、零元免费免保固）。

以下提供四种最常见方案的超级部署教程：

---

### 一、 📦 Vercel 部署 (推荐 - 极简智能化)

[Vercel](https://vercel.com/) 是静态或 Serverless 项目的前沿托管平台，完美支持 Vite + React 架构。

#### 1. 自动关联部署 (最推荐)
1. 登录你的 [Vercel 官网](https://vercel.com/) 账号（可用 GitHub 直接快捷注册进入）。
2. 点击右上角 **"Add New"** -> **"Project"**。
3. 导入（Import）你提交在 GitHub 上的本项目代码仓库。
4. 在预置设置中，Vercel 会自动识别并选择 **Vite** 预设：
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. （可选）如果你在项目中使用了特定的环境变量（如 `GEMINI_API_KEY`），可以在 **Environment Variables** 栏中直接输入并添加。
6. 点击屏幕下方的 **"Deploy"**。等待约 30 秒至 1 分钟，便可获得一个漂亮的免费自定义二级域名和证书预览入口。

#### 2. 命令行部署 (CLI)
如果你更倾向于在本地终端快速一键发布，可以使用 NPM 标准 CLI：
```bash
# 全局安装 Vercel CLI
npm install -g vercel

# 在项目根目录下执行编译与发布
vercel
```
根据终端交互提示，连续回车（使用默认设置）即可完成托管上线。

---

### 二、 🌐 Cloudflare Pages 部署 (闪电般安全且完全免费)

[Cloudflare Pages](https://pages.cloudflare.com/) 依托 Cloudflare 强大的全球边缘网络提供无限流量、极佳加载速度的回源防御级免费托管。

#### 1. 使用 GitHub 自动化集成
1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)，在左侧菜单点击 **"Workers & Pages"** -> 选择 **"Pages"** 选项卡。
2. 点击 **"Create a project"** -> **"Connect to Git"**。
3. 选择关联你的 GitHub 账号，并指向该 Homepage 仓库。
4. 输入项目参数：
   - **Project Name**：你喜爱的自定义别称。
   - **Production Branch**：你的默认主分支（通常为 `main` 或 `master`）。
   - **Framework preset**：选择 **"Create React App"** 或自定义填入：
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
5. 点击下方 **"Save and Deploy"**。
6. 部署结束后，Cloudflare 会为你分配一个类似于 `yourpage.pages.dev` 的专属域名。

#### 2. 本地 CLI 直传发布 (无需绑定 GitHub)
若无需持续集成，只是将本地生成的 `dist` 文件夹快速上传：
```bash
# 执行本地打包
npm run build

# 使用 wrangler 快速推送
npx wrangler pages deploy dist
```

---

### 三、 💚 GitHub Pages 部署 (经典且完全免费)

如果你希望能保留你的所有源码，同时快速直接使用 GitHub 仓库本身提供的托管服务，[GitHub Pages](https://pages.github.com/) 绝对是经典而忠实的港湾。我们在此项目内已深度配套了 **GitHub Actions 自动化流水线（CI/CD）**，可以达到“一键提交，自动上线”的绝佳效果。

#### 1. 自动化 GitHub Actions 部署 (最推荐，免除一切手动操作)
我们在项目内新建了 `.github/workflows/deploy.yml` 自动化工作流。只需把项目代码推送到您 GitHub 的 `main` 或 `master` 分支，GitHub Actions 将会自动执行以下动作：
- 安全检出代码并自动缓存 Node.js 提升之后编译耗时。
- 执行 `npm run build` 正式进行无缝单页编译输出。
- 使用 `JamesIves/github-pages-deploy-action@v4` 一键将 `dist` 静态结果安全安全迁移、并持久更新存放到 `gh-pages` 分支中。

**配置指南（仅需一步）：**
1. 在您 GitHub 仓库的 **"Settings" -> "Actions" -> "General"**。
2. 往下拉找到 **"Workflow permissions"**，确保将其选择状态勾选为 **"Read and write permissions"**并保存（因为构建工具需要向 `gh-pages` 分支内写入编译所得的代码包）。
3. 随后，一旦有代码推送到主分支，便可以进入 **"Actions"** 选项卡查看实时编译滚动日志。
4. 编译成功后，进入 **"Settings" -> "Pages"**，确保 "Build and deployment" 下的 **"Branch"** 选项被配置为了 `gh-pages` 且保存，几分钟后便能在生成的链接内直接加载完美静态应用。

#### 2. 修改 `vite.config.ts` 中的 `base` 路径 (我们已贴心为您预设好)
假如您的 GitHub 仓库名叫做 `my-home-page`，且访问路径类似 `https://<YOUR_USER>.github.io/my-home-page/`。为了确保各种子地址或子路由解析不会错乱导致空白白块：
我们已经将 `vite.config.ts` 中的 `base` 选项预设为了相对路径：
```ts
// vite.config.ts
export default defineConfig({
  base: './', // 👈 采用相对路径相对解析，彻底规避静态资源由于二级目录路径、子项目环境导致的 404 白页
  // ...
});
```

#### 3. 利用 `gh-pages` 开发包进行手动一键指令部署 (本地手动极速部署)
   在终端下安装部署工具开发包：
   ```bash
   npm install gh-pages --save-dev
   ```

3. **在根目录 `package.json` 中添加快速编译脚本部署指引**：
   在 `"scripts"` 模块内加入新口令：
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **一键推送并开启 GitHub Pages 服务**：
   每次执行下述命令行，它就会自动将你的最新静态站点无感知推送到 `gh-pages` 独立静态分支：
   ```bash
   npm run deploy
   ```
   *注意：需要在您的 GitHub 仓库配置中 ("Settings" -> "Pages")，确保 "Build and deployment" Source 被选为 "Deploy from a branch"，并切换 Branch 为 `gh-pages`，并在几分钟后刷新即可查看完美成果。*

---

### 四、 ⚡ Netlify 部署 (敏捷快速)

[Netlify](https://www.netlify.com/) 提供了简单无比的拖拽上传与开箱即用的 SPA 404 重定向防丢失能力。

#### 1. 拖拽极简部署 (免注册绑定)
1. 在本地项目根目录运行下面命令获取静态资源包：
   ```bash
   npm run build
   ```
2. 登录并打开 [Netlify App 拖拽部署页面](https://app.netlify.com/drop)。
3. 直接拖入刚才生成在项目根目录中的 **`dist`** 文件夹。
4. 叮咚！无需任何配置，瞬间发布上线并提供 HTTPS 专属预览链接。

#### 2. Git 持续反馈部署
1. 注册并点击 Netlify 站点的 **"Add new site"** -> **"Import an existing project"**。
2. 关联对应 GitHub 仓库。
3. 设定 Build Settings 系统参数：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. 点击 **"Deploy site"** 完成自动部署。
5. （防白屏配置）在 `public` 文件夹下或输出的 `dist` 文件夹内，可放置一个名为 `_redirects` 的文件（包含规则：`/* /index.html 200`），完美解决 SPA 路由强刷导致的 404 问题。

---

## 🛠️ 本地开发运行指引 (Local Development)

若要进行二次开发、修改卡片信息、增加技能标签：

1. **环境准备**：
   确保您的电脑本地上已经安装了 [Node.js](https://nodejs.org/) (推荐 LTS 18+)。

2. **克隆项目 / 解压并进入根目录**：
   ```bash
   cd my-personal-homepage
   ```

3. **安装本地依赖项**：
   ```bash
   npm install
   ```

4. **启动本地开发联调服务器**：
   ```bash
   npm run dev
   ```
   开启后，在浏览器访问控制台显示的本地预览链路 `http://localhost:3000`（或随 Vite 运行实际提示的本地测试 IP 与端口）。

5. **编译与产物验证**：
   ```bash
   # 代码规范校验
   npm run lint
   
   # 正式打包输出（输出物会在项目根目录下的 dist/ 中）
   npm run build
   ```

---

*祝您使用愉快！如有疑问或创意想法，欢迎通过您的个人主页随时向主页 AI 服务管家进行提问联调！*
