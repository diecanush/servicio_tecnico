import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import ClientesPanel from '../components/ClientesPanel';
import OficinasPanel from '../components/OficinasPanel';
import DispositivosPanel from '../components/DispositivosPanel';
import ServiciosPanel from '../components/ServiciosPanel';
import UsuariosPanel from '../components/UsuariosPanel';
import CambiarContraseña from '../components/CambiarContraseña';

export default function Panel() {
  const { usuario, logout, can } = useAuth();
  const navigate = useNavigate();
  const [vista, setVista] = useState<string>('');

  const cerrarSesion = () => {
    const confirmar = window.confirm('¿Estás seguro de que querés cerrar sesión?');
    if (confirmar) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className='root'>
      <h2>Bienvenido, {usuario?.nombre}</h2>
      <p>Rol: {usuario?.rol}</p>

      <div className='panel-header'>
        {/* 🔒 botones visibles solo si el usuario tiene permiso de VER */}

        {can?.('clientes_ver') && (
          <button onClick={() => setVista('clientes')}>Clientes</button>
        )}{' '}

        {can?.('oficinas_ver') && (
          <button onClick={() => setVista('oficinas')}>Oficinas</button>
        )}{' '}

        {can?.('dispositivos_ver') && (
          <button onClick={() => setVista('dispositivos')}>Dispositivos</button>
        )}{' '}

        {can?.('servicios_ver') && (
          <button onClick={() => setVista('servicios')}>Servicios</button>
        )}{' '}

        {can?.('usuarios_ver') && (
          <button onClick={() => setVista('usuarios')}>Usuarios</button>
        )}{' '}

        {can?.('cambiar_contraseña') && (
          <button onClick={() => setVista('cambiarPassword')}>
            Cambiar contraseña
          </button>
        )}{' '}

        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

      {/* 🔒 Mostrar el componente solo si también tiene permiso */}
      {vista === 'clientes' && can?.('clientes_ver') && <ClientesPanel />}
      {vista === 'oficinas' && can?.('oficinas_ver') && <OficinasPanel />}
      {vista === 'dispositivos' && can?.('dispositivos_ver') && <DispositivosPanel />}
      {vista === 'servicios' && can?.('servicios_ver') && <ServiciosPanel />}
      {vista === 'usuarios' && can?.('usuarios_ver') && <UsuariosPanel />}
      {vista === 'cambiarPassword' && can?.('cambiar_contraseña') && <CambiarContraseña />}
    </div>
  );
}
