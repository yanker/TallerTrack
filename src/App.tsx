import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { SignInForm } from './SignInForm';
import { SignOutButton } from './SignOutButton';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { MaintenanceRecords } from './components/MaintenanceRecords';
import { Vehicles } from './components/Vehicles';
import { ScheduledMaintenance } from './components/ScheduledMaintenance';
import { Users } from './components/Users';
import { Dashboard } from './components/Dashboard';
import { Notes } from './components/Notes';
import { Guide } from './Guide';
import { AdminTools } from './components/AdminTools';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const user = useQuery(api.auth.loggedInUser);

  // Install PWA prompt
  useEffect(() => {
    let deferredPrompt: any;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  // Check if we're on the guide page
  const isGuidePath = window.location.pathname === '/guide';
  
  if (isGuidePath) {
    return <Guide />;
  }

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <img src="/favicon-96x96.png" alt="TallerTracker Logo" className="mx-auto mb-4 w-24 h-24" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">TallerTracker</h1>
              <p className="text-gray-600">Gestiona el mantenimiento de tus vehículos</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="pb-20">
          {/* Header */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="px-4 py-3 flex justify-start items-center gap-4">
              <img src="/favicon-96x96.png" alt="TallerTracker Logo" className="w-12 h-12" />
              <h1 className="text-xl font-semibold text-gray-900">TallerTracker</h1>
              <div className="flex-1 flex justify-end items-center gap-2">
                {/* <span className="text-sm text-gray-600">{user?.name || user?.email}</span> */}
                <SignOutButton />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-4">            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'maintenance' && <MaintenanceRecords />}
            {activeTab === 'vehicles' && <Vehicles />}
            {activeTab === 'scheduled' && <ScheduledMaintenance />}
            {activeTab === 'users' && user?.role === 'ADMIN' && <Users />}
            {activeTab === 'admin' && user?.role === 'ADMIN' && <AdminTools />}
            {activeTab === 'notes' && <Notes />}
          </main>

          {/* Bottom Navigation */}          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <div className={`grid ${user?.role === 'ADMIN' ? 'grid-cols-7' : 'grid-cols-5'}`}>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`p-3 text-center ${activeTab === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
              >
                <div className="text-xl mb-1">📊</div>
                <div className="text-xs">Dashboard</div>
              </button>

              <button
                onClick={() => setActiveTab('maintenance')}
                className={`p-3 text-center ${activeTab === 'maintenance' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
              >
                <div className="text-xl mb-1">🔧</div>
                <div className="text-xs">Mantenimiento</div>
              </button>

              <button
                onClick={() => setActiveTab('vehicles')}
                className={`p-3 text-center ${activeTab === 'vehicles' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
              >
                <div className="text-xl mb-1">🚗</div>
                <div className="text-xs">Vehículos</div>
              </button>

              <button
                onClick={() => setActiveTab('scheduled')}
                className={`p-3 text-center ${activeTab === 'scheduled' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
              >
                <div className="text-xl mb-1">📅</div>
                <div className="text-xs">Programado</div>
              </button>              {user?.role === 'ADMIN' && (
                <>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`p-3 text-center ${activeTab === 'users' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                >
                  <div className="text-xl mb-1">👥</div>
                  <div className="text-xs">Usuarios</div>
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`p-3 text-center ${activeTab === 'admin' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                >
                  <div className="text-xl mb-1">⚙️</div>
                  <div className="text-xs">Admin</div>
                </button>
                </>
              )}

              <button
                onClick={() => setActiveTab('notes')}
                className={`p-3 text-center ${activeTab === 'notes' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
              >
                <div className="text-xl mb-1">📝</div>
                <div className="text-xs">Notas</div>
              </button>
            </div>
          </nav>
        </div>
      </Authenticated>

      <Toaster />
    </div>
  );
}
