import { inject, type InjectionKey } from "vue";
import type {
  WorkspaceController,
  WorkspaceDiscussionContext,
  WorkspaceTasksContext,
} from "~/composables/useWorkspaceController";

export interface WorkspaceViewContexts {
  tasks: WorkspaceTasksContext;
  discussion: WorkspaceDiscussionContext;
}

export interface WorkspaceRouteContext {
  controller: WorkspaceController;
  views: WorkspaceViewContexts;
}

export const workspaceRouteContextKey: InjectionKey<WorkspaceRouteContext> =
  Symbol("workspace-route-context");

export const useWorkspaceRouteContext = () => {
  const context = inject(workspaceRouteContextKey);
  if (!context) {
    throw new Error("Workspace pages must be rendered inside the Workspace layout.");
  }
  return context;
};
