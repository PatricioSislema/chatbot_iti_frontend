import React, { useState } from 'react';
import { Search, Filter, UserPlus, Edit, Trash2, Key, Unlock, CheckCircle, XCircle, X, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  correo: string;
  rol: 'Administrador' | 'Analista' | 'Solicitante';
  bloqueado: boolean;
  intentosFallidos: number;
}

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, cedula: '1712345678', nombre: 'Juan Pérez', correo: 'juan.perez@iti.edu.ec', rol: 'Administrador', bloqueado: false, intentosFallidos: 0 },
    { id: 2, cedula: '1723456789', nombre: 'María López', correo: 'maria.lopez@iti.edu.ec', rol: 'Analista', bloqueado: false, intentosFallidos: 0 },
    { id: 3, cedula: '1734567890', nombre: 'Carlos Ruiz', correo: 'carlos.ruiz@iti.edu.ec', rol: 'Solicitante', bloqueado: true, intentosFallidos: 3 },
    { id: 4, cedula: '1745678901', nombre: 'Ana Torres', correo: 'ana.torres@iti.edu.ec', rol: 'Solicitante', bloqueado: false, intentosFallidos: 0 },
    { id: 5, cedula: '1756789012', nombre: 'Luis Mora', correo: 'luis.mora@iti.edu.ec', rol: 'Analista', bloqueado: false, intentosFallidos: 0 },
  ]);

  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 4;

  // Modales
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioActualId, setUsuarioActualId] = useState<number | null>(null);

  // Campos del formulario
  const [formCedula, setFormCedula] = useState('');
  const [formNombre, setFormNombre] = useState('');
  const [formCorreo, setFormCorreo] = useState('');
  const [formRol, setFormRol] = useState<'Administrador' | 'Analista' | 'Solicitante'>('Solicitante');
  const [formContrasena, setFormContrasena] = useState('');

  // Filtrado
  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideTexto = u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                          u.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          u.cedula.includes(busqueda);
    const coincideRol = filtroRol === 'Todos' || u.rol === filtroRol;
    return coincideTexto && coincideRol;
  });

  // Paginación
  const indiceUltimo = paginaActual * elementosPorPagina;
  const indicePrimero = indiceUltimo - elementosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina);

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setFormCedula('');
    setFormNombre('');
    setFormCorreo('');
    setFormRol('Solicitante');
    setFormContrasena('');
    setModalUsuarioAbierto(true);
  };

  const abrirModalEditar = (u: Usuario) => {
    setModoEdicion(true);
    setUsuarioActualId(u.id);
    setFormCedula(u.cedula);
    setFormNombre(u.nombre);
    setFormCorreo(u.correo);
    setFormRol(u.rol);
    setModalUsuarioAbierto(true);
  };

  const guardarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (modoEdicion && usuarioActualId !== null) {
      setUsuarios(usuarios.map(u => u.id === usuarioActualId ? { ...u, cedula: formCedula, nombre: formNombre, correo: formCorreo, rol: formRol } : u));
    } else {
      const nuevo: Usuario = {
        id: Date.now(),
        cedula: formCedula,
        nombre: formNombre,
        correo: formCorreo,
        rol: formRol,
        bloqueado: false,
        intentosFallidos: 0,
      };
      setUsuarios([nuevo, ...usuarios]);
    }
    setModalUsuarioAbierto(false);
  };

  const eliminarUsuario = (id: number, nombre: string) => {
    if (window.confirm(`¿Está seguro de eliminar al usuario ${nombre}?`)) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  const desbloquearCuenta = (id: number) => {
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, bloqueado: false, intentosFallidos: 0 } : u));
  };

  const resetearPassword = (nombre: string) => {
    const nueva = prompt(`Ingrese la nueva contraseña temporal para ${nombre}:`);
    if (nueva) {
      alert(`Contraseña restablecida con éxito para ${nombre}.`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{ backgroundColor: '#8C1D40', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: 'white', color: '#8C1D40', fontWeight: 'bold', padding: '6px 12px', borderRadius: '4px', fontSize: '18px' }}>
            ITI
          </div>
          <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '0.5px' }}>
            Sistema de Anticipos — Módulo de Usuarios (Administrador)
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ padding: '32px 24px', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box', flex: 1 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Gestión de Usuarios</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Administre las cuentas institucionales, roles y estados de seguridad.</p>
          </div>
          <button
            onClick={abrirModalCrear}
            style={{ backgroundColor: '#8C1D40', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', boxShadow: '0 2px 4px rgba(140, 29, 64, 0.2)' }}
          >
            <UserPlus style={{ width: '18px', height: '18px' }} /> Añadir Usuario
          </button>
        </div>

        {/* Filtros y Buscador */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', marginBottom: '24px', backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <span style={{ position: 'absolute', top: '10px', left: '12px', color: '#9ca3af' }}>
              <Search style={{ width: '18px', height: '18px' }} />
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre, correo o cédula..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
              style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter style={{ width: '18px', height: '18px', color: '#6b7280' }} />
            <select
              value={filtroRol}
              onChange={(e) => { setFiltroRol(e.target.value); setPaginaActual(1); }}
              style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: 'white', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Todos">Todos los Roles</option>
              <option value="Administrador">Administrador</option>
              <option value="Analista">Analista</option>
              <option value="Solicitante">Solicitante</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Cédula</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Nombre Completo</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Correo Institucional</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Rol</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Estado</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, textAlign: 'center' }}>Acciones Administrativas</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.length > 0 ? (
                usuariosPaginados.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s' }}>
                    <td style={{ padding: '14px 16px', color: '#4b5563' }}>{u.cedula}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 500, color: '#1f2937' }}>{u.nombre}</td>
                    <td style={{ padding: '14px 16px', color: '#6b7280' }}>{u.correo}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 500, backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                        {u.rol}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 500,
                        backgroundColor: u.bloqueado ? '#fee2e2' : '#d1fae5',
                        color: u.bloqueado ? '#991b1b' : '#065f46'
                      }}>
                        {u.bloqueado ? <XCircle style={{ width: '12px', height: '12px' }} /> : <CheckCircle style={{ width: '12px', height: '12px' }} />}
                        {u.bloqueado ? 'Bloqueado' : 'Activo'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        
                        <button
                          title="Editar usuario"
                          onClick={() => abrirModalEditar(u)}
                          style={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#374151' }}
                        >
                          <Edit style={{ width: '15px', height: '15px' }} />
                        </button>

                        <button
                          title="Resetear contraseña"
                          onClick={() => resetearPassword(u.nombre)}
                          style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#92400e' }}
                        >
                          <Key style={{ width: '15px', height: '15px' }} />
                        </button>

                        {u.bloqueado && (
                          <button
                            title="Desbloquear cuenta"
                            onClick={() => desbloquearCuenta(u.id)}
                            style={{ backgroundColor: '#d1fae5', border: '1px solid #a7f3d0', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#065f46' }}
                          >
                            <Unlock style={{ width: '15px', height: '15px' }} />
                          </button>
                        )}

                        <button
                          title="Eliminar usuario"
                          onClick={() => eliminarUsuario(u.id, u.nombre)}
                          style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#991b1b' }}
                        >
                          <Trash2 style={{ width: '15px', height: '15px' }} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
                    No se encontraron usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>
              Mostrando {usuariosPaginados.length > 0 ? indicePrimero + 1 : 0} a {Math.min(indiceUltimo, usuariosFiltrados.length)} de {usuariosFiltrados.length} registros
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
                disabled={paginaActual === 1}
                style={{ padding: '6px 12px', border: '1px solid #d1d5db', backgroundColor: paginaActual === 1 ? '#f3f4f6' : 'white', borderRadius: '6px', cursor: paginaActual === 1 ? 'not-allowed' : 'pointer', color: '#374151', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} /> Anterior
              </button>
              <button
                onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                style={{ padding: '6px 12px', border: '1px solid #d1d5db', backgroundColor: (paginaActual === totalPaginas || totalPaginas === 0) ? '#f3f4f6' : 'white', borderRadius: '6px', cursor: (paginaActual === totalPaginas || totalPaginas === 0) ? 'not-allowed' : 'pointer', color: '#374151', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
              >
                Siguiente <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Modal Crear / Editar Usuario */}
      {modalUsuarioAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', maxWidth: '500px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            
            <div style={{ backgroundColor: '#8C1D40', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario Institucional'}</h3>
              <button onClick={() => setModalUsuarioAbierto(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={guardarUsuario} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Cédula</label>
                <input
                  type="text"
                  required
                  value={formCedula}
                  onChange={(e) => setFormCedula(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Correo Institucional</label>
                <input
                  type="email"
                  required
                  value={formCorreo}
                  onChange={(e) => setFormCorreo(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Rol Asignado</label>
                <select
                  value={formRol}
                  onChange={(e) => setFormRol(e.target.value as any)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Analista">Analista</option>
                  <option value="Solicitante">Solicitante</option>
                </select>
              </div>

              {!modoEdicion && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Contraseña Inicial</label>
                  <input
                    type="password"
                    required
                    value={formContrasena}
                    onChange={(e) => setFormContrasena(e.target.value)}
                    placeholder="******"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalUsuarioAbierto(false)}
                  style={{ padding: '10px 16px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, color: '#374151' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 16px', backgroundColor: '#8C1D40', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                >
                  {modoEdicion ? 'Guardar Cambios' : 'Registrar Usuario'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '16px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
        Instituto Superior Tecnológico Internacional ITI &copy; 2026 — Módulo de Gestión de Anticipos HH
      </footer>
    </div>
  );
};