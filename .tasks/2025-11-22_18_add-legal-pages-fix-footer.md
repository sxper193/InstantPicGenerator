# 背景
文件名：2025-11-22_18
创建于：2025-11-22_15:00:00
创建者：胖虎
主分支：master
任务分支：task/add-legal-pages_2025-11-22_18
Yolo模式：Off

# 任务描述
1.  **Footer 固定**：用户希望 Footer 贴在浏览器底部（Fixed）。
2.  **Copyright 修改**：更改为 "© 2025. Powered by AI Polaroid"。
3.  **法律页面**：生成隐私政策（Privacy Policy）和用户协议（Terms of Service）。

# 项目概览
AI Polaroid Web App.

⚠️ 警告：永远不要修改此部分 ⚠️
[核心RIPER-5协议规则摘要]
... (同上)
⚠️ 警告：永远不要修改此部分 ⚠️

# 分析
-   Footer 需要 `fixed bottom-0` 样式，同时 Body 需要 padding-bottom 防止遮挡。
-   新建 `/privacy` 和 `/terms` 页面，内容需严谨，声明不存图策略。
-   Copyright 文案需更新。

# 提议的解决方案
1.  修改 `src/components/footer.tsx`。
2.  修改 `src/app/layout.tsx`。
3.  创建 `src/app/privacy/page.tsx`。
4.  创建 `src/app/terms/page.tsx`。
5.  更新 `src/app/sitemap.ts`。

# 实施清单
1.  Footer 样式调整 (Fixed)。
2.  Body Padding 调整。
3.  新建 Privacy Page。
4.  新建 Terms Page。
5.  更新 Sitemap。

# 当前执行步骤："1-5. 全部完成"

# 任务进度
[2025-11-22_15:00:00]
- 行动：实施上述所有更改
- 状态：成功

# 最终审查
- Footer 现已固定在底部。
- 文案已更新。
- 法律页面已上线且链接正确。

