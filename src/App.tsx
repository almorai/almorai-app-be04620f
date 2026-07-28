import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import ChiefDashboardPage from './pages/ChiefDashboardPage';
import WorkerDashboardPage from './pages/WorkerDashboardPage';
import ClientPortalPage from './pages/ClientPortalPage';
import NotFoundPage from './pages/NotFoundPage';
import { readStorage, writeStorage } from './lib/storage';
import seedData from './data/seed.json';

function ProtectedRoute({ requiredRole, element }: { requiredRole: string; element: JSX.Element }) {
  const role = sessionStorage.getItem('userRole');
  const userId = sessionStorage.getItem('userId');

  if (!role || !userId || role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return element;
}

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeData = () => {
      const barcos = readStorage('yates_barcos', []);
      const tareas = readStorage('yates_tareas', []);
      const usuarios = readStorage('yates_usuarios', []);

      if (!barcos || barcos.length === 0) {
        writeStorage('yates_barcos', seedData.barcos);
      }
      if (!tareas || tareas.length === 0) {
        writeStorage('yates_tareas', seedData.tareas);
      }
      if (!usuarios || usuarios.length === 0) {
        writeStorage('yates_usuarios', seedData.usuarios);
      }

      setIsInitialized(true);
    };

    initializeData();
  }, []);

  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/chief/*"
          element={<ProtectedRoute requiredRole="Jefe" element={<ChiefDashboardPage />} />}
        />
        <Route
          path="/worker/*"
          element={<ProtectedRoute requiredRole="Trabajador" element={<WorkerDashboardPage />} />}
        />
        <Route
          path="/client/*"
          element={<ProtectedRoute requiredRole="Cliente" element={<ClientPortalPage />} />}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
}

export default App;