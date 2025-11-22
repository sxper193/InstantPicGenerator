# 背景
文件名：2025-11-22_10
创建于：2025-11-22_12:25:00
创建者：胖虎
主分支：master
任务分支：task/fix-duplicate-generation-robust_2025-11-22_10
Yolo模式：Off

# 任务描述
修复结果页生成两张 AI 图的 Bug。之前的 `useRef` 修复在 Strict Mode 下可能不够稳健，导致 API 仍被调用两次。

# 项目概览
AI Polaroid Web App.

⚠️ 警告：永远不要修改此部分 ⚠️
[核心RIPER-5协议规则摘要]
... (同上)
⚠️ 警告：永远不要修改此部分 ⚠️

# 分析
-   **问题**：React Strict Mode 会卸载并重新挂载组件，导致 `useRef` 重置，从而触发两次 `useEffect`。
-   **修复**：使用模块级（Global）变量 `processedFiles` (Set) 来跟踪当前正在处理的文件。该变量在组件卸载后仍然存在（只要页面不刷新），能有效阻止第二次挂载时的重复调用。

# 提议的解决方案
在 `src/app/result/page.tsx` 中引入全局 `processedFiles` Set，并移除 `useRef`。

# 当前执行步骤："1. 实施更改"

# 任务进度
[2025-11-22_12:25:00]
- 行动：创建任务文件
- 状态：成功

# 最终审查
Pending

