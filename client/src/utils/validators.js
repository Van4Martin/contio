export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const isStrongPassword = (password) => password.length >= 8

export const isNotEmpty = (value) => value?.toString().trim().length > 0

export const validateMeeting = ({ title, scheduled_at }) => {
  const errors = {}
  if (!isNotEmpty(title)) errors.title = 'Title is required'
  if (!scheduled_at) errors.scheduled_at = 'Date and time is required'
  return errors
}

export const validateSection = ({ title, type }) => {
  const errors = {}
  if (!isNotEmpty(title)) errors.title = 'Section title is required'
  if (!type) errors.type = 'Section type is required'
  return errors
}