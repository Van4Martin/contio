import CheckInCard from './CheckInCard'

export default function SectionList({ sections, checkedInSections, onCheckIn, loading }) {
  if (!sections?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
        No sections available for this meeting.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {sections.map(section => (
        <CheckInCard
          key={section.id}
          section={section}
          isCheckedIn={checkedInSections?.includes(section.id)}
          onCheckIn={() => onCheckIn(section.id)}
          loading={loading}
        />
      ))}
    </div>
  )
}