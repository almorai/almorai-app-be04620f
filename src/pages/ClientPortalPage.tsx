import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { readStorage } from '../lib/storage';

interface Barco {
  id: string;
  nombre: string;
  tipo: string;
  dueño: string;
  ubicacion: string;
  estado: string;
}

interface Tarea {
  id: string;
  barcoId: string;
  descripcion: string;
  trabajadorId: string;
  estado: 'pendiente' | 'completada';
  fecha: string;
}

interface Usuario {
  id: string;
  nombre: string;
}

export default function ClientPortalPage() {
  const navigate = useNavigate();
  const [barcos, setBarcos] = useState<Barco[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    const id = sessionStorage.getItem('userId');

    if (role !== 'Cliente' || !id) {
      navigate('/login');
      return;
    }

    setUserId(id);
    loadData();
  }, [navigate]);

  const loadData = () => {
    setBarcos(readStorage('yates_barcos', []) || []);
    setTareas(readStorage('yates_tareas', []) || []);
    setUsuarios(readStorage('yates_usuarios', []) || []);
  };

  const misBarcos = barcos.filter((b) => b.dueño === userId);

  const getTareasDelBarco = (barcoId: string) => {
    return tareas.filter((t) => t.barcoId === barcoId);
  };

  const getTrabajadorNombre = (trabajadorId: string) => {
    return usuarios.find((u) => u.id === trabajadorId)?.nombre || 'Desconocido';
  };

  return (
    <>
      <PageHeader
        title="Mi Portal de Barcos"
        description={`Tienes ${misBarcos.length} barco(s) registrado(s)`}
      />

      {misBarcos.length === 0 ? (
        <EmptyState
          title="Sin barcos registrados"
          description="Contacta al jefe de operaciones para registrar tu barco"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {misBarcos.map((barco) => {
            const tareasDelBarco = getTareasDelBarco(barco.id);
            const tareasCompletadas = tareasDelBarco.filter(
              (t) => t.estado === 'completada'
            ).length;

            return (
              <Card key={barco.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{barco.nombre}</h3>
                    <p className="text-sm text-gray-600">{barco.tipo}</p>
                  </div>
                  <Badge
                    variant={
                      barco.estado === 'Disponible'
                        ? 'success'
                        : barco.estado === 'Mantenimiento'
                          ? 'warning'
                          : 'error'
                    }
                  >
                    {barco.estado}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div>
                    <span className="text-sm text-gray-600">Ubicación:</span>
                    <p className="font-medium">{barco.ubicacion}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">
                    Tareas ({tareasCompletadas}/{tareasDelBarco.length})
                  </h4>
                  {tareasDelBarco.length === 0 ? (
                    <p className="text-sm text-gray-500">Sin tareas asignadas</p>
                  ) : (
                    <ul className="space-y-2">
                      {tareasDelBarco.map((tarea) => (
                        <li
                          key={tarea.id}
                          className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg"
                        >
                          <Badge
                            variant={
                              tarea.estado === 'completada' ? 'success' : 'warning'
                            }
                            size="sm"
                          >
                            {tarea.estado === 'completada' ? '✓' : '○'}
                          </Badge>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {tarea.descripcion}
                            </p>
                            <p className="text-xs text-gray-600">
                              Trabajador: {getTrabajadorNombre(tarea.trabajadorId)}
                            </p>
                            <p className="text-xs text-gray-500">{tarea.fecha}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}