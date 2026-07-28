import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Ship } from 'lucide-react';
import { readStorage } from '../lib/storage';

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'Jefe' | 'Trabajador' | 'Cliente' | null>(null);
  const [userId, setUserId] = useState('');
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    // Limpiar sesión previa si existe
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
    
    const loadedUsuarios = readStorage('yates_usuarios', []) || [];
    setUsuarios(loadedUsuarios);
  }, []);

  const roleUsers = usuarios.filter((u: any) => u.rol === selectedRole);

  const handleLogin = () => {
    if (!selectedRole || !userId) {
      alert('Por favor selecciona un rol y usuario');
      return;
    }

    // Validar que el userId existe en roleUsers
    const userExists = roleUsers.find((u: any) => u.id === userId);
    if (!userExists) {
      alert('Usuario no válido para este rol');
      return;
    }

    sessionStorage.setItem('userRole', selectedRole);
    sessionStorage.setItem('userId', userId);

    const redirects: Record<string, string> = {
      Jefe: '/chief',
      Trabajador: '/worker',
      Cliente: '/client',
    };

    navigate(redirects[selectedRole]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Ship className="w-12 h-12 text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">Yate Manager</h1>
          <p className="text-gray-600 text-sm">Gestión de mantenimiento de yates</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona tu rol
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Jefe', 'Trabajador', 'Cliente'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    setUserId('');
                  }}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                    selectedRole === role
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {selectedRole && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona usuario ({selectedRole})
              </label>
              <div className="space-y-2">
                {roleUsers.length > 0 ? (
                  roleUsers.map((user: any) => (
                    <button
                      key={user.id}
                      onClick={() => setUserId(user.id)}
                      className={`w-full py-2 px-3 rounded-lg text-left transition ${
                        userId === user.id
                          ? 'bg-blue-100 border-2 border-blue-600'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{user.nombre}</div>
                      <div className="text-xs text-gray-500">ID: {user.id}</div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No hay usuarios para este rol</p>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={handleLogin}
            disabled={!selectedRole || !userId}
            className="w-full"
          >
            Entrar
          </Button>
        </div>
      </Card>
    </div>
  );
}