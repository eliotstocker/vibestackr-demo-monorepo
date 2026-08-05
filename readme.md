# VibeStackR Demo Monorepo

> **Version**: `1.0.0`

A polyglot demo stack orchestrated by **VibeStackR** and managed across Git submodules with **MetaStackR** (`git-meta`).

---

## 🏛 Architecture Overview

This meta-repository coordinates 5 subrepositories demonstrating cross-service communication, polyglot environments, and AI-agent-assisted workflows:

| Subrepo | Version | Stack | Description |
| :--- | :--- | :--- | :--- |
| [**`Main Frontend`**](./Main%20Frontend) | `1.0.0` | Vite, Vanilla JS, Tailwind CSS | End-user client web application. |
| [**`Admin Frontend`**](./Admin%20Frontend) | `1.0.0` | React 19, TypeScript, Vite, Tailwind CSS | Internal administrative dashboard with Oxlint. |
| [**`Go Service`**](./Go%20Service) | `1.0.0` | Go 1.25, PostgreSQL | Core HTTP REST API (`/persons`) interacting with Java Backend. |
| [**`Java Backend`**](./Java%20Backend) | `1.0.0` | Java 21, Javalin, Gradle | Lightweight stateful counter microservice (`/counter`). |
| [**`Python Thing`**](./Python%20Thing) | `1.0.0` | Python 3, `requests` | CLI utility (`add_person.py`) for API data seeding. |

---

## 🚀 Quick Start

### 1. Toolchain & Dependencies Setup
Toolchains (Node, Go, Java, Python) are defined via [`mise.toml`](./mise.toml).

```bash
# Setup all subrepo dependencies
mise run setup-all
```

### 2. Initialize & Configure Stack
```bash
# Initialize stack environment
npx vibestackr init

# Configure services inter-connectivity
npx vibestackr config "add a shortcut that allows entering first and last names to add a person with the python thing script"
```

---

## 🛠 Multi-Repo Operations with MetaStackR (`git-meta`)

Because this project uses Git submodules, use `git-meta` for coordinated multi-repo workflows:

```bash
# Check submodule drift & branch status
git meta status --json

# Create or switch branches across all subrepos
git meta checkout -b feature/my-feature --json

# Create coordinated commits across modified subrepos
git meta commit -m "feat: updated cross-service API contracts" --json

# Push bottom-up to remotes safely
git meta push --json
```

---

## 🤖 AI Agent Guidelines

See [`AGENTS.md`](./AGENTS.md) and individual subrepo `AGENTS.md` files for subrepo-specific rules and instructions when pair-programming with AI agents.