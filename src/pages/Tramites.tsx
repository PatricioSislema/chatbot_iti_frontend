import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, FileText, ChevronLeft, ChevronRight, X, ShieldAlert } from 'lucide-react';
import api from '../services/api';

interface Tramite {
  id: number;
  codigo: string;
  solicitante: string;
  tipo: string;
  monto: number;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
  fecha: string;
  observacion?: string;
}

export const Tramites = () => {
  const [tramites, setTramites] = useState<Tramite[]>([
    // Datos de ejemplo institucionales para pruebas inmediatas si la API está cargando
    { id: 1, codigo: 'TRM-2026-001', solicitante: 'Juan Pérez', tipo: 'Anticipo Ordinario', monto: 450.00, estado: 'Pendiente', fecha: '2026-10-05', observacion: 'Solicitud de anticipo para gastos académicos.' },
    { id: 2, codigo: 'TRM-2026-002', solicitante: 'María López', tipo: 'Anticipo Emergencia', monto: 300.00, estado: 'Aprobado', fecha: '2026-10-04', observacion: 'Aprobado por talento humano.' },
    { id: 3, codigo: 'TRM-2026-003', solicitante: 'Carlos Ruiz', tipo: 'Anticipo Ordinario', monto: 600.00, estado: 'Rechazado', fecha: '2026-10-02', observacion: 'Excede el cupo máximo permitido.' },
    { id: 4, codigo: 'TRM-2026-004', solicitante: 'Ana Torres', tipo: 'Anticipo Especial', monto: 800.00, estado: 'Pendiente', fecha: '2026-10-06', observacion: 'Pendiente de validación de documentos.' },
    { id: 5, codigo: 'TRM-2026-005', solicitante: 'Luis Mora', tipo: 'Anticipo Ordinario', monto: 500.00, estado: 'Aprobado', fecha: '2026-10-01', observacion: 'Transferencia realizada con éxito.' },
  ]);

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 4;

  const [tramiteSeleccionado, setTramiteSeleccionado] = useState<Tramite | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Filtrado de trámites
  const tramitesFiltrados = tramites.filter((t) => {
    const coincideTexto = t.codigo.toLowerCase().includes(busqueda.toLowerCase()) || 
                          t.solicitante.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'Todos' || t.estado === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  // Paginación
  const indiceUltimo = paginaActual * elementosPorPagina;
  const indicePrimero = indiceUltimo - elementosPorPagina;
  const tramitesPaginados = tramitesFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(tramitesFiltrados.length / elementosPorPagina);

  const abrirModal = (tramite: Tramite) => {
    setTramiteSeleccionado(tramite);
    setModalAbierto(true);
  };

  const cambiarEstadoTramite = (nuevoEstado: 'Aprobado' | 'Rechazado') => {
    if (!tramiteSeleccionado) return;
    setTramites(tramites.map(t => t.id === tramiteSeleccionado.id ? { ...t, estado: nuevoEstado } : t));
    setModalAbierto(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* Barra Superior Estándar */}
      <header style={{ backgroundColor: '#8C1D40', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: 'white', color: '#8C1D40', fontWeight: 'bold', padding: '6px 12px', borderRadius: '4px', fontSize: '18px' }}>
            ITI
          </div>
          <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '0.5px' }}>
            Sistema de Anticipos — Módulo de Trámites
          </span>
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={{ padding: '32px 24px', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box', flex: 1 }}>
        
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Gestión de Trámites</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Visualice, filtre y administre las solicitudes de anticipos institucionales.</p>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', marginBottom: '24px', backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <span style={{ position: 'absolute', top: '10px', left: '12px', color: '#9ca3af' }}>
              <Search style={{ width: '18px', height: '18px' }} />
            </span>
            <input
              type="text"
              placeholder="Buscar por código de trámite o solicitante..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
              style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter style={{ width: '18px', height: '18px', color: '#6b7280' }} />
            <select
              value={filtroEstado}
              onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
              style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: 'white', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>
        </div>

        {/* Tabla de Trámites */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Código</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Solicitante</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Tipo de Trámite</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Monto</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Estado</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramitesPaginados.length > 0 ? (
                tramitesPaginados.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 500, color: '#8C1D40' }}>{t.codigo}</td>
                    <td style={{ padding: '14px 16px', color: '#1f2937' }}>{t.solicitante}</td>
                    <td style={{ padding: '14px 16px', color: '#4b5563' }}>{t.tipo}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1f2937' }}>${t.monto.toFixed(2)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 500,
                        backgroundColor: t.estado === 'Aprobado' ? '#d1fae5' : t.estado === 'Rechazado' ? '#fee2e2' : '#fef3c7',
                        color: t.estado === 'Aprobado' ? '#065f46' : t.estado === 'Rechazado' ? '#991b1b' : '#92400e'
                      }}>
                        {t.estado === 'Aprobado' && <CheckCircle style={{ width: '12px', height: '12px' }} />}
                        {t.estado === 'Rechazado' && <XCircle style={{ width: '12px', height: '12px' }} />}
                        {t.estado === 'Pendiente' && <Clock style={{ width: '12px', height: '12px' }} />}
                        {t.estado}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => abrirModal(t)}
                        style={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#374151', fontSize: '13px', fontWeight: 500 }}
                      >
                        <Eye style={{ width: '14px', height: '14px' }} /> Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
                    No se encontraron trámites que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>
              Mostrando {tramitesPaginados.length > 0 ? indicePrimero + 1 : 0} a {Math.min(indiceUltimo, tramitesFiltrados.length)} de {tramitesFiltrados.length} registros
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

      {/* Modal de Detalle */}
      {modalAbierto && tramiteSeleccionado && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', maxWidth: '500px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            
            <div style={{ backgroundColor: '#8C1D40', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Detalle del Trámite: {tramiteSeleccionado.codigo}</h3>
              <button onClick={() => setModalAbierto(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: '#374151' }}>
              <div><strong>Solicitante:</strong> {tramiteSeleccionado.solicitante}</div>
              <div><strong>Tipo de Trámite:</strong> {tramiteSeleccionado.tipo}</div>
              <div><strong>Monto Solicitado:</strong> <span style={{ fontWeight: 600, color: '#8C1D40' }}>${tramiteSeleccionado.monto.toFixed(2)}</span></div>
              <div><strong>Fecha de Solicitud:</strong> {tramiteSeleccionado.fecha}</div>
              <div><strong>Estado Actual:</strong> {tramiteSeleccionado.estado}</div>
              <div><strong>Observación Institucional:</strong> <p style={{ margin: '4px 0 0 0', color: '#6b7280', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>{tramiteSeleccionado.observacion || 'Sin observaciones registradas.'}</p></div>
            </div>

            <div style={{ padding: '16px 24px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setModalAbierto(false)}
                style={{ padding: '8px 16px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, color: '#374151' }}
              >
                Cerrar
              </button>
              {/* Opciones de gestión para Administrador */}
              {tramiteSeleccionado.estado === 'Pendiente' && (
                <>
                  <button
                    onClick={() => cambiarEstadoTramite('Rechazado')}
                    style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => cambiarEstadoTramite('Aprobado')}
                    style={{ padding: '8px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Aprobar
                  </button>
                </>
              )}
            </div>

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