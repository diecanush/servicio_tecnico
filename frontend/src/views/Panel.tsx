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

  const puedeVerClientes = can?.('clientes_ver');
  const puedeVerOficinas = can?.('oficinas_ver');
  const puedeVerDispositivos = can?.('dispositivos_ver');
  const puedeVerServicios = can?.('servicios_ver') || can?.('servicios_mios_ver');
  const puedeVerUsuarios = can?.('usuarios_ver');
  const puedeCambiarPassword = can?.('cambiar_contraseña');

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

        {puedeVerClientes && (
          <button onClick={() => setVista('clientes')}>Clientes</button>
        )}{' '}

        {puedeVerOficinas && (
          <button onClick={() => setVista('oficinas')}>Oficinas</button>
        )}{' '}

        {puedeVerDispositivos && (
          <button onClick={() => setVista('dispositivos')}>Dispositivos</button>
        )}{' '}

        {puedeVerServicios && (
          <button onClick={() => setVista('servicios')}>
            {can?.('servicios_ver') ? 'Servicios' : 'Mis servicios'}
          </button>
        )}{' '}

        {puedeVerUsuarios && (
          <button onClick={() => setVista('usuarios')}>Usuarios</button>
        )}{' '}

        {puedeCambiarPassword && (
          <button onClick={() => setVista('cambiarPassword')}>
            Cambiar contraseña
          </button>
        )}{' '}

        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

      {/* 🔒 Mostrar el componente solo si también tiene permiso */}
      {vista === 'clientes' && puedeVerClientes && <ClientesPanel />}
      {vista === 'oficinas' && puedeVerOficinas && <OficinasPanel />}
      {vista === 'dispositivos' && puedeVerDispositivos && <DispositivosPanel />}
      {vista === 'servicios' && puedeVerServicios && <ServiciosPanel />}
      {vista === 'usuarios' && puedeVerUsuarios && <UsuariosPanel />}
      {vista === 'cambiarPassword' && puedeCambiarPassword && <CambiarContraseña />}
    </div>
  );
}
