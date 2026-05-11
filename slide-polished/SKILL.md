---
name: slide
description: 将Markdown大纲文档转换为HTML幻灯片演示系统。当用户要求制作幻灯片、PPT、演示文稿，或说"帮我做个PPT"、"生成幻灯片"时使用。
---

# 幻灯片制作技能

将Markdown大纲文档转换为精美的HTML幻灯片演示系统，支持16:9画幅、键盘翻页、全屏展示、动画效果。

> **支持文件**（均在 `resource/silde-making/` 目录下，制作前请先阅读）：
> - `guides/chart-guide.md` — 图表制作指南（何时作图、HTML 实现、配色排版）
> - `guides/content-guide.md` — 内容创作指南（叙事弧、双层表达、口语化规范）
> - `templates/` — 亮色主题模板（style.css / main.js / cover / content / end）
> - `templates/dark/` — 暗色主题模板（style.css 覆盖文件 + cover / content / end）

---

## 设计系统：双主题

本技能内置两套已验证的设计系统。**默认使用亮色**，无需询问；用户主动要求"暗色/深色/黑色"时切换。

### 亮色 Light-Tech（默认）

参考项目：`resource/silde-making/` 下的完整演示  
CSS 源文件：`templates/style.css`

| 要素 | 值 |
|------|---|
| 背景 | `#f0f4f8`（浅蓝灰渐变） |
| 卡片 | `#ffffff` 白底 + 颜色边框/阴影 |
| 主文字 | `#1e293b` |
| 封面/结尾页 | `linear-gradient(135deg,#f0f4f8 0%,#e0f2fe 50%,#f0f4f8 100%)` + 三圆圈装饰 |
| 强调色 | neon-cyan `#0284c7` / neon-blue `#2563eb` / neon-purple / neon-red / neon-gold / neon-green |

### 暗色 Dark Neon

参考项目：`resource/silde-final/`（已打磨半个月的最佳实践，内容表达优于亮色版）  
CSS 源文件：`templates/dark/style.css`（覆盖亮色变量）

| 要素 | 值 |
|------|---|
| 背景 | `#000000` 纯黑 + 青色 60×60 网格底纹 |
| 卡片 | `rgba(10,15,30,0.85)` 深半透明 + 霓虹 box-shadow 发光 |
| 文字 | `#ffffff` / 60% 透明白 |
| 封面 | 双椭圆径向渐变（青色+紫色）+ 四角装饰线框 |
| 结尾 | 三色渐变文字（Thank You 或 谢谢大家） |
| 特有优势 | text-shadow 发光、border 内嵌高光、pyramid 层级布局 |

---

## 执行流程

### Phase 0：主动查阅支持文件

在开始制作之前，**必须先阅读**：
1. `guides/content-guide.md` — 了解内容表达要求
2. `guides/chart-guide.md` — 了解图表决策规则
3. 对应主题的 `templates/` 目录模板文件

### Phase 1：内容分析（规划页面，输出验收表）

1. 读取大纲文件，若为空则停止并提示
2. 规划页面数量（建议 10–20 页）：封面 1 页、内容章节每章 1–3 页、结束 1 页
3. 确定每页布局类型（见下方"页面类型"）
4. 对**每个章节**判断：需要什么图表？（参考 chart-guide.md 决策树）
5. 如需引用数字/方法名但不确定——**此时联网搜索**，不要等到写页面时才发现数据缺失
6. 输出规划表（页码 | 文件名 | 标题 | 布局 | 图表类型）

### Phase 2：目录结构

在大纲文件所在目录创建：

```
{项目目录}/
├── index.html
├── css/style.css
├── js/main.js
└── slides/
    ├── 00-cover.html
    ├── 01-xxx.html
    └── ...
```

### Phase 3：生成 CSS

直接复制 `templates/style.css` 内容到 `css/style.css`。  
暗色主题：复制 `templates/style.css` 后，再将 `templates/dark/style.css` 的变量覆盖块追加到末尾。

### Phase 4：生成 JS

直接复制 `templates/main.js`，填入：
- `this.totalSlides = N;`（实际总页数）
- `this.slideNames = [...]`（按顺序填文件名，不含 `.html`）
- `this.slideTitles = [...]`（目录显示标题）

### Phase 5：生成 HTML 页面

**每页写完后，对照以下两个清单检查，再写下一页：**

#### 布局防溢出检查
- [ ] `.content` 有 `overflow:hidden`，grid/flex 子项不额外加 `flex:1`
- [ ] SVG `height` 不超过经验值：单 SVG ≤ 180，两栏内 ≤ 140
- [ ] 封面标题加 `white-space:nowrap`

#### 内容质量检查（详见 content-guide.md）
- [ ] 这页核心洞见一句话能说出来
- [ ] 专业名词有直觉类比
- [ ] 数字有对比基准 + 来源
- [ ] 正文口语化（大声读出来不像背课文）
- [ ] 不确定的数据已联网核实

---

## 页面类型与布局

| 类型 | 适用场景 | 布局建议 |
|------|---------|---------|
| 封面页 | 第 1 页 | 居中大字 + badge + 装饰（圆圈/角框） |
| 数据页 | 表格 + 图表 | 左侧 neon-table + 右侧进度条/stat（`1.7fr 1fr`） |
| 流程页 | 步骤/pipeline | 左 SVG 流程图 + 中文字卡 + 右代码（三栏） |
| 全景架构页 | 系统全貌 | 5–6 列精细网格（`1.1fr 1fr 1.1fr 1.1fr 0.9fr`）|
| 层级页 | 6 层/金字塔 | pyramid 布局（左宽度递减 + 右说明卡片） |
| 卡片网格页 | 多要点 | `grid-2` / `grid-3` / `grid-4` neon-card |
| 对比页 | 两个概念 | `1fr 1fr` + 中间 VS 分割列 |
| 结束页 | 最后 1 页 | 居中大字（亮色：谢谢大家；暗色：Thank You 渐变） |

---

## 图表使用原则（详见 chart-guide.md）

**决策树快速记忆**：

```
有数值可对比？
  ├── 2个值 → 进度条对比 或 stat 大数字
  └── 3+个值 → neon-table 对比表

有步骤/流程？
  └── 横向或竖向 SVG 流程图（3–6 节点）

有多要点？
  ├── ≤4点 → neon-card 网格
  └── >4点 → 拆成两页，或表格归纳
```

**SVG 唯一规则**：只改 `height`，`viewBox` 永远不动。

---

## 字体大小参考

| 元素 | clamp() |
|------|---------|
| 封面主标题 | `clamp(36px, 4.8vw, 96px)` + `white-space:nowrap` |
| 暗色封面大字 | `clamp(36px, 5.5vw, 72px)` |
| 结束页大字 | `clamp(48px, 6vw, 96px)` |
| 页面标题 | `clamp(30px, 3.4vw, 76px)` |
| 卡片标题 | `clamp(13px, 1.4vw, 24px)` |
| 正文 | `clamp(13px, 1.25vw, 23px)` |
| 小注/标签 | `clamp(10px, 0.85vw, 15px)` |

---

## 质量检查（完成后统一过一遍）

- [ ] 所有页面 16:9，无滚动条
- [ ] `js/main.js` 的 `totalSlides`、`slideNames`、`slideTitles` 总数三处一致
- [ ] `index.html` 目录头"共 N 页"与实际总数一致
- [ ] 每页 `page-indicator` 分母与总页数一致
- [ ] 封面/结尾页视觉风格与内容页区分（用装饰背景）
- [ ] 键盘翻页、TOC 目录、全屏均可正常使用

---

## 完成后输出格式

```markdown
## 幻灯片已创建完成

### 文件结构
{目录树}

### 操作方式
| 功能 | 操作 |
|------|------|
| 翻页 | ← → / 点击左右半屏 |
| 目录 | T 键 或 ☰ 按钮 |
| 全屏 | F 键 |
| 快捷键帮助 | ? 键 |

### 设计说明
- 风格：{Light-Tech 亮色 / Dark Neon 暗色} 科技风
- 页数：{N} 页（含封面 + 结束页）

### 打开方式
用浏览器直接打开 `index.html`
```
