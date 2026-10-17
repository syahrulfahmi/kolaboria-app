import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

const menu = readFileSync(new URL('../app/components/workspace/views/WorkspaceDiscussionActionsMenu.vue', import.meta.url), 'utf8')
const detail = readFileSync(new URL('../app/components/workspace/views/WorkspaceDiscussionDetailView.vue', import.meta.url), 'utf8')
const reply = readFileSync(new URL('../app/components/workspace/views/WorkspaceDiscussionReplyItem.vue', import.meta.url), 'utf8')
const list = readFileSync(new URL('../app/components/workspace/views/WorkspaceDiscussionView.vue', import.meta.url), 'utf8')

test('discussion action menu exposes compact, keyboard-operable menu semantics', () => {
  assert.equal((menu.match(/<AtomicIconButton/g) ?? []).length, 1)
  assert.match(menu, /aria-haspopup="menu"/)
  assert.match(menu, /:aria-expanded="isMenuOpen"/)
  assert.match(menu, /role="menu"/)
  assert.equal((menu.match(/<button(?=[^>]*role="menuitem")[^>]*>/g) ?? []).length, 2)
  assert.match(menu, /onClickOutside\(rootRef/)
  assert.match(menu, /event\.key === 'Escape'/)
  assert.match(menu, /event\.key === 'ArrowDown'/)
  assert.match(menu, /event\.key === 'ArrowUp'/)
})

test('topic and replies use the same compact menu and preserve their existing edit/delete actions', () => {
  assert.match(detail, /<WorkspaceDiscussionActionsMenu[\s\S]*?:can-edit="discussion\.canEdit"[\s\S]*?:can-delete="discussion\.canDelete"[\s\S]*?@edit="openEdit"[\s\S]*?@delete="deleteDialogOpen = true"/)
  assert.match(reply, /<WorkspaceDiscussionActionsMenu[\s\S]*?:can-edit="reply\.canEdit"[\s\S]*?:can-delete="reply\.canDelete"[\s\S]*?@edit="editBody = reply\.body; editOpen = true"[\s\S]*?@delete="deleteOpen = true"/)
  assert.doesNotMatch(detail, /<AtomicButton[^>]*>\s*<template #icon-left><Pencil/)
  assert.doesNotMatch(reply, /<AtomicButton[^>]*aria-label=\"Edit balasan\"/)
})

test('discussion list items use the same compact menu and preserve list edit/delete flows', () => {
  assert.match(list, /<WorkspaceDiscussionActionsMenu[\s\S]*?:can-edit=\"item\.canEdit\"[\s\S]*?:can-delete=\"item\.canDelete\"[\s\S]*?@edit=\"openEditDialog\(item\.id\)\"[\s\S]*?@delete=\"openDeleteDialog\(item\.id\)\"/)
  assert.doesNotMatch(list, /<AtomicButton[\s\S]*?aria-label=\{`Edit \$\{item\.title\}`\}/)
  assert.doesNotMatch(list, /<AtomicButton[\s\S]*?aria-label=\{`Hapus \$\{item\.title\}`\}/)
})

test('discussion list keeps the action menu to the right of the title on narrow screens', () => {
  assert.match(list, /<div class="flex items-start justify-between gap-2 sm:gap-3">[\s\S]*?<div class="min-w-0 flex-1">[\s\S]*?<WorkspaceDiscussionActionsMenu/)
  assert.match(menu, /class="relative shrink-0"/)
})
