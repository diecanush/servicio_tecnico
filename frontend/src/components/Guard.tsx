// src/components/Guard.tsx
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

type Rol = 'admin' | 'tecnico' | 'cliente';

type RequirePermProps = {
  permiso: string;
  children: ReactNode;
};

type RequireRoleProps = {
  roles: Rol[];
  children: ReactNode;
};

export function RequirePerm({ permiso, children }: RequirePermProps) {
  const { can } = useAuth();
  if (!can) return null;
  return can(permiso) ? <>{children}</> : null;
}

export function RequireRole({ roles, children }: RequireRoleProps) {
  const { hasRole } = useAuth();
  if (!hasRole) return null;
  return hasRole(roles) ? <>{children}</> : null;
}
