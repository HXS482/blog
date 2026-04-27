---
title: "Building an Agent Memory System: brain-framework"
date: 2026-04-27
---

# Building an Agent Memory System: brain-framework

AI agents are powerful, but they have a fundamental flaw: **they forget**. Close the terminal, and everything is gone. Start a new session, and you're introducing yourself all over again.

I built [brain-framework](https://github.com/HXS482/brain-framework) to solve this. It gives agents a persistent, structured memory that survives across sessions — using Obsidian as the storage layer and MCP as the communication protocol.

## The Problem

Claude Code, OpenCode, Codex — these tools can do incredible work, but they're amnesiacs. Each session starts from zero. Context windows are limited. There's no long-term learning.

What if an agent could:

- **Remember** who you are across sessions
- **Learn** your preferences and coding style
- **Track** ongoing projects without being re-briefed
- **Build** a knowledge base from every conversation

That's what brain-framework does.

## Architecture: Three Layers of Memory

The system is built on a three-tier memory model, inspired by how human memory works:

> **Sources (Raw)** &rarr; **Wiki (Structured)** &rarr; **Brain (Integrated)**

| Layer | Location | Purpose |
|-------|----------|---------|
| **Sources** | `_sources/` | Raw input, external content — ingested but unprocessed |
| **Wiki** | `_wiki/` | Agent-refined concepts — structured, linked, searchable |
| **Brain** | `_brain/` | Fused memory — the agent's actual working knowledge |

The Brain itself is subdivided into:

| Memory Type | Location | Content |
|-------------|----------|---------|
| **Episodic** | `_episodic/` | Session archives — what happened, when |
| **Procedural** | `_procedural/` | Patterns, preferences, rules of engagement |
| **Semantic** | `_semantic/` | Fused insights synthesized across sessions |

## How It Works

### The Protocol

At the core is `AGENTS.md` — a startup protocol that the agent executes at the beginning of every session. It's not a suggestion. It's a conditional reflex.

The protocol defines three interconnected systems:

| Protocol | Trigger | Action |
|----------|---------|--------|
| **Brain Wake** | Session start | Quick start → state load → context prep → personalize |
| **Session Monitor** | Every 5 turns | Self-check for convergence, trigger archival if needed |
| **Session End** | Convergence detected | Archive session → extract patterns → integrate knowledge → reset |

### Session Lifecycle

Every session follows a structured lifecycle:

| Phase | Frequency | Action |
|-------|-----------|--------|
| **Start** | Once per session | Read meta_state → load preferences → personalize |
| **During** | Every 5 turns | Self-check: any new info worth storing? |
| **End** | Session close | Archive → batch update → extract patterns → integrate → reset |

### Memory Triggers

The agent doesn't need to be told to remember things. It detects:

| Trigger | Action |
|---------|--------|
| New API key / config | → Write to preferences |
| New tool / skill | → Write to wiki |
| User preference / habit | → Write to patterns |
| Major insight | → Write to semantic insights |
| Error encountered | → Analyze root cause, store lesson |

## The Tech Stack

| Component | Role | Why |
|-----------|------|-----|
| **Obsidian** | Storage layer | Markdown files + YAML frontmatter — human-readable, git-friendly |
| **Local REST API** | HTTP bridge | Obsidian plugin exposing vault CRUD via local endpoints |
| **obsidian-mcp-server** | Protocol adapter | Translates MCP tool calls into Obsidian REST API requests |
| **Agent** | Consumer | Claude Code, OpenCode, Codex — any MCP-compatible agent |

The beauty of this stack: the memory is just markdown files. Browse, edit, search directly in Obsidian. No proprietary database. No lock-in.

## Dual Vault Architecture

One of the more interesting design decisions: the system supports multiple vaults.

| Vault | Port | Purpose |
|-------|------|---------|
| Agent Brain | 27123 | The agent's own memory system |
| Exam KB | 27125 | Domain-specific knowledge base |

The agent can switch between vaults based on context. If the user says "start a mock interview," the agent switches to the Exam KB vault. When the interview ends, it switches back. Each vault has its own complete memory hierarchy.

## Setup: 4 Steps to a Persistent Agent

1. **Clone and import** the vault template into Obsidian
2. **Configure** the Local REST API plugin — get a token and base URL
3. **Connect** — send the MCP config to your agent. It auto-installs `obsidian-mcp-server` and runs a self-check
4. **Initialize** — run `init.ps1` or `init.sh` with your agent name, identity, and vault port

The init script generates a personalized `AGENTS.md` that the agent reads on every startup.

## Design Philosophy

| Principle | Rule | Why |
|-----------|------|-----|
| **Text > Brain** | If it matters, write it down | Mental notes don't survive restarts. Files do. |
| **No Black Boxes** | All memory is plain markdown | Inspect, edit, version-control — zero lock-in |
| **Convergence Detection** | Watch for end-of-conversation signals | Proactively archive, never lose a session |
| **Forgetting is a Feature** | Prune stale knowledge (30-day rule) | Memory is a garden, not a landfill |

## What's Next

The framework is open source (MIT) and actively maintained. Current focus areas:

- Optimizing the startup protocol for speed (fewer MCP calls)
- Expanding the integration triggers and knowledge flow logic
- Building domain-specific vault templates beyond the exam use case

---

> *"Give your Agent a memory that lasts."*

Check it out: [github.com/HXS482/brain-framework](https://github.com/HXS482/brain-framework)
