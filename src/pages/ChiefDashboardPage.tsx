import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from "../components/layout/PageHeader";
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { readStorage, writeStorage } from '../lib/storage';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

interface Barco {
  id: string;
  nombre: string;
  tipo: string;
  dueño: string;
  ubicacion: string;
  estado: 'Disponible' | 'Mantenimiento' | 'Reparación';
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
  rol: string;
  nombre: string;
}

export default function ChiefDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'barcos' | 'tareas' | 'historial'>('barcos');
  const [barcos, setBarcos] = useState<Barco[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showBarcoForm, setShowBarcoForm] = useState(false);
  const [showTareaForm, setShowTareaForm] = useState(false);
  const [editingBarco, setEditingBarco] = useState<Barco | null>(null);
  const [filterState, setFilterState] = useState<'todos' | 'pendiente' | 'completada'>('todos');

  const [formBarco, setFormBarco] = useState<Partial<Barco>>({
    nombre: '',
    tipo: '',
    dueño: '',
    ubicacion: '',
    estado: 'Disponible',
  });

  const [formTarea, setFormTarea] = useState<Partial<Tarea>>({
    barcoId: '',
    descripcion: '',
    trabajadorId: '',
    estado: 'pendiente',
  });

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    if (role !== 'Jefe') {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = () => {
    setBarcos(readStorage('yates_barcos', []) || []);
    setTareas(readStorage('yates_tareas', []) || []);
    setUsuarios(readStorage('yates_usuarios', []) || []);
  };

  const saveBarcos = (nuevosBarcos: Barco[]) => {
    writeStorage('yates_barcos', nuevosBarcos);
    setBarcos(nuevosBarcos);
  };

  const saveTareas = (nuevasTareas: Tarea[]) => {
    writeStorage('yates_tareas', nuevasTareas);
    setTareas(nuevasTareas);
  };

  const handleSaveBarco = () => {
    if (!formBarco.nombre || !formBarco.tipo || !formBarco.dueño || !formBarco.ubicacion) {
      alert('Completa todos los campos');
      return;
    }

    if (editingBarco) {
      const updated = barcos.map((b) =>
        b.id === editingBarco.id ? { ...b, ...formBarco } : b
      ) as Barco[];
      saveBarcos(updated);
      setEditingBarco(null);
    } else {
      const newBarco: Barco = {
        id: `B${Date.now()}`,
        nombre: formBarco.nombre!,
        tipo: formBarco.tipo!,
        dueño: formBarco.dueño!,
        ubicacion: formBarco.ubicacion!,
        estado: formBarco.estado as Barco['estado'],
      };
      saveBarcos([...barcos, newBarco]);
    }

    setFormBarco({
      nombre: '',
      tipo: '',
      dueño: '',
      ubicacion: '',
      estado: 'Disponible',
    });
    setShowBarcoForm(false);
  };

  const handleEditBarco = (barco: Barco) => {
    setEditingBarco(barco);
    setFormBarco(barco);
    setShowBarcoForm(true);
  };

  const handleCancelBarco = () => {
    setShowBarcoForm(false);
    setEditingBarco(null);
    setFormBarco({
      nombre: '',
      tipo: '',
      dueño: '',
      ubicacion: '',
      estado: 'Disponible',
    });
  };

  const handleDeleteBarco = (id: string) => {
    if (confirm('¿Eliminar este barco y todas sus tareas?')) {
      saveBarcos(barcos.filter((b) => b.id !== id));
      saveTareas(tareas.filter((t) => t.barcoId !== id));
    }
  };

  const handleSaveTarea = () => {
    if (!formTarea.barcoId || !formTarea.descripcion || !formTarea.trabajadorId) {
      alert('Completa todos los campos');
      return;
    }

    const newTarea: Tarea = {
      id: `T${Date.now()}`,
      barcoId: formTarea.barcoId!,
      descripcion: formTarea.descripcion!,
      trabajadorId: formTarea.trabajadorId!,
      estado: 'pendiente',
      fecha: new Date().toISOString().split('T')[0],
    };

    saveTareas([...tareas, newTarea]);
    setFormTarea({
      barcoId: '',
      descripcion: '',
      trabajadorId: '',
      estado: 'pendiente',
    });
    setShowTareaForm(false);
  };

  const handleCancelTarea = () => {
    setShowTareaForm(false);
    setFormTarea({
      barcoId: '',
      descripcion: '',
      trabajadorId: '',
      estado: 'pendiente',
    });
  };

  const handleDeleteTarea = (id: string) => {
    if (confirm('¿Eliminar esta tarea?')) {
      saveTareas(tareas.filter((t) => t.id !== id));
    }
  };

  const trabajadores = usuarios.filter((u) => u.rol === 'Trabajador');
  const clientes = usuarios.filter((u) => u.rol === 'Cliente');
  const tareasHistorial = tareas.filter((t) => t.estado === 'completada');
  const tareasFiltered = tareas.filter((t) =>
    filterState === 'todos'
      ? true
      : t.estado === filterState
  );

  const getBarcoNombre = (barcoId: string) => {
    return barcos.find((b) => b.id === barcoId)?.nombre || 'Desconocido';
  };

  const getTrabajadorNombre = (trabajadorId: string) => {
    return usuarios.find((u) => u.id === trabajadorId)?.nombre || 'Desconocido';
  };

  return (
    <>
      <PageHeader
        title="Panel del Jefe de Operaciones"
        description="Gestión de barcos, tareas e historial"
      />

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('barcos')}
          className={`py-2 px-4 font-medium border-b-2 transition ${
            activeTab === 'barcos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Barcos
        </button>
        <button
          onClick={() => setActiveTab('tareas')}
          className={`py-2 px-4 font-medium border-b-2 transition ${
            activeTab === 'tareas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Tareas
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`py-2 px-4 font-medium border-b-2 transition ${
            activeTab === 'historial'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Historial
        </button>
      </div>

      {/* TAB: Barcos */}
      {activeTab === 'barcos' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Barcos registrados</h2>
            <Button
              onClick={() => {
                setEditingBarco(null);
                setFormBarco({
                  nombre: '',
                  tipo: '',
                  dueño: '',
                  ubicacion: '',
                  estado: 'Disponible',
                });
                setShowBarcoForm(true);
              }}
              data-data-icon={Plus}
            >
              Nuevo Barco
            </Button>
          </div>

          {showBarcoForm && (
            <Card className="p-6 bg-blue-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingBarco ? 'Editar Barco' : 'Crear Nuevo Barco'}
                </h3>
                <button
                  onClick={handleCancelBarco}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del barco
                  </label>
                  <Input
                    value={formBarco.nombre || ''}
                    onChange={(e) =>
                      setFormBarco({ ...formBarco, nombre: e.target.value })
                    }
                    placeholder="Ej: Nautilus"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de barco
                  </label>
                  <Input
                    value={formBarco.tipo || ''}
                    onChange={(e) =>
                      setFormBarco({ ...formBarco, tipo: e.target.value })
                    }
                    placeholder="Ej: Velero, Lancha, Yate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dueño (Cliente)
                  </label>
                  <select
                    value={formBarco.dueño || ''}
                    onChange={(e) =>
                      setFormBarco({ ...formBarco, dueño: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} ({cliente.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación
                  </label>
                  <Input
                    value={formBarco.ubicacion || ''}
                    onChange={(e) =>
                      setFormBarco({ ...formBarco, ubicacion: e.target.value })
                    }
                    placeholder="Ej: Puerto A, Dársena 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formBarco.estado || 'Disponible'}
                    onChange={(e) =>
                      setFormBarco({
                        ...formBarco,
                        estado: e.target.value as Barco['estado'],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Reparación">Reparación</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveBarco} className="flex-1">
                    {editingBarco ? 'Actualizar' : 'Crear'}
                  </Button>
                  <Button
                    onClick={handleCancelBarco}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {barcos.length === 0 ? (
            <EmptyState
              title="Sin barcos registrados"
              description="Crea tu primer barco para comenzar"
            />
          ) : (
            <Table
              columns={[
                { key: 'nombre', label: 'Nombre' },
                { key: 'tipo', label: 'Tipo' },
                { key: 'dueño', label: 'Dueño' },
                { key: 'ubicacion', label: 'Ubicación' },
                { key: 'estado', label: 'Estado' },
                { key: 'acciones', label: 'Acciones' },
              ]}
              rows={barcos.map((barco) => {
                const dueno = usuarios.find((u) => u.id === barco.dueño);
                return {
                  nombre: barco.nombre,
                  tipo: barco.tipo,
                  dueño: dueno?.nombre || 'Desconocido',
                  ubicacion: barco.ubicacion,
                  estado: (
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
                  ),
                  acciones: (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditBarco(barco)}
                        size="sm"
                        variant="secondary"
                        data-data-icon={Edit2}
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteBarco(barco.id)}
                        size="sm"
                        variant="danger"
                        data-data-icon={Trash2}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ),
                };
              })}
            />
          )}
        </div>
      )}

      {/* TAB: Tareas */}
      {activeTab === 'tareas' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <h2 className="text-xl font-bold text-gray-900">Tareas</h2>
              <select
                value={filterState}
                onChange={(e) =>
                  setFilterState(e.target.value as 'todos' | 'pendiente' | 'completada')
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              >
                <option value="todos">Todas</option>
                <option value="pendiente">Pendientes</option>
                <option value="completada">Completadas</option>
              </select>
            </div>
            <Button
              onClick={() => setShowTareaForm(true)}
              data-data-icon={Plus}
            >
              Nueva Tarea
            </Button>
          </div>

          {showTareaForm && (
            <Card className="p-6 bg-blue-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Crear Nueva Tarea</h3>
                <button
                  onClick={handleCancelTarea}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barco
                  </label>
                  <select
                    value={formTarea.barcoId || ''}
                    onChange={(e) =>
                      setFormTarea({ ...formTarea, barcoId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  >
                    <option value="">Selecciona un barco</option>
                    {barcos.map((barco) => (
                      <option key={barco.id} value={barco.id}>
                        {barco.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <Input
                    value={formTarea.descripcion || ''}
                    onChange={(e) =>
                      setFormTarea({ ...formTarea, descripcion: e.target.value })
                    }
                    placeholder="Ej: Revisar motor, Cambiar aceite"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asignar a trabajador
                  </label>
                  <select
                    value={formTarea.trabajadorId || ''}
                    onChange={(e) =>
                      setFormTarea({ ...formTarea, trabajadorId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  >
                    <option value="">Selecciona un trabajador</option>
                    {trabajadores.map((trabajador) => (
                      <option key={trabajador.id} value={trabajador.id}>
                        {trabajador.nombre} ({trabajador.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveTarea} className="flex-1">
                    Crear Tarea
                  </Button>
                  <Button
                    onClick={handleCancelTarea}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {tareasFiltered.length === 0 ? (
            <EmptyState
              title={filterState === 'completada' ? 'Sin tareas completadas' : 'Sin tareas'}
              description="Crea tareas para asignarlas a los trabajadores"
            />
          ) : (
            <Table
              columns={[
                { key: 'barco', label: 'Barco' },
                { key: 'descripcion', label: 'Descripción' },
                { key: 'trabajador', label: 'Trabajador' },
                { key: 'estado', label: 'Estado' },
                { key: 'fecha', label: 'Fecha' },
                { key: 'acciones', label: 'Acciones' },
              ]}
              rows={tareasFiltered.map((tarea) => ({
                barco: getBarcoNombre(tarea.barcoId),
                descripcion: tarea.descripcion,
                trabajador: getTrabajadorNombre(tarea.trabajadorId),
                estado: (
                  <Badge
                    variant={tarea.estado === 'completada' ? 'success' : 'warning'}
                  >
                    {tarea.estado === 'completada' ? 'Completada' : 'Pendiente'}
                  </Badge>
                ),
                fecha: tarea.fecha,
                acciones: (
                  <Button
                    onClick={() => handleDeleteTarea(tarea.id)}
                    size="sm"
                    variant="danger"
                    data-data-icon={Trash2}
                  >
                    Eliminar
                  </Button>
                ),
              }))}
            />
          )}
        </div>
      )}

      {/* TAB: Historial */}
      {activeTab === 'historial' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Historial de tareas completadas</h2>

          {tareasHistorial.length === 0 ? (
            <EmptyState
              title="Sin historial"
              description="Las tareas completadas aparecerán aquí"
            />
          ) : (
            <Table
              columns={[
                { key: 'barco', label: 'Barco' },
                { key: 'descripcion', label: 'Descripción' },
                { key: 'trabajador', label: 'Trabajador' },
                { key: 'fecha', label: 'Fecha' },
              ]}
              rows={tareasHistorial.map((tarea) => ({
                barco: getBarcoNombre(tarea.barcoId),
                descripcion: tarea.descripcion,
                trabajador: getTrabajadorNombre(tarea.trabajadorId),
                fecha: tarea.fecha,
              }))}
            />
          )}
        </div>
      )}
    </>
  );
}