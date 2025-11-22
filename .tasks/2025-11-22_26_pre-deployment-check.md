# 背景
文件名：2025-11-22_26
创建于：2025-11-22_18:00:00
创建者：胖虎
主分支：master
任务分支：task/deployment-prep_2025-11-22_26
Yolo模式：Off

# 任务描述
1.  **上线准备**：为 `instantpicgenerator.com` 部署做最后检查。
2.  **内容**：Base URL 替换、Sitemap 更新、JSON-LD 更新、环境变量确认。

# 项目概览
AI Polaroid Web App.

⚠️ 警告：永远不要修改此部分 ⚠️
[核心RIPER-5协议规则摘要]
... (同上)
⚠️ 警告：永远不要修改此部分 ⚠️

# 分析
-   将所有硬编码的 `vercel.app` URL 替换为生产域名。
-   确认 API Key 环境变量名。

# 提议的解决方案
1.  全局替换域名。
2.  检查 `route.ts`。

# 实施清单
1.  Layout/Sitemap/Robots/Page Update。
2.  Env Verification。

# 当前执行步骤："1-2. 全部完成"

# 任务进度
[2025-11-22_18:00:00]
- 行动：实施上线准备
- 状态：成功

# 最终审查
- Base URL 已更新。
- JSON-LD 已指向新域名。
- Sitemap 已更新。

