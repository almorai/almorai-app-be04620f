import { BarChart3, Ship, CheckSquare, LogOut, History } from 'lucide-react';

export const getNavigation = (role: string | null) => {
  const baseNav = [
    {
      label: 'Dashboard',
      href: role === 'Jefe' ? '/chief' : role === 'Trabajador' ? '/worker' : '/client',
      icon: BarChart3,
    },
  ];

  const roleNav: Record<string, any[]> = {
    Jefe: [
      { label: 'Barcos', href: '/chief#barcos', icon: Ship },
      { label: 'Tareas', href: '/chief#tareas', icon: CheckSquare },
      { label: 'Historial', href: '/chief#historial', icon: History },
    ],
    Trabajador: [
      { label: 'Mis Tareas', href: '/worker', icon: CheckSquare },
    ],
    Cliente: [
      { label: 'Mi Portal', href: '/client', icon: Ship },
    ],
  };

  const logout = [
    {
      label: 'Salir',
      href: '/login',
      icon: LogOut,
      onClick: () => {
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('userId');
      },
    },
  ];

  return [
    ...baseNav,
    ...(role && roleNav[role] ? roleNav[role] : []),
    ...logout,
  ];
};

export const navItems = getNavigation(
  typeof sessionStorage !== "undefined" ? sessionStorage.getItem("userRole") : null
);
