# Mission Control - OpenClaw Workforce Manager

## 🎯 项目目标
复刻 @pbteja1998 的 Agent Workforce 系统，让多个 OpenClaw agents 能够协作、沟通、自主分配任务。

## 📐 核心架构

```
┌─────────────────────────────────────────────────────────┐
│                   Mission Control (Web UI)               │
├─────────────┬─────────────┬─────────────┬───────────────┤
│   Kanban    │   Agent     │   Chat      │   Activity    │
│   Board     │   Roster    │   Room      │   Feed        │
└──────┬──────┴──────┬──────┴──────┬──────┴───────┬───────┘
       │             │             │              │
       └─────────────┴──────┬──────┴──────────────┘
                            │
                    ┌───────▼───────┐
                    │   API Server   │
                    │   (Next.js)    │
                    └───────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
        ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
        │  Jarvis   │ │  Agent 2  │ │  Agent N  │
        │  (Main)   │ │  (Expert) │ │  (Expert) │
        └───────────┘ └───────────┘ └───────────┘
              ↑             ↑             ↑
              └─────────────┴─────────────┘
                    OpenClaw Gateway
```

## 🧩 核心组件

### 1. Web Dashboard (Mission Control)
- **技术栈**: Next.js 14 + TypeScript + Tailwind + Shadcn/UI
- **功能**:
  - Kanban 任务板 (待办/进行中/完成)
  - Agent 花名册和状态
  - 实时聊天室 (Agent 之间 + 人类参与)
  - Activity Feed (所有活动流)
  - 人类可以 @mention agent、发公告

### 2. Backend API
- **技术栈**: Next.js API Routes + Supabase
- **数据模型**:
  - `agents` - Agent 档案 (名称、角色、状态)
  - `tasks` - 任务卡片 (标题、描述、状态、负责人)
  - `messages` - 聊天消息
  - `activities` - 活动日志
  - `comments` - 任务评论

### 3. Agent Integration Layer
- **与 OpenClaw 集成**:
  - Webhook 接收 Agent 更新
  - API 让 Agent 读取/更新任务
  - Cron job 每 15 分钟触发 Agent 扫描

### 4. Agent Behavior (OpenClaw Skill)
- **SKILL.md** 定义 Agent 如何:
  - 登录 Mission Control
  - 查看分配的任务
  - 更新任务进度
  - 在聊天室发言
  - 扫描其他任务并提供见解

## 📋 实施阶段

### Phase 1: 基础设施 (Day 1-2)
- [ ] 项目初始化 (Next.js + Supabase)
- [ ] 数据库 Schema 设计
- [ ] 基础 UI 框架
- [ ] Agent API 认证

### Phase 2: Kanban 板 (Day 3-4)
- [ ] 任务 CRUD
- [ ] 拖拽排序
- [ ] 任务详情弹窗
- [ ] Agent 分配

### Phase 3: Agent 花名册 (Day 5)
- [ ] Agent 注册/配置
- [ ] 状态显示 (在线/离线/忙碌)
- [ ] 角色和能力标签

### Phase 4: 聊天室 (Day 6-7)
- [ ] 实时消息 (Supabase Realtime)
- [ ] @mention 支持
- [ ] Agent 可以发消息

### Phase 5: OpenClaw 集成 (Day 8-10)
- [ ] 创建 mission-control Skill
- [ ] Webhook 接收 Agent 更新
- [ ] 定时扫描任务
- [ ] 测试多 Agent 协作

## 🔧 技术选型

| 组件 | 技术 | 理由 |
|------|------|------|
| Frontend | Next.js 14 | SSR + API Routes 一体化 |
| Styling | Tailwind + Shadcn/UI | 快速漂亮的 UI |
| Database | Supabase | Realtime + Auth + 免费 |
| Hosting | Cloudflare Pages | 与现有项目一致 |
| Agent API | REST + Webhook | 简单可靠 |

## 🔐 安全设计

- Agent 通过 API Key 认证
- 任务只能被分配的 Agent 更新
- 聊天室消息审计
- 人类可以随时介入/撤销

## 📁 项目结构

```
mission-control/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard pages
│   │   ├── page.tsx       # Home/Overview
│   │   ├── tasks/         # Kanban board
│   │   ├── agents/        # Agent roster
│   │   ├── chat/          # Chat room
│   │   └── activity/      # Activity feed
│   └── api/               # API Routes
│       ├── agents/        # Agent CRUD
│       ├── tasks/         # Task CRUD
│       ├── messages/      # Chat messages
│       └── webhook/       # OpenClaw webhook
├── components/            # React components
├── lib/                   # Utilities
├── supabase/              # DB migrations
└── skills/                # OpenClaw skill
    └── mission-control/
        └── SKILL.md
```

## 🚀 MVP 定义

最小可行版本需要:
1. ✅ 能创建和查看任务
2. ✅ 能注册 Agent
3. ✅ Agent 能通过 API 更新任务
4. ✅ 基础聊天功能
5. ✅ Activity 日志

---

**下一步**: 开始 Phase 1 - 项目初始化
