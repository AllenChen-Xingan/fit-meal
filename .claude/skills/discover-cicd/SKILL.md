---
name: discover-cicd
description: 在处理 CI/CD 时自动发现 CI/CD 和自动化技能。针对 cicd 开发任务激活。
---

# Cicd 技能发现

提供对全面 cicd 技能的自动访问。

## 此技能何时激活

当您处理以下内容时，此技能会自动激活：
- CI/CD
- GitHub Actions
- GitLab CI
- 自动化
- 流水线
- 持续集成
- 部署自动化

## 可用技能

### 快速参考

Cicd 类别包含 4 个技能：

1. **cd-deployment-patterns**
2. **ci-optimization**
3. **ci-security**
4. **ci-testing-strategy**

### 加载完整类别详情

要获取完整描述和工作流程：

```bash
cat ~/.claude/skills/cicd/INDEX.md
```

这将加载完整的 Cicd 类别索引，包括：
- 详细的技能描述
- 每个技能的使用触发条件
- 常见工作流程组合
- 相关技能的交叉引用

### 加载特定技能

根据需要加载单个技能：

```bash
cat ~/.claude/skills/cicd/cd-deployment-patterns.md
cat ~/.claude/skills/cicd/ci-optimization.md
cat ~/.claude/skills/cicd/ci-security.md
cat ~/.claude/skills/cicd/ci-testing-strategy.md
```

## 渐进式加载

此网关技能启用渐进式加载：
- **级别 1**：网关自动加载（您现在就在这里）
- **级别 2**：加载类别 INDEX.md 以获取完整概览
- **级别 3**：根据需要加载特定技能

## 使用说明

1. **自动激活**：当 Claude Code 检测到 cicd 工作时，此技能会自动加载
2. **浏览技能**：运行 `cat ~/.claude/skills/cicd/INDEX.md` 以获取完整类别概览
3. **加载特定技能**：使用上述 bash 命令加载单个技能

---

**后续步骤**：运行 `cat ~/.claude/skills/cicd/INDEX.md` 查看完整类别详情。