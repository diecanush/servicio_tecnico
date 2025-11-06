import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type Rol = 'admin' | 'tecnico' | 'cliente';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}

type Permiso = string;

const ROLE_PERMISSIONS: Record<Rol, string[]> = {
  admin: [
    // Oficinas
    'oficinas_ver', 'oficinas_crud',
    // Dispositivos
    'dispositivos_ver', 'dispositivos_crud',
    // Servicios
    'servicios_ver', 'servicios_crud',
    // Usuarios
    'usuarios_ver', 'usuarios_crud',
    // Clientes
    'clientes_ver', 'clientes_crud',
    // Config
    'cambiar_contraseña',
  ],

  tecnico: [
    // Oficinas (solo ver)
    'oficinas_ver',
    // Dispositivos
    'dispositivos_ver', 'dispositivos_crud',
    // Servicios
    'servicios_ver', 'servicios_crud',
    // Config
    'cambiar_contraseña',
  ],

  cliente: [
    // Servicios (solo ver los propios)
    'servicios_mios_ver',
    // Config
    'cambiar_contraseña',
  ],
};

interface AuthContextProps {
  token: string | null;
  usuario: Usuario | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;

  // extras no obligatorios para los paneles actuales
  isAuthenticated?: boolean;
  hasRole?: (roles: Rol[] | Rol) => boolean;
  can?: (permiso: Permiso) => boolean;
}

// 👉 mantenemos el NOMBRE y la forma básica (retrocompatible)
export const AuthContext = createContext<AuthContextProps>({
  token: null,
  usuario: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const raw = localStorage.getItem('usuario');
    return raw ? (JSON.parse(raw) as Usuario) : null;
  });

  const login = (nuevoToken: string, datosUsuario: Usuario) => {
    localStorage.setItem('token', nuevoToken);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
    setToken(nuevoToken);
    setUsuario(datosUsuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem('token'));
      const raw = localStorage.getItem('usuario');
      setUsuario(raw ? JSON.parse(raw) : null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isAuthenticated = !!token;
  const hasRole = (roles: Rol[] | Rol) => {
    if (!usuario) return false;
    const arr = Array.isArray(roles) ? roles : [roles];
    return arr.includes(usuario.rol);
  };
  const can = (permiso: Permiso) => {
    if (!usuario) return false;
    const permisos = ROLE_PERMISSIONS[usuario.rol] ?? [];
    return permisos.includes(permiso) || permisos.includes('ver_todo') || permisos.includes('editar_todo');
  };

  const value: AuthContextProps = useMemo(
    () => ({ token, usuario, login, logout, isAuthenticated, hasRole, can }),
    [token, usuario]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
