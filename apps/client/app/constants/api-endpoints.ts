/**
 * Centralized API Endpoint Registry for Kolaboria Client
 * Single Source of Truth for all API endpoints matching kolaboria-api router
 * Each endpoint owns its version prefix; runtime config supplies only the server URL.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/v1/auth/login',
    LOGOUT: '/v1/auth/logout',
    REGISTER: '/v1/auth/register',
    REFRESH: '/v1/auth/refresh',
    VERIFY_EMAIL: '/v1/auth/verify-email',
    RESEND_VERIFICATION: '/v1/auth/resend-verification',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    RESET_PASSWORD: '/v1/auth/reset-password',
    GOOGLE: '/v1/auth/google',
    ME: '/v1/auth/me'
  },

  MASTER: {
    SKILLS: '/v1/master-data/skills',
    TOOLS: '/v1/master-data/tools',
    CONTRIBUTION_ROLES: '/v1/master-data/contribution-roles',
    LOCATIONS_SEARCH: '/v1/master-data/locations/search',
    LOCATION_DETAIL: (villageId: number | string) =>
      `/v1/master-data/locations/${villageId}`
  },

  PROFILE: {
    ME: '/v1/profiles/me',
    BY_USERNAME: (username: string) =>
      `/v1/profiles/${encodeURIComponent(username)}`,
    ONBOARDING: '/v1/profiles/onboarding',
    ONBOARDING_STATUS: '/v1/profiles/onboarding/status',
    MY_SKILLS: '/v1/profiles/me/skills',
    MY_SKILL_DETAIL: (id: string) => `/v1/profiles/me/skills/${id}`,
    MY_SKILL_PRIMARY: (id: string) => `/v1/profiles/me/skills/${id}/primary`,
    MY_TOOLS: '/v1/profiles/me/tools',
    MY_TOOL_DETAIL: (id: string) => `/v1/profiles/me/tools/${id}`,
    PUBLIC_CAREERS: (username: string) =>
      `/v1/profiles/${encodeURIComponent(username)}/careers`,
    PUBLIC_PORTFOLIO: (username: string) =>
      `/v1/profiles/${encodeURIComponent(username)}/portfolio`
  },

  CAREER: {
    MY_CAREERS: '/v1/profiles/me/careers',
    MY_CAREER_DETAIL: (id: string) => `/v1/profiles/me/careers/${id}`,
    PUBLIC_CAREERS: (username: string) =>
      `/v1/profiles/${encodeURIComponent(username)}/careers`
  },

  PORTFOLIO: {
    MY_PORTFOLIO: '/v1/profiles/me/portfolio',
    MY_PORTFOLIO_DETAIL: (projectId: string) =>
      `/v1/profiles/me/portfolio/${projectId}`,
    PUBLIC_PORTFOLIO: (username: string) =>
      `/v1/profiles/${encodeURIComponent(username)}/portfolio`
  },

  PROJECT: {
    LIST_OR_CREATE: '/v1/projects',
    DETAIL_BY_ID: (id: string) => `/v1/projects/${id}`,
    DETAIL_BY_SLUG: (slug: string) =>
      `/v1/projects/slug/${encodeURIComponent(slug)}`,
    MY_PROJECTS: '/v1/projects/my-projects',
    EDITOR_CREATE: '/v1/projects',
    EDITOR_PUBLISH_NEW: '/v1/projects/publish',
    EDITOR_UPDATE: (id: string) => `/v1/projects/${encodeURIComponent(id)}`,
    EDITOR_PUBLISH: (id: string) => `/v1/projects/${encodeURIComponent(id)}/publish`,
    STATUS: (id: string) => `/v1/projects/${id}/status`,
    PUBLISH: (id: string) => `/v1/projects/${id}/publish`,
    START: (id: string) => `/v1/projects/${id}/start`,
    APPLY: (id: string) => `/v1/projects/${id}/apply`,
    APPLICANTS: (id: string) => `/v1/projects/${id}/applicants`,
    APPLICANT_SUMMARY: (id: string) => `/v1/projects/${id}/applicants/summary`,
    MEMBER_LEAVE: (id: string) => `/v1/projects/${id}/members/leave`,
    MEMBER_STATUS: (id: string, memberId: string) =>
      `/v1/projects/${id}/members/${memberId}/status`,
    MEMBER_ROLE: (id: string, memberId: string) =>
      `/v1/projects/${id}/members/${memberId}/role`
  },

  APPLICATION: {
    MY_APPLICATIONS: '/v1/applications/my-applications',
    MY_APPLICATION_SUMMARY: '/v1/applications/my-applications/summary',
    DETAIL: (id: string) => `/v1/applications/${id}`,
    REVIEW: (id: string) => `/v1/applications/${id}/review`,
    WITHDRAW: (id: string) => `/v1/applications/${id}/withdraw`
  },

  WORKSPACE: {
    OVERVIEW: (projectSlug: string) => `/v1/workspaces/${encodeURIComponent(projectSlug)}/overview`,
    COMPLETION: (projectSlug: string) => `/v1/workspaces/${encodeURIComponent(projectSlug)}/completion`,
    ACTIVITY_LIST: (projectSlug: string) => `/v1/workspaces/${encodeURIComponent(projectSlug)}/activities`,
    INFO: (projectSlug: string) => `/v1/workspaces/${encodeURIComponent(projectSlug)}/info`,
    TEAM_MEMBERS: (projectSlug: string) => `/v1/workspaces/${encodeURIComponent(projectSlug)}/members`,
    DISCUSSIONS: (projectSlug: string) => `/v1/workspaces/${encodeURIComponent(projectSlug)}/discussions`,
    DISCUSSION: (projectSlug: string, discussionId: string) =>
      `/v1/workspaces/${encodeURIComponent(projectSlug)}/discussions/${encodeURIComponent(discussionId)}`,
    DISCUSSION_REPLIES: (projectSlug: string, discussionId: string) =>
      `/v1/workspaces/${encodeURIComponent(projectSlug)}/discussions/${encodeURIComponent(discussionId)}/replies`,
    DISCUSSION_REPLY: (projectSlug: string, discussionId: string, replyId: string) =>
      `/v1/workspaces/${encodeURIComponent(projectSlug)}/discussions/${encodeURIComponent(discussionId)}/replies/${encodeURIComponent(replyId)}`,
    TASK_LIST: (projectSlug: string) => `/v1/workspaces/${encodeURIComponent(projectSlug)}/tasks`,
    TASK_ITEM: (projectSlug: string, taskId: string) =>
      `/v1/workspaces/${encodeURIComponent(projectSlug)}/tasks/${encodeURIComponent(taskId)}`,
    TASK_TRANSITIONS: (projectSlug: string, taskId: string) =>
      `/v1/workspaces/${encodeURIComponent(projectSlug)}/tasks/${encodeURIComponent(taskId)}/transitions`,
    TASK_COMMENT_LIST: (projectSlug: string, taskId: string) =>
      `/v1/workspaces/${encodeURIComponent(projectSlug)}/tasks/${encodeURIComponent(taskId)}/comments`,
    MEMBER_TASK_ACCESS: (projectSlug: string, memberId: string) =>
      `/v1/workspaces/${encodeURIComponent(projectSlug)}/members/${encodeURIComponent(memberId)}/task-access`,
    TASKS: (projectId: string) => `/v1/projects/${projectId}/workspace/tasks`,
    ACTIVITIES: (projectId: string) =>
      `/v1/projects/${projectId}/workspace/activities`,
    MEMBERS: (projectId: string) => `/v1/projects/${projectId}/workspace/members`,
    MY_HISTORY: (projectId: string) =>
      `/v1/projects/${projectId}/workspace/my-history`,
    TASKS_REORDER: '/v1/projects/workspace/tasks/reorder',
    TASK_DETAIL: (taskId: string) => `/v1/projects/workspace/tasks/${taskId}`,
    TASK_COMMENTS: (taskId: string) =>
      `/v1/projects/workspace/tasks/${taskId}/comments`,
    COMMENT_DETAIL: (commentId: string) =>
      `/v1/projects/workspace/comments/${commentId}`
  },

  EVIDENCE: {
    DELIVERABLES: (projectId: string) => `/v1/projects/${projectId}/deliverables`,
    DELIVERABLE_DETAIL: (projectId: string, deliverableId: string) =>
      `/v1/projects/${projectId}/deliverables/${deliverableId}`,
    SNAPSHOTS: (projectId: string) =>
      `/v1/projects/${projectId}/contribution-snapshots`,
    FINALIZATION_STATUS: (projectId: string) =>
      `/v1/projects/${projectId}/finalization-status`
  },

  EXPERIENCE: {
    LIST_MINE: '/v1/experiences/me',
    DETAIL: (id: string) => `/v1/experiences/${id}`,
    PUBLIC: (username: string, slug: string) =>
      `/v1/experiences/public/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`,
    VISIBILITY: (id: string) => `/v1/experiences/${id}/visibility`,
    REFLECTION: (id: string) => `/v1/experiences/${id}/reflection`,
    HIGHLIGHTS: (id: string) => `/v1/experiences/${id}/highlights`,
    HIGHLIGHT_DETAIL: (id: string, highlightId: string) =>
      `/v1/experiences/${id}/highlights/${highlightId}`,
    EVENTS: (id: string) => `/v1/experiences/${id}/events`
  },

  NOTIFICATION: {
    LIST: '/v1/notifications',
    MARK_READ: (id: string) => `/v1/notifications/${id}/read`
  }
} as const
