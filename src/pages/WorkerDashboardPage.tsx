import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from "../components/layout/PageHeader";
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { readStorage, writeStorage } from '../lib/storage';
import { CheckCircle } from 'lucide-react';

interface Tarea {
  id: string;
  barcoId: string;
  descripcion: string;
  trabajadorId: string;
  estado: 'pendiente' | 'completada';
  fecha: string;
}

interface Barco {
  id: string;
  nombre: string;
  tipo: string;
  dueño: string;
  ubicacion: string;
  estado: string;
}

export default function WorkerDashboardPage() {
  const navigate = useNavigate();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [barcos, setBarcos] = useState<Barco[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    const id = sessionStorage.getItem('userId');

    if (role !== 'Trabajador' || !id) {
      navigate('/login');
      return;
    }

    setUserId(id);
    loadData();
  }, [navigate]);

  const loadData = () => {
    setTareas(readStorage('yates_tareas', []) || []);
    setBarcos(readStorage('yates_barcos', []) || []);
  };

  const misTareas = tareas.filter((t) => t.trabajadorId === userId && t.estado === 'pendiente');

  const handleMarcarCompleta = (tareaId: string) => {
    const tareasActualizadas = tareas.map((t) =>
      t.id === tareaId ? { ...t, estado: 'completada' as const } : t
    );
    writeStorage('yates_tareas', tareasActualizadas);
    setTareas(tareasActualizadas);
  };

  const getBarcoNombre = (barcoId: string) => {
    return barcos.find((b) => b.id === barcoId)?.nombre || 'Desconocido';
  };

  return (
    <>
      <PageHeader
        title="Mis Tareas del Día"
        description={`${misTareas.length} tarea(s) pendiente(s)`}
      />

      {misTareas.length === 0 ? (
        <EmptyState
          title="Sin tareas pendientes"
          description="¡Excelente! Has completado todas tus tareas de hoy"
        />
      ) : (
        <Table
          columns={[
            { key: 'barco', label: 'Barco' },
            { key: 'descripcion', label: 'Descripción' },
            { key: 'estado', label: 'Estado' },
            { key: 'fecha', label: 'Fecha' },
            { key: 'accion', label: 'Acción' },
          ]}
          rows={misTareas.map((t) => ({
            barco: getBarcoNombre(t.barcoId),
            descripcion: t.descripcion,
            estado: <Badge variant="warning">Pendiente</Badge>,
            fecha: t.fecha,
            accion: (
              <Button
                onClick={() => handleMarcarCompleta(t.id)}
                size="sm"
                data-data-icon={CheckCircle}
              >
                Completar
              </Button>
            ),
          }))}
        />
      )}
    </>
  );
}