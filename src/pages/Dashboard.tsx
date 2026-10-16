import React, { useState, useEffect } from 'react';

export const Dashboard = () => {
  // Estado dinámico del usuario autenticado
  const [userLogged, setUserLogged] = useState({
    nombre: '',
    correo: '',
    rol: '',
  });

  // Estados del filtro para el Dashboard de la Contadora
  const [filtroTipo, setFiltroTipo] = useState('Todas');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [filtroFuncionario, setFiltroFuncionario] = useState('');
  const [porExpirarChecked, setPorExpirarChecked] = useState(false);
  const [caducadasChecked, setCaducadasChecked] = useState(false);

  // Estados del Dashboard Administrador / General
  const [activeTabAdmin, setActiveTabAdmin] = useState('usuarios');
  const [searchTermAdmin, setSearchTermAdmin] = useState('');

  // ---------------- GESTIÓN DE USUARIOS (ESTADOS Y MODALES) ----------------
  const [usuariosAdmin, setUsuariosAdmin] = useState([
    { id: 1, cedula: '1712345678', nombre: 'Héctor Sislema', correo: 'hector.sislema@iti.edu.ec', rol: 'Funcionario', jefe: 'Henry Bonilla', estado: 'Activo', intentos: 0 },
    { id: 2, cedula: '1723456789', nombre: 'Henry Bonilla', correo: 'henry.bonilla@iti.edu.ec', rol: 'Jefe Inmediato', jefe: '—', estado: 'Activo', intentos: 0 },
    { id: 3, cedula: '1734567890', nombre: 'Kelly Aguallo', correo: 'kelly.aguallo@iti.edu.ec', rol: 'Director Financiero', jefe: '—', estado: 'Activo', intentos: 0 },
    { id: 4, cedula: '1745678901', nombre: 'Nancy Cedeño', correo: 'nancy.cedeno@iti.edu.ec', rol: 'Contadora', jefe: '—', estado: 'Activo', intentos: 0 },
    { id: 5, cedula: '1756789012', nombre: 'Rocío Rosales', correo: 'rocio.rosales@iti.edu.ec', rol: 'Colectora', jefe: '—', estado: 'Bloqueado', intentos: 3 },
    { id: 6, cedula: '1767890123', nombre: 'María Calderón', correo: 'maria.calderon@iti.edu.ec', rol: 'Asistente Contable', jefe: '—', estado: 'Activo', intentos: 0 },
    { id: 7, cedula: '1778901234', nombre: 'Lizbeth Paredes', correo: 'lizbeth.paredes@iti.edu.ec', rol: 'Administrador', jefe: '—', estado: 'Activo', intentos: 0 },
    { id: 8, cedula: '1789012345', nombre: 'Patricio Sislema', correo: 'patricio.sislema@iti.edu.ec', rol: 'Funcionario', jefe: 'Henry Bonilla', estado: 'Activo', intentos: 0 },
    { id: 9, cedula: '1790123456', nombre: 'Javier Luis', correo: 'javier.luis@iti.edu.ec', rol: 'Funcionario', jefe: 'Henry Bonilla', estado: 'Activo', intentos: 0 },
  ]);

  // Modales
  const [showModalNuevo, setShowModalNuevo] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<any>(null);

  // Formulario de Usuario
  const [formUsuario, setFormUsuario] = useState({
    cedula: '',
    nombre: '',
    correo: '',
    rol: 'Funcionario',
    jefe: '—',
  });

  // 1. LECTURA AUTOMÁTICA DE SESIÓN AL INGRESAR
  useEffect(() => {
    const correoGuardado = (
      localStorage.getItem('correo') || 
      localStorage.getItem('email') || 
      ''
    ).toLowerCase().trim();

    let nombreGuardado = localStorage.getItem('nombre') || localStorage.getItem('user') || '';
    let rolGuardado = localStorage.getItem('rol') || localStorage.getItem('role') || '';

    if (correoGuardado === 'nancy.cedeno@iti.edu.ec') {
      nombreGuardado = 'Nancy Cedeño';
      rolGuardado = 'Contadora';
    } else if (correoGuardado === 'henry.bonilla@iti.edu.ec') {
      nombreGuardado = 'Henry Bonilla';
      rolGuardado = 'Jefe Inmediato';
    } else if (correoGuardado === 'hector.sislema@iti.edu.ec') {
      nombreGuardado = 'Héctor Sislema';
      rolGuardado = 'Funcionario';
    } else if (correoGuardado === 'kelly.aguallo@iti.edu.ec') {
      nombreGuardado = 'Kelly Aguallo';
      rolGuardado = 'Director Financiero';
    } else if (correoGuardado === 'rocio.rosales@iti.edu.ec') {
      nombreGuardado = 'Rocío Rosales';
      rolGuardado = 'Colectora';
    } else if (correoGuardado === 'maria.calderon@iti.edu.ec') {
      nombreGuardado = 'María Calderón';
      rolGuardado = 'Asistente Contable';
    } else if (correoGuardado === 'lizbeth.paredes@iti.edu.ec') {
      nombreGuardado = 'Lizbeth Paredes';
      rolGuardado = 'Administrador';
    } else if (correoGuardado === 'patricio.sislema@iti.edu.ec') {
      nombreGuardado = 'Patricio Sislema';
      rolGuardado = 'Funcionario';
    } else if (correoGuardado === 'javier.luis@iti.edu.ec') {
      nombreGuardado = 'Javier Luis';
      rolGuardado = 'Funcionario';
    } else {
      if (!nombreGuardado) nombreGuardado = correoGuardado ? correoGuardado.split('@')[0] : 'Usuario';
      if (!rolGuardado) rolGuardado = 'Administrador';
    }

    setUserLogged({
      nombre: nombreGuardado,
      correo: correoGuardado,
      rol: rolGuardado,
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const limpiarFiltrosContadora = () => {
    setFiltroTipo('Todas');
    setFechaDesde('');
    setFechaHasta('');
    setFiltroFuncionario('');
    setPorExpirarChecked(false);
    setCaducadasChecked(false);
  };

  const handleNotificar = (tramiteNo: string, correo: string) => {
    alert(`Se ha enviado una notificación de alerta para el trámite ${tramiteNo} a ${correo}`);
  };

  // ---------------- FUNCIONES DE ACCIONES PARA USUARIOS ----------------
  const handleCrearUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsuario.cedula || !formUsuario.nombre || !formUsuario.correo) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const nuevoUsuario = {
      id: usuariosAdmin.length + 1,
      cedula: formUsuario.cedula,
      nombre: formUsuario.nombre,
      correo: formUsuario.correo,
      rol: formUsuario.rol,
      jefe: formUsuario.jefe,
      estado: 'Activo',
      intentos: 0,
    };

    setUsuariosAdmin([...usuariosAdmin, nuevoUsuario]);
    setShowModalNuevo(false);
    setFormUsuario({ cedula: '', nombre: '', correo: '', rol: 'Funcionario', jefe: '—' });
    alert(`Usuario ${nuevoUsuario.nombre} creado exitosamente.`);
  };

  const handleAbrirEditar = (user: any) => {
    setUsuarioEditar(user);
    setFormUsuario({
      cedula: user.cedula,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
      jefe: user.jefe,
    });
    setShowModalEditar(true);
  };

  const handleGuardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    setUsuariosAdmin(usuariosAdmin.map(u => u.id === usuarioEditar.id ? { ...u, ...formUsuario } : u));
    setShowModalEditar(false);
    alert(`Datos del usuario ${formUsuario.nombre} actualizados correctamente.`);
  };

  const handleResetPassword = (nombre: string, correo: string) => {
    alert(`Se ha enviado un enlace de restablecimiento de contraseña temporal a ${correo} (${nombre}).`);
  };

  const handleDesbloquear = (id: number, nombre: string) => {
    setUsuariosAdmin(usuariosAdmin.map(u => u.id === id ? { ...u, estado: 'Activo', intentos: 0 } : u));
    alert(`El usuario ${nombre} ha sido desbloqueado con éxito.`);
  };

  const handleEliminarUsuario = (id: number, nombre: string) => {
    if (window.confirm(`¿Está seguro de que desea eliminar al usuario ${nombre}?`)) {
      setUsuariosAdmin(usuariosAdmin.filter(u => u.id !== id));
      alert(`Usuario ${nombre} eliminado.`);
    }
  };

  // REGLA AUTOMÁTICA: Si el usuario es Nancy Cedeño, entra al panel de Contabilidad
  const esContadora = 
    userLogged.correo === 'nancy.cedeno@iti.edu.ec' || 
    userLogged.rol.toLowerCase() === 'contadora';

  // Datos de prueba para tablas secundarias
  const solicitudesContadora = [
    { no: 'TR-001', funcionario: 'Juan Pérez', correo: 'juan.perez@iti.edu.ec', telefono: '0991234567', tipo: 'Solicitud', monto: '250,00 $', fechaTransf: '2026-10-08', diasRestantes: '4 días', estado: 'Pendiente' },
    { no: 'TR-002', funcionario: 'María López', correo: 'maria.lopez@iti.edu.ec', telefono: '0987654321', tipo: 'Liquidación', monto: '180,00 $', fechaTransf: '2026-10-05', diasRestantes: '2 días', estado: 'Por expirar' },
    { no: 'TR-003', funcionario: 'Carlos Ruiz', correo: 'carlos.ruiz@iti.edu.ec', telefono: '0991112233', tipo: 'Solicitud', monto: '320,00 $', fechaTransf: '2026-10-01', diasRestantes: '—', estado: 'Aprobado' },
    { no: 'TR-004', funcionario: 'Ana Torres', correo: 'ana.torres@iti.edu.ec', telefono: '0984445566', tipo: 'Liquidación', monto: '95,00 $', fechaTransf: '30/09/2026', diasRestantes: 'Caducada', estado: 'Caducada' },
    { no: 'TR-005', funcionario: 'Luis Gómez', correo: 'luis.gomez@iti.edu.ec', telefono: '0998887766', tipo: 'Solicitud', monto: '410,00 $', fechaTransf: '2026-10-09', diasRestantes: '5 días', estado: 'Pendiente' },
  ];

  const rolesAdmin = [
    { id: 1, nombre: 'Funcionario', descripcion: 'Funcionario de la institución' },
    { id: 2, nombre: 'Jefe Inmediato', descripcion: 'Aprueba solicitudes de personal a cargo' },
    { id: 3, nombre: 'Director Financiero', descripcion: 'Aprobación financiera de anticipos' },
    { id: 4, nombre: 'Contadora', descripcion: 'Verificación contable' },
    { id: 5, nombre: 'Colectora', descripcion: 'Registro de transferencias' },
    { id: 6, nombre: 'Asistente Contable', descripcion: 'Revisión documental de liquidaciones' },
    { id: 7, nombre: 'Administrador', descripcion: 'Acceso total al sistema y parámetros' },
  ];

  const tiposTramiteAdmin = [
    { id: 1, nombre: 'Solicitud de Anticipo', descripcion: 'Trámite inicial de petición de fondos' },
    { id: 2, nombre: 'Liquidación de Anticipo', descripcion: 'Justificación de gastos realizados' },
  ];

  const tramitesAdmin = [
    { id: 1, tipo: 'Solicitud de Anticipo', usuario: 'Héctor Sislema', fecha: '2026-10-10', estado: 'Pendiente', monto: '$250.00' },
  ];

  const notificacionesAdmin = [
    { id: 1, canal: 'Telegram', destinatario: 'Héctor Sislema', mensaje: 'Su solicitud #128 fue recibida.', fecha: '2026-10-10 09:15' },
    { id: 2, canal: 'Correo', destinatario: 'henry.bonilla@iti.edu.ec', mensaje: 'Tienes una solicitud pendiente por aprobar.', fecha: '2026-10-10 09:16' },
  ];

  const auditoriaAdmin = [
    { id: 1, usuario: 'Héctor Sislema', accion: 'Inicio de sesión', ip: '192.168.1.10', fecha: '2026-10-10 09:15:00' },
    { id: 2, usuario: 'Lizbeth Paredes', accion: 'Creación de usuario', ip: '192.168.1.15', fecha: '2026-10-10 08:30:22' },
  ];

  // Filtrado de usuarios por buscador
  const usuariosFiltrados = usuariosAdmin.filter(u => 
    u.nombre.toLowerCase().includes(searchTermAdmin.toLowerCase()) ||
    u.correo.toLowerCase().includes(searchTermAdmin.toLowerCase()) ||
    u.cedula.includes(searchTermAdmin) ||
    u.rol.toLowerCase().includes(searchTermAdmin.toLowerCase())
  );

  // Filtrado Contadora
  const solicitudesFiltradasContadora = solicitudesContadora.filter((item) => {
    const coincideTipo = filtroTipo === 'Todas' || item.tipo.toLowerCase().includes(filtroTipo.toLowerCase());
    const coincideFuncionario = filtroFuncionario === '' || 
      item.funcionario.toLowerCase().includes(filtroFuncionario.toLowerCase()) || 
      item.correo.toLowerCase().includes(filtroFuncionario.toLowerCase());

    let coincideExpirado = true;
    if (porExpirarChecked && !caducadasChecked) {
      coincideExpirado = item.estado === 'Por expirar';
    } else if (!porExpirarChecked && caducadasChecked) {
      coincideExpirado = item.estado === 'Caducada';
    } else if (porExpirarChecked && caducadasChecked) {
      coincideExpirado = item.estado === 'Por expirar' || item.estado === 'Caducada';
    }

    return coincideTipo && coincideFuncionario && coincideExpirado;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', paddingBottom: '40px', margin: 0 }}>
      
      {/* ---------------- ENCABEZADO SUPERIOR ---------------- */}
      <header style={{ backgroundColor: '#6b1d2f', color: '#ffffff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '18px' }}>
          <span>{esContadora ? '📊' : '⚙️'}</span>
          <span>{esContadora ? 'Dashboard Contabilidad - ITI' : 'Dashboard Administrador - ITI'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#521422', fontSize: '12px', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#e5e7eb' }}>
            <span>👤</span>
            <span>{userLogged.rol} : {userLogged.nombre}</span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#800020',
              color: '#ffffff',
              border: '1px solid #a32a42',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* ---------------- VISTA CONTADORA ---------------- */}
      {esContadora ? (
        <main style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '5px solid #800020' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>TRÁMITES TOTALES</p>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#800020', margin: '4px 0' }}>128</h2>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Histórico completo</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '5px solid #d97706' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>SOLICITUDES PENDIENTES</p>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706', margin: '4px 0' }}>12</h2>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>En revisión o aprobación</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '5px solid #059669' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>ÓRDENES PENDIENTES DE APROBAR</p>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '4px 0' }}>6</h2>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Esperando aprobación del Director</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '5px solid #dc2626' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>POR EXPIRAR / EXPIRADAS</p>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', margin: '4px 0' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>5 <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 'normal' }}>≥3 días</span></span>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>2 <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 'normal' }}>≥5 días</span></span>
              </div>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Alertas de plazo</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', fontWeight: 600, color: '#800020', textTransform: 'uppercase' }}>FILTRAR POR TIPO</label>
              <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px', outline: 'none', minWidth: '140px' }}>
                <option value="Todas">Todas</option>
                <option value="Solicitud">Solicitud</option>
                <option value="Liquidación">Liquidación</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>DESDE</label>
              <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px', outline: 'none', color: '#374151' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>HASTA</label>
              <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px', outline: 'none', color: '#374151' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '180px' }}>
              <label style={{ fontSize: '10px', fontWeight: 600, color: '#800020', textTransform: 'uppercase' }}>FUNCIONARIO</label>
              <input type="text" placeholder="Nombre o correo..." value={filtroFuncionario} onChange={(e) => setFiltroFuncionario(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#374151', cursor: 'pointer' }}>
                <input type="checkbox" checked={porExpirarChecked} onChange={(e) => setPorExpirarChecked(e.target.checked)} /> Por expirar
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#374151', cursor: 'pointer' }}>
                <input type="checkbox" checked={caducadasChecked} onChange={(e) => setCaducadasChecked(e.target.checked)} /> Caducadas
              </label>
            </div>

            <button onClick={limpiarFiltrosContadora} style={{ backgroundColor: '#d1d5db', color: '#374151', border: 'none', padding: '7px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Limpiar</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: 0, color: '#6b1d2f', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📋</span> Solicitudes y Liquidaciones
            </h3>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#6b1d2f', color: '#ffffff' }}>
                    <th style={{ padding: '12px 14px' }}>N° Trámite</th>
                    <th style={{ padding: '12px 14px' }}>Funcionario</th>
                    <th style={{ padding: '12px 14px' }}>Correo</th>
                    <th style={{ padding: '12px 14px' }}>Teléfono</th>
                    <th style={{ padding: '12px 14px' }}>Tipo</th>
                    <th style={{ padding: '12px 14px' }}>Monto</th>
                    <th style={{ padding: '12px 14px' }}>Fecha de transferencia</th>
                    <th style={{ padding: '12px 14px' }}>Días Restantes</th>
                    <th style={{ padding: '12px 14px' }}>Estado</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudesFiltradasContadora.map((row, index) => {
                    const esCaducada = row.estado === 'Caducada';
                    const esPorExpirar = row.estado === 'Por expirar';
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: esCaducada ? '#fde8e8' : esPorExpirar ? '#fff8f0' : '#ffffff' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{row.no}</td>
                        <td style={{ padding: '12px 14px' }}>{row.funcionario}</td>
                        <td style={{ padding: '12px 14px' }}>{row.correo}</td>
                        <td style={{ padding: '12px 14px' }}>{row.telefono}</td>
                        <td style={{ padding: '12px 14px' }}>{row.tipo}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{row.monto}</td>
                        <td style={{ padding: '12px 14px' }}>{row.fechaTransf}</td>
                        <td style={{ padding: '12px 14px', fontWeight: esCaducada || esPorExpirar ? 600 : 'normal', color: esCaducada ? '#dc2626' : esPorExpirar ? '#d97706' : '#374151' }}>{row.diasRestantes}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, backgroundColor: row.estado === 'Pendiente' ? '#fef3c7' : esPorExpirar ? '#ffedd5' : row.estado === 'Aprobado' ? '#d1fae5' : '#fee2e2', color: row.estado === 'Pendiente' ? '#92400e' : esPorExpirar ? '#c2410c' : row.estado === 'Aprobado' ? '#065f46' : '#991b1b' }}>
                            {row.estado}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          {(esCaducada || esPorExpirar) && (
                            <button onClick={() => handleNotificar(row.no, row.correo)} style={{ backgroundColor: '#6b1d2f', color: '#ffffff', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                              Notificar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      ) : (

        /* ---------------- VISTA ADMINISTRADOR / GENERAL ---------------- */
        <main style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '5px solid #800020' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0 }}>USUARIOS TOTALES</p>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#800020', margin: '4px 0' }}>{usuariosAdmin.length}</h2>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>7 roles activos</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '5px solid #2563eb' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0 }}>ROLES DEL SISTEMA</p>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb', margin: '4px 0' }}>7</h2>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Funcionario, Jefe, Director...</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '5px solid #d97706' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0 }}>TIPOS DE TRÁMITE</p>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#d97706', margin: '4px 0' }}>2</h2>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Solicitud y Liquidación</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '5px solid #059669' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0 }}>TRÁMITES TOTALES</p>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', margin: '4px 0' }}>1</h2>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Histórico completo</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '5px solid #4b5563' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0 }}>NOTIFICACIONES ENVIADAS</p>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#4b5563', margin: '4px 0' }}>12</h2>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Correo + Telegram</p>
            </div>
          </div>

          {/* Buscador */}
          <div style={{ backgroundColor: '#ffffff', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Buscar en todo el sistema (usuarios, trámites, roles...)"
              value={searchTermAdmin}
              onChange={(e) => setSearchTermAdmin(e.target.value)}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '13px', color: '#374151' }}
            />
          </div>

          {/* Pestañas / Tabs */}
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e5e7eb', fontSize: '14px', fontWeight: 500, paddingBottom: '4px' }}>
            {[
              { id: 'usuarios', label: '👥 Usuarios' },
              { id: 'roles', label: '🔑 Roles' },
              { id: 'tipos', label: '📋 Tipos de Trámite' },
              { id: 'tramites', label: '📊 Trámites' },
              { id: 'notificaciones', label: '🔔 Notificaciones' },
              { id: 'auditoria', label: '📜 Auditoría' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabAdmin(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  paddingBottom: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: activeTabAdmin === tab.id ? 600 : 'normal',
                  color: activeTabAdmin === tab.id ? '#6b1d2f' : '#6b7280',
                  borderBottom: activeTabAdmin === tab.id ? '3px solid #6b1d2f' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* PESTAÑA USUARIOS */}
          {activeTabAdmin === 'usuarios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#6b1d2f', fontSize: '16px', fontWeight: 600 }}>👥 Gestión de Usuarios</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  
                  {/* BOTÓN + NUEVO USUARIO ACTIVO */}
                  <button 
                    onClick={() => {
                      setFormUsuario({ cedula: '', nombre: '', correo: '', rol: 'Funcionario', jefe: '—' });
                      setShowModalNuevo(true);
                    }}
                    style={{ backgroundColor: '#6b1d2f', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    + Nuevo Usuario
                  </button>

                  <button style={{ backgroundColor: '#e5e7eb', color: '#374151', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Exportar</button>
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#6b1d2f', color: '#ffffff' }}>
                      <th style={{ padding: '12px 16px' }}>ID</th>
                      <th style={{ padding: '12px 16px' }}>Cédula</th>
                      <th style={{ padding: '12px 16px' }}>Nombre</th>
                      <th style={{ padding: '12px 16px' }}>Correo</th>
                      <th style={{ padding: '12px 16px' }}>Rol</th>
                      <th style={{ padding: '12px 16px' }}>Jefe Inmediato</th>
                      <th style={{ padding: '12px 16px' }}>Estado</th>
                      <th style={{ padding: '12px 16px' }}>Intentos</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '10px 16px' }}>{u.id}</td>
                        <td style={{ padding: '10px 16px' }}>{u.cedula}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 600 }}>{u.nombre}</td>
                        <td style={{ padding: '10px 16px' }}>{u.correo}</td>
                        <td style={{ padding: '10px 16px' }}>{u.rol}</td>
                        <td style={{ padding: '10px 16px' }}>{u.jefe}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, backgroundColor: u.estado === 'Activo' ? '#d1fae5' : '#fee2e2', color: u.estado === 'Activo' ? '#065f46' : '#991b1b' }}>
                            {u.estado}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px' }}>{u.intentos}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                            
                            {/* BOTÓN EDITAR */}
                            <button 
                              onClick={() => handleAbrirEditar(u)}
                              style={{ backgroundColor: '#fef3c7', color: '#92400e', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 600 }}
                            >
                              Editar
                            </button>

                            {/* BOTÓN RESTABLECER CONTRASEÑA */}
                            <button 
                              onClick={() => handleResetPassword(u.nombre, u.correo)}
                              style={{ backgroundColor: '#e0f2fe', color: '#075985', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 600 }}
                            >
                              Restablecer contraseña
                            </button>

                            {/* BOTÓN DESBLOQUEAR / ELIMINAR */}
                            {u.estado === 'Bloqueado' ? (
                              <button 
                                onClick={() => handleDesbloquear(u.id, u.nombre)}
                                style={{ backgroundColor: '#d1fae5', color: '#065f46', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 600 }}
                              >
                                Desbloquear
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleEliminarUsuario(u.id, u.nombre)}
                                style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 600 }}
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* OTRAS PESTAÑAS */}
          {activeTabAdmin === 'roles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, color: '#6b1d2f', fontSize: '16px', fontWeight: 600 }}>🔑 Roles del Sistema</h3>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#6b1d2f', color: '#ffffff' }}>
                      <th style={{ padding: '12px 16px' }}>ID</th>
                      <th style={{ padding: '12px 16px' }}>Rol</th>
                      <th style={{ padding: '12px 16px' }}>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolesAdmin.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '10px 16px' }}>{r.id}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 600 }}>{r.nombre}</td>
                        <td style={{ padding: '10px 16px' }}>{r.descripcion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTabAdmin === 'tipos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, color: '#6b1d2f', fontSize: '16px', fontWeight: 600 }}>📋 Tipos de Trámite Configurados</h3>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#6b1d2f', color: '#ffffff' }}>
                      <th style={{ padding: '12px 16px' }}>ID</th>
                      <th style={{ padding: '12px 16px' }}>Nombre del Trámite</th>
                      <th style={{ padding: '12px 16px' }}>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiposTramiteAdmin.map((t) => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '10px 16px' }}>{t.id}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 600 }}>{t.nombre}</td>
                        <td style={{ padding: '10px 16px' }}>{t.descripcion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTabAdmin === 'tramites' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, color: '#6b1d2f', fontSize: '16px', fontWeight: 600 }}>📊 Histórico de Trámites</h3>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#6b1d2f', color: '#ffffff' }}>
                      <th style={{ padding: '12px 16px' }}>ID</th>
                      <th style={{ padding: '12px 16px' }}>Tipo</th>
                      <th style={{ padding: '12px 16px' }}>Usuario Solicita</th>
                      <th style={{ padding: '12px 16px' }}>Fecha</th>
                      <th style={{ padding: '12px 16px' }}>Monto</th>
                      <th style={{ padding: '12px 16px' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tramitesAdmin.map((tr) => (
                      <tr key={tr.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '10px 16px' }}>{tr.id}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 600 }}>{tr.tipo}</td>
                        <td style={{ padding: '10px 16px' }}>{tr.usuario}</td>
                        <td style={{ padding: '10px 16px' }}>{tr.fecha}</td>
                        <td style={{ padding: '10px 16px' }}>{tr.monto}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, backgroundColor: '#fef3c7', color: '#92400e' }}>
                            {tr.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTabAdmin === 'notificaciones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, color: '#6b1d2f', fontSize: '16px', fontWeight: 600 }}>🔔 Histórico de Notificaciones</h3>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#6b1d2f', color: '#ffffff' }}>
                      <th style={{ padding: '12px 16px' }}>ID</th>
                      <th style={{ padding: '12px 16px' }}>Canal</th>
                      <th style={{ padding: '12px 16px' }}>Destinatario</th>
                      <th style={{ padding: '12px 16px' }}>Mensaje</th>
                      <th style={{ padding: '12px 16px' }}>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notificacionesAdmin.map((n) => (
                      <tr key={n.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '10px 16px' }}>{n.id}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 600 }}>{n.canal}</td>
                        <td style={{ padding: '10px 16px' }}>{n.destinatario}</td>
                        <td style={{ padding: '10px 16px' }}>{n.mensaje}</td>
                        <td style={{ padding: '10px 16px' }}>{n.fecha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTabAdmin === 'auditoria' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, color: '#6b1d2f', fontSize: '16px', fontWeight: 600 }}>📜 Logs de Auditoría</h3>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#6b1d2f', color: '#ffffff' }}>
                      <th style={{ padding: '12px 16px' }}>ID</th>
                      <th style={{ padding: '12px 16px' }}>Usuario</th>
                      <th style={{ padding: '12px 16px' }}>Acción</th>
                      <th style={{ padding: '12px 16px' }}>IP</th>
                      <th style={{ padding: '12px 16px' }}>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditoriaAdmin.map((a) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '10px 16px' }}>{a.id}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 600 }}>{a.usuario}</td>
                        <td style={{ padding: '10px 16px' }}>{a.accion}</td>
                        <td style={{ padding: '10px 16px' }}>{a.ip}</td>
                        <td style={{ padding: '10px 16px' }}>{a.fecha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      )}

      {/* ---------------- MODAL: NUEVO USUARIO ---------------- */}
      {showModalNuevo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, color: '#6b1d2f', fontSize: '18px' }}>➕ Agregar Nuevo Usuario</h3>
            <form onSubmit={handleCrearUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Cédula</label>
                <input required type="text" value={formUsuario.cedula} onChange={(e) => setFormUsuario({ ...formUsuario, cedula: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Nombre Completo</label>
                <input required type="text" value={formUsuario.nombre} onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Correo Institucional</label>
                <input required type="email" value={formUsuario.correo} onChange={(e) => setFormUsuario({ ...formUsuario, correo: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Rol</label>
                <select value={formUsuario.rol} onChange={(e) => setFormUsuario({ ...formUsuario, rol: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}>
                  <option value="Funcionario">Funcionario</option>
                  <option value="Jefe Inmediato">Jefe Inmediato</option>
                  <option value="Director Financiero">Director Financiero</option>
                  <option value="Contadora">Contadora</option>
                  <option value="Colectora">Colectora</option>
                  <option value="Asistente Contable">Asistente Contable</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Jefe Inmediato</label>
                <input type="text" value={formUsuario.jefe} onChange={(e) => setFormUsuario({ ...formUsuario, jefe: e.target.value })} placeholder="Ej. Henry Bonilla" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModalNuevo(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f3f4f6', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#6b1d2f', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}>Guardar Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: EDITAR USUARIO ---------------- */}
      {showModalEditar && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, color: '#6b1d2f', fontSize: '18px' }}>✏️ Editar Usuario</h3>
            <form onSubmit={handleGuardarEdicion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Cédula</label>
                <input required type="text" value={formUsuario.cedula} onChange={(e) => setFormUsuario({ ...formUsuario, cedula: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Nombre Completo</label>
                <input required type="text" value={formUsuario.nombre} onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Correo Institucional</label>
                <input required type="email" value={formUsuario.correo} onChange={(e) => setFormUsuario({ ...formUsuario, correo: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Rol</label>
                <select value={formUsuario.rol} onChange={(e) => setFormUsuario({ ...formUsuario, rol: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}>
                  <option value="Funcionario">Funcionario</option>
                  <option value="Jefe Inmediato">Jefe Inmediato</option>
                  <option value="Director Financiero">Director Financiero</option>
                  <option value="Contadora">Contadora</option>
                  <option value="Colectora">Colectora</option>
                  <option value="Asistente Contable">Asistente Contable</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Jefe Inmediato</label>
                <input type="text" value={formUsuario.jefe} onChange={(e) => setFormUsuario({ ...formUsuario, jefe: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModalEditar(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f3f4f6', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#6b1d2f', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}>Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};