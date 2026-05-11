# 图表制作指南

> 图表是幻灯片"生动"的核心原因。  
> 原则：**能画图的地方不用文字列举，能做对比的地方不用孤立数字。**

---

## 一、何时必须作图

满足以下任一条件，**必须画图**，不能用纯文字替代：

| 场景 | 推荐图表类型 |
|------|------------|
| 展示数值大小对比（A vs B） | 水平进度条对比 / 柱状 SVG |
| 展示流程/步骤/pipeline | 横向流程图 SVG（节点+箭头） |
| 展示层级/包含关系 | 嵌套方框 SVG 或竖向树 |
| 展示比例/占比 | 进度条 + 数字（不建议饼图，太难读） |
| 展示时间线/演进 | 横向时间轴 SVG |
| 展示多维度对比（≥3个维度） | 对比表格（neon-table） |
| 展示单个关键数字 | stat-number 大字卡片 |
| 展示因果/决策路径 | 分支流程图 SVG |

**不需要画图**：
- 单点陈述（一句话能说清楚的）
- 纯定义解释（用 quote-block 即可）
- 步骤只有 2–3 步且无并行分支

---

## 二、图表类型与 HTML 实现

### 2.1 水平进度条对比（最常用）

**适用**：两组数值对比（传统 vs 新方法、before vs after）

```html
<div class="bar-compare">
  <!-- 组标题 -->
  <div style="font-size:clamp(10px,0.88vw,14px);color:var(--gray);font-weight:600;margin-bottom:0.3vh;">
    SWE-bench 成功率
  </div>
  <!-- 传统方法 -->
  <div style="display:flex;align-items:center;gap:0.5vw;font-size:clamp(10px,0.88vw,14px);">
    <span style="width:5vw;flex-shrink:0;text-align:right;color:var(--gray-dim);font-size:clamp(9px,0.8vw,13px);">传统</span>
    <div style="flex:1;height:9px;background:rgba(148,163,184,0.12);border-radius:5px;overflow:hidden;">
      <div style="width:20%;height:100%;border-radius:5px;
                  background:linear-gradient(90deg,rgba(220,38,38,0.7),rgba(220,38,38,0.4));"></div>
    </div>
    <span style="width:3vw;flex-shrink:0;font-weight:700;color:var(--neon-red);">20%</span>
  </div>
  <!-- 新方法 -->
  <div style="display:flex;align-items:center;gap:0.5vw;font-size:clamp(10px,0.88vw,14px);">
    <span style="width:5vw;flex-shrink:0;text-align:right;color:var(--gray-dim);font-size:clamp(9px,0.8vw,13px);">Agentic</span>
    <div style="flex:1;height:9px;background:rgba(148,163,184,0.12);border-radius:5px;overflow:hidden;">
      <div style="width:55%;height:100%;border-radius:5px;
                  background:linear-gradient(90deg,#059669,rgba(5,150,105,0.6));"></div>
    </div>
    <span style="width:3vw;flex-shrink:0;font-weight:700;color:var(--neon-green);">55%</span>
  </div>
</div>
```

**规则**：
- 红色（`rgba(220,38,38,…)`）表示旧/差，绿色（`#059669`）表示新/好
- `width` 百分比直接等于数值（55% 就写 `width:55%`）
- 每组内最多放 4–5 个比较项，超过就拆到下一页

---

### 2.2 横向流程图（SVG）

**适用**：3–6 步的线性流程，pipeline，架构概览

```html
<!-- 外层容器控制高度，viewBox 不动 -->
<div style="display:flex;align-items:center;justify-content:center;">
<svg viewBox="0 0 900 120" height="90" style="max-width:100%;">
  <!-- 节点1 -->
  <rect x="20" y="30" width="140" height="60" rx="10"
        fill="rgba(2,132,199,0.1)" stroke="#0284c7" stroke-width="1.5"/>
  <text x="90" y="57" text-anchor="middle" fill="#0284c7"
        font-size="13" font-weight="600">步骤一</text>
  <text x="90" y="75" text-anchor="middle" fill="#475569" font-size="11">说明文字</text>

  <!-- 箭头 -->
  <line x1="160" y1="60" x2="195" y2="60" stroke="#94a3b8" stroke-width="1.5"/>
  <polygon points="195,55 205,60 195,65" fill="#94a3b8"/>

  <!-- 节点2 -->
  <rect x="205" y="30" width="140" height="60" rx="10"
        fill="rgba(124,58,237,0.1)" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="275" y="57" text-anchor="middle" fill="#7c3aed"
        font-size="13" font-weight="600">步骤二</text>
  <text x="275" y="75" text-anchor="middle" fill="#475569" font-size="11">说明文字</text>

  <!-- 继续添加更多节点+箭头... -->
</svg>
</div>
```

**SVG 缩放规则**：
- `viewBox` 固定（坐标系），只改 `height` 来缩放渲染尺寸
- 节点间距保持均匀：`节点宽 140 + 间隔 65 = 下一节点起点 x`
- 颜色按语义：cyan=输入/数据，purple=模型/算法，green=输出/结果，gold=奖励/评估

---

### 2.3 大数字 Stat 卡片

**适用**：突出单个关键指标，页面顶部 4 宫格常用

```html
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1vw;">
  <div style="background:var(--bg-card);border-radius:8px;padding:1.2vh 1vw;
              border:1px solid rgba(2,132,199,0.18);text-align:center;">
    <div style="font-size:clamp(28px,3.2vw,62px);font-weight:800;line-height:1;"
         class="text-cyan">93%+</div>
    <div style="font-size:clamp(10px,0.88vw,15px);color:var(--gray);line-height:1.4;margin-top:0.3vh;">
      MATH500<br>数学推理
    </div>
  </div>
  <!-- 重复 3 次，颜色换为 text-green / text-gold / text-orange -->
</div>
```

**规则**：
- 数字颜色顺序建议：cyan → green → gold → orange（4个时）
- 数字下方必须有 2 行说明：指标名 + 上下文
- 4 个以上改为 3+1 或 2+2 布局

---

### 2.4 对比表（neon-table）

**适用**：≥3 个维度的系统性比较，"传统 vs Agentic" 类对比

```html
<div style="background:var(--bg-card);border-radius:8px;overflow:hidden;
            border:1px solid rgba(2,132,199,0.2);box-shadow:0 1px 4px rgba(0,0,0,0.06);">
  <table class="neon-table">
    <thead>
      <tr>
        <th>任务</th>
        <th>基准</th>
        <th>传统方法</th>  <!-- 红色系 -->
        <th>Agentic RL</th> <!-- 绿色系 -->
        <th>提升</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>数学推理</td>
        <td>MATH500</td>
        <td style="color:var(--neon-red);">71%</td>
        <td style="color:var(--neon-green);font-weight:700;">93%+</td>
        <td style="color:var(--neon-cyan);font-weight:600;">+22%</td>
      </tr>
    </tbody>
  </table>
</div>
```

**规则**：
- 旧/差数值用红色，新/好数值用绿色，提升幅度用 cyan
- 行数超过 6 行时考虑分页或只选最典型的 4–5 行
- 表格外层加 `border-radius` + `overflow:hidden` 圆角包裹

---

### 2.5 两栏图文混排

**适用**：左侧表格/数据，右侧可视化对比；或左侧说明，右侧 SVG 图

```html
<div style="display:grid;grid-template-columns:1.7fr 1fr;gap:1.2vw;">
  <!-- 左：表格或文字 -->
  <div class="table-wrap">...</div>

  <!-- 右：进度条可视化 -->
  <div style="background:var(--bg-card);border-radius:8px;padding:1vh 1.2vw;
              border:1px solid rgba(2,132,199,0.18);">
    <div style="font-size:clamp(11px,1vw,17px);font-weight:700;
                color:var(--neon-cyan);margin-bottom:0.7vh;">可视化标题</div>
    <!-- 进度条组... -->
  </div>
</div>
```

**比例参考**：
- `1.7fr 1fr`：左大右小，左边放信息密集内容
- `1fr 1fr`：等分，两侧信息量相当
- `1fr 2fr`：左边是标签/说明，右边是图表

---

## 三、配色原则

### 语义颜色约定（全局统一）

| 语义 | 颜色变量 | 使用场景 |
|------|---------|---------|
| 主题/当前/信息 | `--neon-cyan` | 标题强调、主流程节点、进度条 |
| 旧方法/问题/警告 | `--neon-red` | 传统方法数值、痛点描述 |
| 新方法/结果/成功 | `--neon-green` | 改进后数值、优点 |
| 奖励/评估/关键 | `--neon-gold` | 奖励信号、关键系数 |
| 模型/算法/核心 | `--neon-purple` | 算法名、模型框架 |
| 次要/补充 | `--neon-orange` | 第四维度、补充指标 |
| 深度/高级 | `--neon-blue` | 理论层、数学公式 |

### 同一页面最多使用 3–4 种颜色

如果超过 4 种，重新评估哪些元素需要强调，降低非核心元素的颜色饱和度（用 `var(--gray)` 替代）。

### 背景深浅对比

- 卡片背景 `#ffffff`，卡片 border 用 `rgba(颜色, 0.2–0.35)` 半透明
- 不要用纯色实心背景的卡片（如 `background:#0284c7`），视觉过重
- 需要强调某个卡片时，用 `box-shadow: var(--glow-cyan)` 而不是加深背景

---

## 四、排版原则

### 4.1 图文比例

| 页面类型 | 图/可视化占比 | 文字占比 |
|---------|------------|--------|
| 数据结果页 | 60–70% | 30–40% |
| 概念解释页 | 30–40% | 60–70% |
| 流程架构页 | 50–60% | 40–50% |
| 封面/结尾页 | 10% | 90%（大字） |

### 4.2 图表位置规则

- **顶部**：放 stat 大数字卡片（4宫格），快速建立锚点
- **中部左侧**：放最核心的数据表格或 SVG 流程图（`1.7fr`）
- **中部右侧**：放视觉化对比（进度条、柱图），强化左侧数据
- **底部**：放结论 quote-block，不放图表

### 4.3 间距规范

```css
/* 区块之间 */
.content { gap: 0.8vh–1.5vh }   /* 内容较多时用 0.8vh，宽松时用 1.5vh */

/* 卡片内部 */
padding: 1.2vh 1.2vw;  /* 密集卡片 */
padding: 1.8vh 2vw;    /* 标准卡片 */

/* 进度条组内 */
gap: 0.5vh;  /* 条目之间 */
margin-top: 0.3vh;  /* 组标题与第一条 */
```

### 4.4 防止溢出的检查

写完一页后，过以下问题：
- [ ] `content` 区域有 `overflow:hidden`（防止内容撑出页面）
- [ ] grid/flex 子项没有多余的 `flex:1`（只有 `.content` 本身需要）
- [ ] SVG 的 `height` 不超过可用高度（经验值：单独放 SVG 时 height≤180，两栏时 height≤140）
- [ ] 进度条的 `flex:1` 只加在 `.bar-track` 上，标签和数值用固定 width

---

## 五、快速决策树

```
需要展示内容时，问：

是否有数值可以对比？
  ├── 是 → 2个值：进度条对比 / 大字数字
  │        3+个值：neon-table 对比表
  └── 否 → 是否有步骤/流程？
              ├── 是 → 横向流程图 SVG
              └── 否 → 是否有多要点？
                          ├── ≤4点 → neon-card 网格（grid-2 / grid-4）
                          └── >4点 → 拆成两页，或用表格归纳
```

---

## 六、常见错误

| ❌ 错误 | ✅ 正确 |
|--------|--------|
| 用纯文字列出 5 个数字（"准确率分别为…"） | 画进度条，让差距可见 |
| SVG 改 viewBox 来缩放 | 只改 `height`，viewBox 不动 |
| 4 个 stat 卡片都用同一颜色 | cyan / green / gold / orange 各一种 |
| 进度条宽度写死（如 `width:180px`） | 用百分比（`width:55%`）对应实际数值 |
| 两栏布局的右侧卡片加 `flex:1` | 右侧卡片只需 `background+padding`，不加 flex |
| 表格每行都加颜色注释 | 只对"旧值/新值/提升"三列加颜色，其他列保持默认 |
