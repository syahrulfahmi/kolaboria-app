# Project Detail Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `apps/client/app/pages/projects/[slug].vue` into an editorial project brief aligned with Kolaboria's design system and current project/application data.

**Architecture:** Keep all data fetching in the existing page and `useProjects()` composable. Add local computed view-model helpers in the page for slot progress, grouped skills, dates, and application messaging, then restructure the template into a max-width asymmetric grid.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup>`, Tailwind design token classes, existing Kolaboria UI components.

---

### Task 1: Page View Model

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Add computed helpers: `filledSlots`, `slotProgress`, `requiredSkills`, `optionalSkills`, `formattedStartDate`, `creatorInitial`, `applicationMessage`, and `isClosedForApplication`.
- [ ] Keep existing project fetching, owner detection, application lookup, and apply modal flow unchanged.

### Task 2: Editorial Layout

**Files:**
- Modify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Change page wrapper to `bg-neutral-50`, `max-w-6xl`, and `lg:grid-cols-[1.65fr_0.8fr]`.
- [ ] Replace the current single header/stats card with a project brief card and a right-side action card.
- [ ] Move description, why-join, tech stack, skills, members, creator, and slot availability into clearer content sections.
- [ ] Use existing UI components and design token classes only.

### Task 3: Verification

**Files:**
- Verify: `apps/client/app/pages/projects/[slug].vue`

- [ ] Run `pnpm --filter @kolaboria/client build`.
- [ ] If build fails because of an unrelated existing issue, report the exact blocker and verify the changed file by inspection.
