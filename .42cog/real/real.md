# FitMeal - 现实约束文档

<meta>
  <document-id>fitmeal-real</document-id>
  <version>1.0.0</version>
  <project>FitMeal 健身饮食助手</project>
  <type>Reality Constraints</type>
  <created>2026-01-14</created>
</meta>

## 文档目的

定义 FitMeal 健身饮食助手的核心现实约束，确保 AI 在开发过程中不会违反关键安全、隐私和业务规则。

---

<real>
- 用户健康数据（体重、运动记录、饮食记录）必须加密存储，仅用户本人可访问
- 饮食建议必须标注"仅供参考"，不能声称具有医疗效果或替代专业营养师建议
- 食谱必须来自可验证的真实来源（爬虫抓取或食谱数据库API），禁止AI自行编造食谱步骤
- 用户可随时导出和删除个人全部数据
</real>

---

## 技术环境

<environment>
<stack>
  - 前端：Next.js + React + TypeScript
  - 状态管理：Zustand
  - 数据库：Neon PostgreSQL + Drizzle ORM
  - 部署：EdgeOne Pages
</stack>
</environment>

---

## 约束检查清单

- [ ] 健康数据加密存储已实现
- [ ] 所有饮食建议页面包含免责声明
- [ ] 食谱数据来源已接入（爬虫/API）并标注出处
- [ ] 用户数据导出/删除功能已实现
