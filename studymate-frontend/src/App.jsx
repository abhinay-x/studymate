import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import LandingPageWrapper from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import SigninPage from './pages/SigninPage'
import DashboardPage from './pages/DashboardPage'
import AIChatPage from './pages/AIChatPage'
import FlashcardsPage from './pages/FlashcardsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import MindMapPage from './pages/MindMapPage'
import AIInsightsPage from './pages/AIInsightsPage'
import StudyBuddyPage from './pages/StudyBuddyPage'
import SchedulerPage from './pages/SchedulerPage'
import VirtualClassroomPage from './pages/VirtualClassroomPage'
import GamificationPage from './pages/GamificationPage'
import MentalHealthPage from './pages/MentalHealthPage'
import ARStudyPage from './pages/ARStudyPage'
import DocumentsPage from './pages/DocumentsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import UniversalHeader from './components/layout/UniversalHeader'
import ScrollToTop from './components/common/ScrollToTop'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPageWrapper />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/signin" element={<SigninPage />} />

              {/* Protected Routes with Universal Header */}
              <Route path="/dashboard" element={
                <ProtectedRoute requireAuth={true}>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/chat" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <AIChatPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/flashcards" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <FlashcardsPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/analytics" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <AnalyticsPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/mindmap" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <MindMapPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/ai-insights" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <AIInsightsPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/study-buddy" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <StudyBuddyPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/scheduler" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <SchedulerPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/classroom" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <VirtualClassroomPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/gamification" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <GamificationPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/mental-health" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <MentalHealthPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/ar-study" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <ARStudyPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/documents" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <DocumentsPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <ProfilePage />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute requireAuth={true}>
                  <>
                    <UniversalHeader />
                    <div className="pt-16">
                      <SettingsPage />
                    </div>
                  </>
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

