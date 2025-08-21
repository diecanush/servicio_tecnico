import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClientesPanel from '../components/ClientesPanel';
import OficinasPanel from '../components/OficinasPanel';
import DispositivosPanel from '../components/DispositivosPanel';
import ServiciosPanel from '../components/ServiciosPanel';
import UsuariosPanel from '../components/UsuariosPanel';


export default function Panel() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [vista, setVista] = useState<string>(''); // 👈 definir el estado de vista

  /** CONFIRMAR PARA CERRAR SESION */
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
        <button onClick={() => setVista('clientes')}>Clientes</button>{' '}
        <button onClick={() => setVista('oficinas')}>Oficinas</button>{' '}
        <button onClick={() => setVista('dispositivos')}>Dispositivos</button>{' '}
        <button onClick={() => setVista('servicios')}>Servicios</button>{' '}
        <button onClick={() => setVista('usuarios')}>Usuarios</button>{' '}
        {/* BOTON PARA CERRAR SESION */}
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

      {/* Mostrar componente según vista seleccionada */}
      {vista === 'clientes' && <ClientesPanel />}
      {vista === 'oficinas' && <OficinasPanel />}
      {vista === 'dispositivos' && <DispositivosPanel />}
      {vista === 'servicios' && <ServiciosPanel />}
      {vista === 'usuarios' && <UsuariosPanel />}
    </div>
  );
}
