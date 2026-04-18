// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { ArrowLeft, Users, Vote, FileText } from 'lucide-react'
// import Navbar from '../../components/layout/Navbar'
// import Loader from '../../components/common/Loader'
// import { adminService } from '../../services/adminService'

// export default function Results() {
//   const { meetingId } = useParams()
//   const navigate = useNavigate()
//   const [results, setResults] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [tab, setTab] = useState('attendance')

//   useEffect(() => {
//     adminService.getFullResults(meetingId).then(setResults).finally(() => setLoading(false))
//   }, [meetingId])

//   if (loading) return <><Navbar /><Loader /></>

//   const tabs = [
//     { id: 'attendance', label: 'Attendance', icon: <Users size={15} /> },
//     { id: 'people', label: 'Elections', icon: <Vote size={15} /> },
//     { id: 'motions', label: 'Motions', icon: <FileText size={15} /> },
//   ]

//   const motionTally = {}
//   results?.motionVotes?.forEach(v => {
//     const title = v.motions?.title || v.motion_id
//     if (!motionTally[title]) motionTally[title] = { yes: 0, no: 0, abstain: 0 }
//     motionTally[title][v.vote] = (motionTally[title][v.vote] || 0) + 1
//   })

//   const peopleTally = {}
//   results?.peopleVotes?.forEach(v => {
//     const name = v.candidates?.name || v.manual_name || 'Unknown'
//     peopleTally[name] = (peopleTally[name] || 0) + 1
//   })

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
//       <Navbar />
//       <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
//         <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
//           <ArrowLeft size={15} /> Back
//         </button>
//         <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '28px' }}>Meeting Results</h1>

//         {/* Tabs */}
//         <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '4px', marginBottom: '28px' }}>
//           {tabs.map(t => (
//             <button key={t.id} onClick={() => setTab(t.id)} style={{
//               flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
//               padding: '9px', borderRadius: 'var(--radius-md)', border: 'none',
//               background: tab === t.id ? 'var(--bg-elevated)' : 'transparent',
//               color: tab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
//               cursor: 'pointer', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-body)',
//               transition: 'all 0.2s',
//             }}>
//               {t.icon} {t.label}
//             </button>
//           ))}
//         </div>

//         {tab === 'attendance' && (
//           <ResultTable rows={results?.attendance?.map(a => ({ label: a.users?.full_name, value: a.checked_in ? '✓ Present' : '✗ Absent', color: a.checked_in ? 'var(--success)' : 'var(--danger)' }))} emptyMsg="No attendance data." />
//         )}

//         {tab === 'people' && (
//           <ResultTable rows={Object.entries(peopleTally).sort((a,b) => b[1]-a[1]).map(([name, count]) => ({ label: name, value: `${count} vote${count !== 1 ? 's' : ''}`, color: 'var(--accent)' }))} emptyMsg="No election votes recorded." />
//         )}

//         {tab === 'motions' && (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//             {Object.keys(motionTally).length === 0 ? (
//               <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>No motion votes recorded.</div>
//             ) : Object.entries(motionTally).map(([title, counts]) => {
//               const total = counts.yes + counts.no + counts.abstain
//               return (
//                 <div key={title} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
//                   <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: '14px' }}>{title}</div>
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     {[['Yes', counts.yes, 'var(--success)'], ['No', counts.no, 'var(--danger)'], ['Abstain', counts.abstain, 'var(--text-muted)']].map(([l, v, c]) => (
//                       <div key={l} style={{ flex: 1, background: `${c}14`, border: `1px solid ${c}30`, borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
//                         <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)', color: c }}>{v}</div>
//                         <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{l} ({total > 0 ? Math.round(v/total*100) : 0}%)</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }

// function ResultTable({ rows = [], emptyMsg }) {
//   if (!rows.length) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>{emptyMsg}</div>
//   return (
//     <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
//       {rows.map((row, i) => (
//         <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
//           <span style={{ fontSize: '14px' }}>{row.label}</span>
//           <span style={{ fontSize: '13px', fontWeight: 600, color: row.color }}>{row.value}</span>
//         </div>
//       ))}
//     </div>
//   )
// }


import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Vote, FileText, CheckCircle, XCircle, Minus } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Loader from '../../components/common/Loader'
import { adminService } from '../../services/adminService'

export default function Results() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('elections')

  useEffect(() => {
    adminService.getFullResults(meetingId)
      .then(setResults)
      .finally(() => setLoading(false))
  }, [meetingId])

  if (loading) return <><Navbar /><Loader /></>

  // ── Build structured election results ────────────────────────
  // Shape: { [sectionTitle]: { [categoryTitle]: { candidateName: count, ... } } }
  const electionResults = {}
  results.peopleVotes.forEach(v => {
    const section = v.sections?.title || 'Unknown Section'
    const category = v.categories?.title || 'Uncategorised'
    const name = v.candidates?.name || v.manual_name || 'Write-in'

    if (!electionResults[section]) electionResults[section] = {}
    if (!electionResults[section][category]) electionResults[section][category] = {}
    electionResults[section][category][name] = (electionResults[section][category][name] || 0) + 1
  })

  // ── Build structured motion results ─────────────────────────
  // Shape: { [sectionTitle]: { [motionTitle]: { yes, no, abstain, comments } } }
  const motionResults = {}
  results.motionVotes.forEach(v => {
    const section = v.sections?.title || 'Unknown Section'
    const motion = v.motions?.title || 'Unknown Motion'

    if (!motionResults[section]) motionResults[section] = {}
    if (!motionResults[section][motion]) {
      motionResults[section][motion] = { yes: 0, no: 0, abstain: 0, comments: [] }
    }
    motionResults[section][motion][v.vote]++
    if (v.comment) motionResults[section][motion].comments.push({ voter: v.voters?.full_name || 'Anonymous', text: v.comment })
  })

  // ── Attendance grouped by section ────────────────────────────
  const attendanceBySection = {}
  results.attendance.forEach(a => {
    const section = a.sections?.title || 'Unknown Section'
    if (!attendanceBySection[section]) attendanceBySection[section] = []
    attendanceBySection[section].push(a)
  })

  const tabs = [
    { id: 'elections', label: 'Elections', icon: <Vote size={14} /> },
    { id: 'motions', label: 'Motions', icon: <FileText size={14} /> },
    { id: 'attendance', label: 'Attendance', icon: <Users size={14} /> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">

        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
          Meeting Results
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '14px' }}>
          Full breakdown of votes cast and attendance recorded.
        </p>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px',
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '4px', marginBottom: '28px',
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '10px', borderRadius: 'var(--radius-md)', border: 'none',
              background: tab === t.id ? 'var(--bg-elevated)' : 'transparent',
              color: tab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-body)',
              transition: 'all 0.2s',
              boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── ELECTIONS TAB ───────────────────────────────────── */}
        {tab === 'elections' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {Object.keys(electionResults).length === 0 ? (
              <EmptyState msg="No election votes have been cast yet." />
            ) : (
              Object.entries(electionResults).map(([sectionTitle, categories]) => (
                <div key={sectionTitle}>
                  {/* Section label */}
                  <SectionLabel title={sectionTitle} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {Object.entries(categories).map(([categoryTitle, votes]) => {
                      const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0)
                      const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1])
                      const winner = sorted[0]

                      return (
                        <div key={categoryTitle} style={{
                          background: 'var(--bg-surface)', border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                        }}>
                          {/* Category header */}
                          <div style={{
                            padding: '14px 20px',
                            background: 'var(--bg-elevated)',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>
                              {categoryTitle}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {totalVotes} vote{totalVotes !== 1 ? 's' : ''} cast
                            </div>
                          </div>

                          {/* Candidates */}
                          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {sorted.map(([name, count], idx) => {
                              const pct = totalVotes > 0 ? Math.round(count / totalVotes * 100) : 0
                              const isWinner = idx === 0 && count > 0

                              return (
                                <div key={name}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        background: isWinner ? 'rgba(250,204,21,0.15)' : 'var(--bg-elevated)',
                                        border: `1px solid ${isWinner ? 'rgba(250,204,21,0.4)' : 'var(--border)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-display)',
                                        color: isWinner ? '#facc15' : 'var(--text-muted)',
                                      }}>
                                        {idx + 1}
                                      </div>
                                      <span style={{
                                        fontSize: '14px', fontWeight: isWinner ? 600 : 400,
                                        color: isWinner ? 'var(--text-primary)' : 'var(--text-secondary)',
                                      }}>
                                        {name}
                                      </span>
                                      {isWinner && (
                                        <span style={{ fontSize: '11px', background: 'rgba(250,204,21,0.12)', color: '#facc15', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                                          Leading
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pct}%</span>
                                      <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', minWidth: '20px', textAlign: 'right' }}>
                                        {count}
                                      </span>
                                    </div>
                                  </div>
                                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                      height: '100%',
                                      width: `${pct}%`,
                                      background: isWinner ? '#facc15' : 'var(--accent)',
                                      borderRadius: '3px',
                                      transition: 'width 0.8s ease',
                                      opacity: isWinner ? 1 : 0.6,
                                    }} />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── MOTIONS TAB ────────────────────────────────────── */}
        {tab === 'motions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {Object.keys(motionResults).length === 0 ? (
              <EmptyState msg="No motion votes have been cast yet." />
            ) : (
              Object.entries(motionResults).map(([sectionTitle, motions]) => (
                <div key={sectionTitle}>
                  <SectionLabel title={sectionTitle} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {Object.entries(motions).map(([motionTitle, data]) => {
                      const total = data.yes + data.no + data.abstain
                      const passed = data.yes > data.no

                      return (
                        <div key={motionTitle} style={{
                          background: 'var(--bg-surface)', border: `1px solid ${total > 0 ? (passed ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)') : 'var(--border)'}`,
                          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                        }}>
                          {/* Motion header */}
                          <div style={{
                            padding: '14px 20px',
                            background: total > 0 ? (passed ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)') : 'var(--bg-elevated)',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>
                              {motionTitle}
                            </div>
                            {total > 0 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: passed ? 'var(--success)' : 'var(--danger)' }}>
                                {passed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                {passed ? 'Motion Passes' : 'Motion Fails'}
                              </div>
                            )}
                          </div>

                          <div style={{ padding: '16px' }}>
                            {/* Vote bars */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: data.comments.length > 0 ? '16px' : '0' }}>
                              {[
                                { label: 'Yes', count: data.yes, color: 'var(--success)', icon: <CheckCircle size={13} /> },
                                { label: 'No', count: data.no, color: 'var(--danger)', icon: <XCircle size={13} /> },
                                { label: 'Abstain', count: data.abstain, color: 'var(--text-muted)', icon: <Minus size={13} /> },
                              ].map(opt => {
                                const pct = total > 0 ? Math.round(opt.count / total * 100) : 0
                                return (
                                  <div key={opt.label} style={{
                                    flex: 1,
                                    background: `${opt.color}10`,
                                    border: `1px solid ${opt.color}25`,
                                    borderRadius: 'var(--radius-md)',
                                    padding: '14px 12px',
                                    textAlign: 'center',
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: opt.color, marginBottom: '8px' }}>
                                      {opt.icon}
                                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{opt.label}</span>
                                    </div>
                                    <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: opt.color }}>
                                      {opt.count}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{pct}%</div>
                                  </div>
                                )
                              })}
                            </div>

                            {/* Comments */}
                            {data.comments.length > 0 && (
                              <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                  Comments ({data.comments.length})
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {data.comments.map((c, i) => (
                                    <div key={i} style={{
                                      padding: '10px 14px',
                                      background: 'var(--bg-elevated)',
                                      border: '1px solid var(--border)',
                                      borderRadius: 'var(--radius-md)',
                                      fontSize: '13px',
                                    }}>
                                      <span style={{ color: 'var(--accent)', fontWeight: 600, marginRight: '6px' }}>{c.voter}:</span>
                                      <span style={{ color: 'var(--text-secondary)' }}>{c.text}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── ATTENDANCE TAB ─────────────────────────────────── */}
        {tab === 'attendance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {Object.keys(attendanceBySection).length === 0 ? (
              <EmptyState msg="No attendance data recorded yet." />
            ) : (
              Object.entries(attendanceBySection).map(([sectionTitle, records]) => {
                const present = records.filter(r => r.checked_in).length
                const total = records.length
                const pct = total > 0 ? Math.round(present / total * 100) : 0

                return (
                  <div key={sectionTitle}>
                    <SectionLabel title={sectionTitle} />
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                      {/* Summary bar */}
                      <div style={{ padding: '14px 20px', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--success)', borderRadius: '3px', transition: 'width 0.8s ease' }} />
                          </div>
                          <span style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {present} / {total} present ({pct}%)
                          </span>
                        </div>
                      </div>

                      {/* Individual rows */}
                      {records.map((r, i) => (
                        <div key={r.id} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 20px',
                          borderBottom: i < records.length - 1 ? '1px solid var(--border)' : 'none',
                          fontSize: '14px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '30px', height: '30px', borderRadius: '50%',
                              background: r.checked_in ? 'var(--success-dim)' : 'var(--bg-hover)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: r.checked_in ? 'var(--success)' : 'var(--text-muted)',
                              fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-display)',
                            }}>
                              {r.users?.full_name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span style={{ color: 'var(--text-primary)' }}>
                              {r.users?.full_name || r.users?.email || 'Unknown'}
                            </span>
                          </div>
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            fontSize: '12px', fontWeight: 600,
                            color: r.checked_in ? 'var(--success)' : 'var(--danger)',
                            padding: '3px 10px',
                            background: r.checked_in ? 'var(--success-dim)' : 'var(--danger-dim)',
                            borderRadius: '12px',
                          }}>
                            {r.checked_in ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {r.checked_in ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function SectionLabel({ title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
        {title}
      </span>
      <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
    </div>
  )
}

function EmptyState({ msg }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)', fontSize: '14px' }}>
      {msg}
    </div>
  )
}