# 背景
文件名：2025-11-22_19
创建于：2025-11-22_15:15:00
创建者：胖虎
主分支：master
任务分支：task/header-legal-links_2025-11-22_19
Yolo模式：Off

# 任务描述
1.  **顶部导航补充**：用户指出顶部缺少 Privacy 和 Terms 链接。
2.  **需求**：在首页和结果页的顶部 Header 中添加这两个链接。

# 项目概览
AI Polaroid Web App.

⚠️ 警告：永远不要修改此部分 ⚠️
[核心RIPER-5协议规则摘要]
... (同上)
⚠️ 警告：永远不要修改此部分 ⚠️

# 分析
-   除了底部 Footer，Header 也需要完整的法律页面入口。
-   需要修改 `src/app/page.tsx` 和 `src/app/result/page.tsx`。

# 提议的解决方案
1.  在 `src/app/page.tsx` 的 `<nav>` 中添加 `<Link href="/privacy">` 和 `<Link href="/terms">`。
2.  在 `src/app/result/page.tsx` 做同样修改。

# 实施清单
1.  修改首页 Header。
2.  修改结果页 Header。

# 当前执行步骤："1-2. 全部完成"

# 任务进度
[2025-11-22_15:15:00]
- 行动：添加链接
- 状态：成功

# 最终审查
- 顶部现在包含 About, FAQ, Privacy, Terms 四个链接。

