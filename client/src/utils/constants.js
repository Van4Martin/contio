// export const SECTION_TYPES = {
//   ATTENDANCE: 'attendance',
//   ELECTION: 'election',
//   MOTION: 'motion',
//   GENERAL: 'general',
// }

// export const MEETING_STATUS = {
//   DRAFT: 'draft',
//   SCHEDULED: 'scheduled',
//   ACTIVE: 'active',
//   COMPLETED: 'completed',
//   CANCELLED: 'cancelled',
// }

// export const VOTE_OPTIONS = {
//   YES: 'yes',
//   NO: 'no',
//   ABSTAIN: 'abstain',
// }

// export const USER_ROLES = {
//   ADMIN: 'admin',
//   MEMBER: 'member',
// }

// export const ROUTES = {
//   HOME: '/',
//   LOGIN: '/login',
//   REGISTER: '/register',
//   DASHBOARD: '/dashboard',
//   MEETING: '/meeting/:id',
//   ATTENDANCE: '/meeting/:id/attendance',
//   SECTIONS: '/meeting/:id/sections',
//   VOTE_PEOPLE: '/meeting/:id/vote/people/:sectionId',
//   VOTE_MOTIONS: '/meeting/:id/vote/motions/:sectionId',
//   VOTE_SUMMARY: '/meeting/:id/vote/summary',
//   ADMIN: '/admin',
//   ADMIN_MEETINGS: '/admin/meetings',
//   ADMIN_SECTIONS: '/admin/sections/:meetingId',
//   ADMIN_CANDIDATES: '/admin/candidates/:sectionId',
//   ADMIN_MOTIONS: '/admin/motions/:sectionId',
//   ADMIN_RESULTS: '/admin/results/:meetingId',
// }


export const MEETING_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const VOTE_OPTIONS = {
  YES: 'yes',
  NO: 'no',
  ABSTAIN: 'abstain',
}

export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  MEETING: '/meeting/:id',
  SESSION: '/meeting/:meetingId/session/:sessionId',
  ADMIN: '/admin',
  ADMIN_MEETINGS: '/admin/meetings',
  ADMIN_SESSIONS: '/admin/sessions/:meetingId',
  ADMIN_SESSION_DETAIL: '/admin/session/:sessionId',
  ADMIN_USERS: '/admin/users',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_RESULTS: '/admin/results/:meetingId',
}