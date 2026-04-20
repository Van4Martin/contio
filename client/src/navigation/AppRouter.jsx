// // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// // import { useSelector } from 'react-redux'

// // import Login from '../pages/auth/Login'
// // import Register from '../pages/auth/Register'
// // import Dashboard from '../pages/dashboard/Dashboard'
// // import MeetingDetails from '../pages/meeting/MeetingDetails'
// // import AttendancePage from '../pages/meeting/AttendancePage'
// // import SectionsPage from '../pages/meeting/SectionsPage'
// // import VotePeople from '../pages/voting/VotePeople'
// // import VoteMotions from '../pages/voting/VoteMotions'
// // import VoteSummary from '../pages/voting/VoteSummary'
// // import AdminDashboard from '../pages/admin/AdminDashboard'
// // import ManageMeetings from '../pages/admin/ManageMeetings'
// // import ManageSections from '../pages/admin/ManageSections'
// // import ManageCandidates from '../pages/admin/ManageCandidates'
// // import ManageMotions from '../pages/admin/ManageMotions'
// // import Results from '../pages/admin/Results'
// // import NotFound from '../pages/NotFound'
// // import Loader from '../components/common/Loader'
// // import ManageCategories from '../pages/admin/ManageCategories'

// // function ProtectedRoute({ children }) {
// //   const { user, loading } = useSelector(state => state.auth)
// //   if (loading) return <Loader fullScreen />
// //   return user ? children : <Navigate to="/login" replace />
// // }

// // function AdminRoute({ children }) {
// //   const { user, profile, loading } = useSelector(state => state.auth)
// //   if (loading) return <Loader fullScreen />
// //   const isAdmin = user?.user_metadata?.role === 'admin' || profile?.role === 'admin'
// //   return isAdmin ? children : <Navigate to="/dashboard" replace />
// // }

// // function GuestRoute({ children }) {
// //   const { user, loading } = useSelector(state => state.auth)
// //   if (loading) return <Loader fullScreen />
// //   return !user ? children : <Navigate to="/dashboard" replace />
// // }

// // export default function AppRouter() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route path="/" element={<Navigate to="/dashboard" replace />} />
// //         <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
// //         <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
// //         <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// //         <Route path="/meeting/:id" element={<ProtectedRoute><MeetingDetails /></ProtectedRoute>} />
// //         <Route path="/meeting/:id/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
// //         <Route path="/admin/categories/:sectionId"element={<AdminRoute><ManageCategories /></AdminRoute>}/>
// //         <Route path="/meeting/:id/sections" element={<ProtectedRoute><SectionsPage /></ProtectedRoute>} />
// //         <Route path="/meeting/:id/vote/people/:sectionId" element={<ProtectedRoute><VotePeople /></ProtectedRoute>} />
// //         <Route path="/meeting/:id/vote/motions/:sectionId" element={<ProtectedRoute><VoteMotions /></ProtectedRoute>} />
// //         <Route path="/meeting/:id/vote/summary" element={<ProtectedRoute><VoteSummary /></ProtectedRoute>} />
// //         <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
// //         <Route path="/admin/meetings" element={<AdminRoute><ManageMeetings /></AdminRoute>} />
// //         <Route path="/admin/sections/:meetingId" element={<AdminRoute><ManageSections /></AdminRoute>} />
// //         <Route path="/admin/candidates/:sectionId" element={<AdminRoute><ManageCandidates /></AdminRoute>} />
// //         <Route path="/admin/motions/:sectionId" element={<AdminRoute><ManageMotions /></AdminRoute>} />
// //         <Route path="/admin/results/:meetingId" element={<AdminRoute><Results /></AdminRoute>} />
// //         <Route path="*" element={<NotFound />} />
// //       </Routes>
// //     </BrowserRouter>
// //   )
// // }




// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'

// import Login from '../pages/auth/Login'
// import Register from '../pages/auth/Register'
// import Dashboard from '../pages/dashboard/Dashboard'
// import MeetingDetails from '../pages/meeting/MeetingDetails'
// import AttendancePage from '../pages/meeting/AttendancePage'
// import SectionsPage from '../pages/meeting/SectionsPage'
// import VotePeople from '../pages/voting/VotePeople'
// import VoteMotions from '../pages/voting/VoteMotions'
// import VoteSummary from '../pages/voting/VoteSummary'
// import AdminDashboard from '../pages/admin/AdminDashboard'
// import ManageMeetings from '../pages/admin/ManageMeetings'
// import ManageSections from '../pages/admin/ManageSections'
// import ManageCategories from '../pages/admin/ManageCategories'
// import ManageCandidates from '../pages/admin/ManageCandidates'
// import ManageMotions from '../pages/admin/ManageMotions'
// import ManageUsers from '../pages/admin/ManageUsers'
// import Reports from '../pages/admin/Reports'
// import Results from '../pages/admin/Results'
// import NotFound from '../pages/NotFound'
// import Loader from '../components/common/Loader'

// function ProtectedRoute({ children }) {
//   const { user, loading } = useSelector(state => state.auth)
//   if (loading) return <Loader fullScreen />
//   return user ? children : <Navigate to="/login" replace />
// }

// function AdminRoute({ children }) {
//   const { user, profile, loading } = useSelector(state => state.auth)
//   if (loading) return <Loader fullScreen />
//   const isAdmin = user?.user_metadata?.role === 'admin' || profile?.role === 'admin'
//   return isAdmin ? children : <Navigate to="/dashboard" replace />
// }

// function GuestRoute({ children }) {
//   const { user, loading } = useSelector(state => state.auth)
//   if (loading) return <Loader fullScreen />
//   return !user ? children : <Navigate to="/dashboard" replace />
// }

// export default function AppRouter() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
//         <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
//         <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//         <Route path="/meeting/:id" element={<ProtectedRoute><MeetingDetails /></ProtectedRoute>} />
//         <Route path="/meeting/:id/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
//         <Route path="/meeting/:id/sections" element={<ProtectedRoute><SectionsPage /></ProtectedRoute>} />
//         <Route path="/meeting/:id/vote/people/:sectionId" element={<ProtectedRoute><VotePeople /></ProtectedRoute>} />
//         <Route path="/meeting/:id/vote/motions/:sectionId" element={<ProtectedRoute><VoteMotions /></ProtectedRoute>} />
//         <Route path="/meeting/:id/vote/summary" element={<ProtectedRoute><VoteSummary /></ProtectedRoute>} />
//         <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
//         <Route path="/admin/meetings" element={<AdminRoute><ManageMeetings /></AdminRoute>} />
//         <Route path="/admin/sections/:meetingId" element={<AdminRoute><ManageSections /></AdminRoute>} />
//         <Route path="/admin/categories/:sectionId" element={<AdminRoute><ManageCategories /></AdminRoute>} />
//         <Route path="/admin/candidates/:sectionId" element={<AdminRoute><ManageCandidates /></AdminRoute>} />
//         <Route path="/admin/motions/:sectionId" element={<AdminRoute><ManageMotions /></AdminRoute>} />
//         <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
//         <Route path="/admin/reports" element={<AdminRoute><Reports /></AdminRoute>} />
//         <Route path="/admin/results/:meetingId" element={<AdminRoute><Results /></AdminRoute>} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }



import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/dashboard/Dashboard'
import MeetingDetails from '../pages/meeting/MeetingDetails'
import SessionElection from '../pages/voting/SessionElection'
import SessionMotions from '../pages/voting/SessionMotions'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageMeetings from '../pages/admin/ManageMeetings'
import ManageSessions from '../pages/admin/ManageSessions'
import ManageElectionCategories from '../pages/admin/ManageElectionCategories'
import ManageSessionMotions from '../pages/admin/ManageSessionMotions'
import ManageUsers from '../pages/admin/ManageUsers'
import Reports from '../pages/admin/Reports'
import Results from '../pages/admin/Results'
import NotFound from '../pages/NotFound'
import Loader from '../components/common/Loader'

function ProtectedRoute({ children }) {
  const { user, loading } = useSelector(state => state.auth)
  if (loading) return <Loader fullScreen />
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, profile, loading } = useSelector(state => state.auth)
  if (loading) return <Loader fullScreen />
  const isAdmin = user?.user_metadata?.role === 'admin' || profile?.role === 'admin'
  return isAdmin ? children : <Navigate to="/dashboard" replace />
}

function GuestRoute({ children }) {
  const { user, loading } = useSelector(state => state.auth)
  if (loading) return <Loader fullScreen />
  return !user ? children : <Navigate to="/dashboard" replace />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Member meeting routes */}
        <Route path="/meeting/:id" element={<ProtectedRoute><MeetingDetails /></ProtectedRoute>} />
        <Route path="/meeting/:meetingId/session/:sessionId/election" element={<ProtectedRoute><SessionElection /></ProtectedRoute>} />
        <Route path="/meeting/:meetingId/session/:sessionId/motions" element={<ProtectedRoute><SessionMotions /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/meetings" element={<AdminRoute><ManageMeetings /></AdminRoute>} />
        <Route path="/admin/sessions/:meetingId" element={<AdminRoute><ManageSessions /></AdminRoute>} />
        <Route path="/admin/election/:sessionId" element={<AdminRoute><ManageElectionCategories /></AdminRoute>} />
        <Route path="/admin/motions-session/:sessionId" element={<AdminRoute><ManageSessionMotions /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><Reports /></AdminRoute>} />
        <Route path="/admin/results/:meetingId" element={<AdminRoute><Results /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}