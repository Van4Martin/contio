import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return format(parseISO(dateStr), 'MMM d, yyyy')
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  return format(parseISO(dateStr), 'MMM d, yyyy • h:mm a')
}

export const formatRelative = (dateStr) => {
  if (!dateStr) return '—'
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
}

export const formatTime = (dateStr) => {
  if (!dateStr) return '—'
  return format(parseISO(dateStr), 'h:mm a')
}