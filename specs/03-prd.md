# FitMeal - 产品需求文档 (Affordance-Driven)

<meta>
  <document-id>fitmeal-prd</document-id>
  <version>1.0.0</version>
  <project>FitMeal 健身饮食助手</project>
  <type>Product Requirements Document</type>
  <created>2026-01-14</created>
  <depends>real.md, cog.md</depends>
</meta>

---

## 1. 产品环境

**名称：** FitMeal 健身饮食助手

**Tagline：** 一个让你快速知道该吃什么、然后跟着做出来的环境

**版本：** 1.0.0

**环境描述：**
FitMeal 是一个面向健身者和饮食管理者的行动空间。用户在这里可以：输入当前情境（刚运动完？很忙？有时间？）→ 获得个性化饮食推荐 → 跟着真实食谱一步步做出来。核心价值是**消除"吃什么"的决策焦虑**，让用户把精力放在执行而非思考。

**主要代理人：**
- **用户（Human Agent）**：健身者/饮食管理者，主要是烹饪新手，需要详细步骤指导
- **AI 助手（AI Agent）**：根据运动记录和饮食历史生成个性化推荐

**核心 Affordance：**
1. **询问 Affordance** - 告诉系统"我现在的情况是..."
2. **推荐 Affordance** - 获取"你应该吃..."的答案
3. **食谱 Affordance** - 查看"怎么做..."的详细步骤
4. **记录 Affordance** - 记录运动和饮食历史
5. **库存 Affordance** - 管理预制菜库存

---

## 2. MAS (Minimum Affordance Story) 定义

### MAS-1: 快速知道该吃什么

**Story Theme:**
用户在任何情境下，5秒内获得"该吃什么"的答案

**Core Affordance Sequence:**
```
[情境输入] → [AI分析] → [推荐展示] → [决策完成]
```

1. **情境输入 Affordance**：用户选择/说出当前状态
   - perceive: 情境卡片（"刚练完" / "很忙" / "有时间" / "朋友来了"）
   - action: 点击或语音输入

2. **推荐展示 Affordance**：系统展示饮食建议
   - perceive: 推荐卡片（菜品名 + 营养概览 + 预计时间）
   - action: 浏览、选择

3. **决策确认 Affordance**：用户确认选择
   - perceive: "就吃这个"按钮
   - action: 点击确认，进入食谱

**Meaning Closure:**
用户从"不知道吃什么"的焦虑状态，转变为"知道该吃什么"的确定状态。决策焦虑被消除。

**Intrinsic Motivation:**
- Interest: 看到符合自己情况的个性化推荐
- Autonomy: 可以接受推荐，也可以换一个
- Mastery: 系统越用越懂用户口味

**Out of Scope:**
- 详细食谱步骤（属于 MAS-2）
- 运动记录（属于 MAS-4）
- 预制菜库存管理（属于 MAS-3）

---

### MAS-2: 跟着食谱做出来

**Story Theme:**
烹饪新手也能跟着真实食谱，一步步做出推荐的菜品

**Core Affordance Sequence:**
```
[选择菜品] → [查看食谱] → [逐步执行] → [完成制作]
```

1. **食谱入口 Affordance**：从推荐进入食谱
   - perceive: "查看做法"按钮
   - action: 点击进入食谱详情

2. **食材清单 Affordance**：查看需要准备什么
   - perceive: 食材列表（名称 + 用量 + 可选购买链接）
   - action: 勾选已有食材，生成购物清单

3. **步骤导航 Affordance**：逐步跟着做
   - perceive: 分步骤卡片（图片 + 文字说明 + 预计时间）
   - action: "下一步" / "上一步" 导航

4. **完成记录 Affordance**：标记完成
   - perceive: "做完了"按钮
   - action: 点击记录这餐

**Meaning Closure:**
用户从"不会做"到"做出来了"。食物从抽象的建议变成真实的一餐。

**Intrinsic Motivation:**
- Interest: 跟着图文步骤像玩游戏闯关
- Mastery: 每做完一道菜，烹饪技能提升
- Autonomy: 可以调整用量、替换食材

**Constraints (from real.md):**
- 食谱必须来自真实来源（下厨房/美食杰/API），标注出处
- 禁止 AI 编造食谱步骤

**Story Dependencies:**
- Requires: MAS-1（需要先有推荐）
- Enables: MAS-3（做完可以存入预制菜库存）

---

### MAS-3: 预制菜批量备餐

**Story Theme:**
周末批量制作，工作日加热即食，解决"很忙没时间做饭"的问题

**Core Affordance Sequence:**
```
[选择备餐模式] → [获取批量食谱] → [制作并记录] → [工作日消费库存]
```

1. **备餐模式 Affordance**：进入批量备餐场景
   - perceive: "周末备餐"情境卡片
   - action: 选择进入备餐推荐

2. **批量食谱 Affordance**：获取适合预制的食谱
   - perceive: 预制友好食谱列表（标注保质期、份数建议）
   - action: 选择要做的菜品

3. **采购清单 Affordance**：生成购物清单
   - perceive: 合并后的食材清单（按超市分区排序）
   - action: 导出/分享清单

4. **库存记录 Affordance**：记录做好的预制菜
   - perceive: "存入冰箱"按钮
   - action: 记录菜品、份数、制作日期

5. **库存消费 Affordance**：工作日查看库存
   - perceive: 冰箱库存列表（菜品 + 剩余份数 + 保质期倒计时）
   - action: "今天吃这个"消费一份

6. **过期提醒 Affordance**：提醒即将过期
   - perceive: 红色警示标签
   - action: 查看即将过期的预制菜

**Meaning Closure:**
用户从"工作日没时间做饭"到"冰箱里有现成的健康餐"。预制菜模式让健康饮食变得可持续。

**Intrinsic Motivation:**
- Interest: 看到满满的冰箱库存很有成就感
- Mastery: 学会高效批量备餐的技能
- Autonomy: 自己决定做什么、做多少

**Out of Scope:**
- 外卖推荐（用户明确不要）
- 餐厅推荐（用户明确不要）

---

### MAS-4: 记录运动获取个性化推荐

**Story Theme:**
记录运动数据，让 AI 更懂你，推荐更精准

**Core Affordance Sequence:**
```
[记录运动] → [系统学习] → [个性化推荐]
```

1. **运动记录 Affordance**：记录今天的运动
   - perceive: "记录运动"入口
   - action: 选择运动类型、强度、部位、时长

2. **运动历史 Affordance**：查看运动记录
   - perceive: 日历/列表视图
   - action: 浏览历史记录

3. **个性化感知 Affordance**：感知推荐变化
   - perceive: 推荐理由说明（"因为你今天练了腿，建议补充..."）
   - action: 理解 AI 的推荐逻辑

**Meaning Closure:**
用户感知到系统"懂我"，推荐不是随机的而是基于自己的运动情况。

**Story Dependencies:**
- Enables: MAS-1（运动数据让推荐更精准）

---

## 3. Affordance 详细规格

### 3.1 Primary Affordances（必须立即可感知）

| Affordance ID | 名称 | 启用的行动 | Human 感知 | AI 感知 |
|---------------|------|-----------|-----------|---------|
| AFF-P1 | 情境选择 | 告诉系统当前状态 | 情境卡片按钮 | `data-context` 属性 |
| AFF-P2 | 推荐浏览 | 查看饮食建议 | 推荐卡片列表 | `role="listitem"` |
| AFF-P3 | 食谱查看 | 查看详细做法 | "查看做法"按钮 | `data-action="view-recipe"` |
| AFF-P4 | 步骤导航 | 逐步跟着做 | 上一步/下一步按钮 | `aria-controls` |

### 3.2 Secondary Affordances（交互后显现）

| Affordance ID | 名称 | 启用的行动 | 触发条件 |
|---------------|------|-----------|---------|
| AFF-S1 | 换一个推荐 | 不喜欢当前推荐 | 在推荐页面 |
| AFF-S2 | 调整份量 | 修改食材用量 | 在食谱页面 |
| AFF-S3 | 生成购物清单 | 导出食材清单 | 在食谱页面 |
| AFF-S4 | 标记完成 | 记录这一餐 | 完成最后一步 |

### 3.3 Latent Affordances（探索后发现）

| Affordance ID | 名称 | 启用的行动 | 发现方式 |
|---------------|------|-----------|---------|
| AFF-L1 | 数据导出 | 导出个人数据 | 设置页面 |
| AFF-L2 | 账号删除 | 删除所有数据 | 设置页面 |
| AFF-L3 | 食谱收藏 | 收藏喜欢的食谱 | 食谱详情页 |

---

## 4. 环境约束 (from real.md)

### 4.1 安全约束

| 约束 | Affordance 影响 |
|------|----------------|
| 健康数据加密存储 | 运动/饮食记录使用加密字段 |
| 仅用户本人可访问 | 无分享/公开 affordance |
| 用户可导出/删除数据 | AFF-L1, AFF-L2 必须实现 |

### 4.2 内容约束

| 约束 | Affordance 影响 |
|------|----------------|
| 食谱来自真实来源 | 食谱卡片必须显示来源链接 |
| 禁止 AI 编造 | 推荐只能关联已有食谱 |
| 饮食建议免责 | 所有推荐页面显示免责声明 |

### 4.3 技术约束

| 约束 | Affordance 影响 |
|------|----------------|
| Next.js + React | 前端组件化实现 |
| Neon PostgreSQL | 数据持久化 |
| EdgeOne Pages | 部署环境 |

---

## 5. 感知通道

### 5.1 Human 感知通道

| 元素 | 感知到的行动 | 设计模式 |
|------|-------------|---------|
| 情境卡片 | 可选择 | 大按钮、图标、简短文字 |
| 推荐卡片 | 可浏览、可选择 | 图片、菜名、营养标签 |
| 步骤卡片 | 可跟随 | 序号、图片、文字、时间 |
| 进度条 | 可感知进度 | 当前步骤/总步骤 |

### 5.2 AI 感知通道

| 元素 | 语义标记 | 感知到的行动 |
|------|---------|-------------|
| 情境按钮 | `data-context="workout"` | 可点击选择情境 |
| 推荐卡片 | `role="article"`, `aria-label` | 可识别推荐内容 |
| 步骤导航 | `aria-controls`, `aria-current` | 可导航步骤 |

---

## 6. 反馈机制

### 6.1 即时反馈 (< 100ms)

| 行动 | Human 反馈 | AI 反馈 |
|------|-----------|---------|
| 点击情境卡片 | 卡片高亮 | `aria-selected="true"` |
| 点击下一步 | 步骤切换动画 | DOM 更新 |

### 6.2 过程反馈 (< 1s)

| 行动 | Human 反馈 | AI 反馈 |
|------|-----------|---------|
| 请求推荐 | 加载骨架屏 | `aria-busy="true"` |
| 保存记录 | "保存中..." | 状态变化 |

### 6.3 完成反馈 (< 5s)

| 行动 | Human 反馈 | AI 反馈 |
|------|-----------|---------|
| 推荐生成完成 | 推荐卡片出现 | 数据返回 |
| 记录保存完成 | "已保存"提示 | 状态确认 |
| 食谱完成 | 庆祝动画 | 状态更新 |

---

## 7. Affordance 验收标准

### MAS-1: 快速知道该吃什么

| ID | 标准 | Human 测试 | AI 测试 |
|----|------|-----------|---------|
| AC-1.1 | 情境卡片可见 | 首页看到 4 个情境选项 | `data-context` 属性存在 |
| AC-1.2 | 推荐在 3s 内展示 | 选择情境后快速看到推荐 | API 响应 < 3000ms |
| AC-1.3 | 推荐包含免责声明 | 页面底部有声明文字 | 声明元素存在 |

### MAS-2: 跟着食谱做出来

| ID | 标准 | Human 测试 | AI 测试 |
|----|------|-----------|---------|
| AC-2.1 | 食谱来源可见 | 看到"来自下厨房"链接 | 来源链接有效 |
| AC-2.2 | 步骤可导航 | 上一步/下一步可用 | 导航按钮可点击 |
| AC-2.3 | 食材清单完整 | 所有食材有名称和用量 | 数据结构完整 |

### MAS-3: 预制菜批量备餐

| ID | 标准 | Human 测试 | AI 测试 |
|----|------|-----------|---------|
| AC-3.1 | 库存可记录 | 可添加预制菜到库存 | 数据持久化 |
| AC-3.2 | 保质期可见 | 每个预制菜显示剩余天数 | 日期计算正确 |
| AC-3.3 | 过期提醒有效 | 即将过期的菜品有红色标记 | 提醒逻辑正确 |

---

## 8. Non-Affordances（明确不支持的行动）

| 行动 | 不支持原因 |
|------|-----------|
| 推荐外卖 | 用户明确不需要，坚持自己做 |
| 推荐餐厅 | 用户明确不需要，坚持自己做 |
| AI 生成食谱 | 违反 real.md 约束，食谱必须来自真实来源 |
| 社交分享 | MVP 不需要，保持简单 |
| 多用户协作 | MVP 不需要，单用户使用 |

---

## 9. 技术实现概要

### 9.1 前端 Affordance 渲染

```
/app
  /(main)
    /page.tsx          # 首页 - 情境选择 affordance
    /recommend/page.tsx # 推荐页 - 推荐浏览 affordance
    /recipe/[id]/page.tsx # 食谱页 - 步骤导航 affordance
    /meal-prep/page.tsx   # 备餐页 - 库存管理 affordance
    /workout/page.tsx     # 运动页 - 记录 affordance
```

### 9.2 后端 Affordance 支持

| API | 支持的 Affordance |
|-----|------------------|
| `POST /api/recommend` | 情境输入 → 推荐生成 |
| `GET /api/recipes/:id` | 食谱查看 |
| `POST /api/meals` | 饮食记录 |
| `POST /api/workouts` | 运动记录 |
| `GET/POST /api/inventory` | 预制菜库存管理 |

### 9.3 数据模型

```
User → Workout (1:N)
User → Meal (1:N)
User → Inventory (1:N)
Meal → Recipe (N:1)
Recipe → Food (N:N)
```

---

## 10. 质量检查清单

- [x] 核心 affordance 已定义
- [x] 每个 affordance 指明启用的行动
- [x] Human 和 AI 感知通道已定义
- [x] 反馈机制覆盖感知-行动闭环
- [x] 环境约束来自 real.md
- [x] 验收标准可测试
- [x] Non-affordance 明确列出
- [x] MAS 故事完整且有意义闭环

---

## 附录

### A. 与 cog.md 实体映射

| cog.md 实体 | PRD Affordance |
|-------------|---------------|
| user | 所有 affordance 的代理人 |
| workout | MAS-4 运动记录 |
| meal | MAS-2 完成记录、MAS-3 库存 |
| food | 食材清单 affordance |
| recipe | MAS-2 食谱 affordance |
| recommendation | MAS-1 推荐 affordance |

### B. 术语表

| 术语 | 定义 |
|------|------|
| Affordance | 环境提供给代理人的行动可能性 |
| MAS | Minimum Affordance Story，最小完整故事 |
| 预制菜 | 提前批量制作、冷藏/冷冻保存的菜品 |
| 情境 | 用户当前状态（刚运动完、很忙、有时间等） |
