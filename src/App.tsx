import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { SignIn } from './components/SignIn';
import { Layout } from './components/Layout';
import { StudentDashboard } from './components/StudentDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ProblemsPage } from './components/ProblemsPage';
import { CodeEditor } from './components/CodeEditor';
import { Leaderboard } from './components/Leaderboard';
import { Messages } from './components/Messages';
import { ResumeBuilder } from './components/ResumeBuilder';
import { CoursesPage } from './components/CoursesPage';
import { GradingQueue } from './components/GradingQueue';
import { BatchManagement } from './components/BatchManagement';
import { UserManagement } from './components/UserManagement';
import { AnalyticsPage } from './components/AnalyticsPage';
import { Problem } from './lib/data';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  // Reset page state when user changes (including logout/login)
  React.useEffect(() => {
    if (currentUser) {
      setCurrentPage('dashboard');
      setSelectedProblem(null);
    }
  }, [currentUser?.id]); // Reset when user ID changes

  if (!currentUser) {
    return <SignIn />;
  }

  const handleNavigate = (page: string, data?: any) => {
    if (page === 'problem' && data) {
      setSelectedProblem(data);
      setCurrentPage('editor');
    } else {
      setCurrentPage(page);
      setSelectedProblem(null);
    }
  };

  const renderContent = () => {
    // Code Editor view (no layout)
    if (currentPage === 'editor' && selectedProblem) {
      return <CodeEditor problem={selectedProblem} onBack={() => setCurrentPage('problems')} />;
    }

    // All other views use Layout
    return (
      <Layout currentPage={currentPage} onNavigate={handleNavigate}>
        {currentPage === 'dashboard' && (
          <>
            {currentUser.role === 'student' && <StudentDashboard onNavigate={handleNavigate} />}
            {currentUser.role === 'faculty' && <FacultyDashboard onNavigate={handleNavigate} />}
            {currentUser.role === 'admin' && <AdminDashboard onNavigate={handleNavigate} />}
          </>
        )}
        {currentPage === 'problems' && <ProblemsPage onSelectProblem={(problem) => handleNavigate('problem', problem)} />}
        {currentPage === 'leaderboard' && <Leaderboard />}
        {currentPage === 'messages' && <Messages />}
        {currentPage === 'profile' && <ResumeBuilder />}
        {currentPage === 'courses' && <CoursesPage onNavigate={handleNavigate} />}
        {currentPage === 'batches' && <BatchManagement onNavigate={handleNavigate} role={currentUser.role} />}
        {currentPage === 'grading' && <GradingQueue onNavigate={handleNavigate} />}
        {currentPage === 'users' && <UserManagement onNavigate={handleNavigate} />}
        {currentPage === 'analytics' && <AnalyticsPage onNavigate={handleNavigate} />}
      </Layout>
    );
  };

  return (
    <>
      {renderContent()}
      <Toaster richColors position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}