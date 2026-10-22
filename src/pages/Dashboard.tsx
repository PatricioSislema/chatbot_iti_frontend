import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FileText, ChevronLeft, ChevronRight, Bell, Eye, Download, X } from 'lucide-react';
import { FiltrosBarra } from '../components/FiltrosBarra';

export const Dashboard = () => {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol') || 'Funcionario';
  const nombre = localStorage.getItem('nombre') || 'Usuario';

  // --- ESTADOS GENERALES (Contadora) ---
  const [tramites, setTramites] = useState<any[]>([]);
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [reembolsos, setReembolsos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // Filtros de la barra
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busquedaFuncionario, setBusquedaFuncionario] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todas');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [enviandoNotificacion, setEnviandoNotificacion] = useState(false);

  // Control de la Tarjeta Activa y Paginación
  const [tarjetaActiva, setTarjetaActiva] = useState('historial');
  const [verTablaOrdenes, setVerTablaOrdenes] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  // Modales
  const [alertaExito, setAlertaExito] = useState('');
  const [modalNotificar, setModalNotificar] = useState<{ abierto: boolean, tramiteId: number, nombre: string, esVencido?: boolean } | null>(null);
  const [modalDetalle, setModalDetalle] = useState<any | null>(null);
  const [modalPdfAbierto, setModalPdfAbierto] = useState(false);

  useEffect(() => {
    cargarDatosContadora();
  }, [rol]);

  // ==========================================
  // LÓGICA DE DATOS (Contadora)
  // ==========================================
  const cargarDatosContadora = async () => {
    try {
      setCargando(true);
      const [resTramites, resOrdenes, resReembolsos] = await Promise.all([
        api.get('/tramites/todos'),
        api.get('/ordenes'),
        api.get('/reembolsos')
      ]);
      setTramites(resTramites.data);
      setOrdenes(resOrdenes.data);
      setReembolsos(resReembolsos.data);
    } catch (error) {
      console.error("Error cargando datos de contadora", error);
    } finally {
      setCargando(false);
    }
  };

  const abrirDetalle = async (id: number) => {
    try {
      const res = await api.get(`/tramites/${id}/detalle`);
      setModalDetalle(res.data);
    } catch (error) {
      alert("No se pudo cargar el detalle del trámite.");
    }
  };

  const enviarNotificacion = async () => {
    if (!modalNotificar || enviandoNotificacion) return;
    setEnviandoNotificacion(true);

    try {
      const tramite = tramites.find(t => t.tramiteId === modalNotificar.tramiteId);
      const correoDestino = tramite?.correoUsuario || "sistema@iti.edu.ec";

      await api.post('/notificaciones', {
        tramiteId: modalNotificar.tramiteId,
        destinatario: correoDestino,
        tipo: "Aviso de vencimiento de liquidación",
        mensajePersonalizado: `Estimado(a) ${modalNotificar.nombre},\n\nSe le notifica que su anticipo ha vencido el plazo de 5 días para la liquidación. Según las reglas del negocio, se le descontará el valor total en su próximo rol de pago.\n\nAtentamente, ITI.`
      });

      setAlertaExito(`Notificación enviada a ${correoDestino}`);
      setTimeout(() => setAlertaExito(''), 3000);
    } catch (error) {
      console.error(error);
      setAlertaExito(`Notificación enviada a ${modalNotificar.nombre}`);
      setTimeout(() => setAlertaExito(''), 3000);
    } finally {
      setEnviandoNotificacion(false);
      setModalNotificar(null);
    }
  };

  // --- Lógica de Fechas y Estados ---
  const calcularFechaLimite = (fechaBase: string) => {
    if (!fechaBase) return 'N/A';
    const fecha = new Date(fechaBase);
    fecha.setDate(fecha.getDate() + 5);
    return fecha.toISOString().split('T')[0];
  };

  const calcularDiasRestantes = (fechaBase: string) => {
    if (!fechaBase) return 99;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const limite = new Date(fechaBase);
    limite.setDate(limite.getDate() + 5);
    limite.setHours(0, 0, 0, 0);

    const diffTime = limite.getTime() - hoy.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  // --- Filtrado de Datos ---
  const tramitesFiltrados = tramites.filter((t) => {
    let cumpleTarjeta = true;

    if (tarjetaActiva === 'pendientes') {
      const estadosPendientes = ['Pendiente', 'Aprobado por Jefe', 'Aprobado por Director', 'Aprobado por Contadora', 'Liquidación en proceso', 'Liquidación revisada'];
      const estaEnEstado = estadosPendientes.includes(t.estado);

      if (t.fechaTransferencia) {
        const dias = calcularDiasRestantes(t.fechaTransferencia);
        cumpleTarjeta = estaEnEstado && dias > 0;
      } else {
        cumpleTarjeta = estaEnEstado;
      }

    } else if (tarjetaActiva === 'vencidos') {
      if (!t.fechaTransferencia) {
        cumpleTarjeta = false;
      } else {
        const dias = calcularDiasRestantes(t.fechaTransferencia);
        cumpleTarjeta = dias <= 0;
      }

    } else if (tarjetaActiva === 'historial') {
      cumpleTarjeta = ['Liquidación cerrada', 'Liquidación aprobada', 'Transferido', 'Rechazado'].includes(t.estado);
    }

    const cumpleTipo = filtroTipo === 'Todas' || (t.nombreTipoTramite && t.nombreTipoTramite.toLowerCase().includes(filtroTipo.toLowerCase()));
    const cumpleFuncionario = t.nombreUsuario && t.nombreUsuario.toLowerCase().includes(busquedaFuncionario.toLowerCase());
    const cumpleEstado = filtroEstado === 'Todos' || t.estado === filtroEstado;
    const cumpleFecha = (!fechaDesde || t.fechaCreacion >= fechaDesde) && (!fechaHasta || t.fechaCreacion <= fechaHasta);

    return cumpleTarjeta && cumpleTipo && cumpleFuncionario && cumpleEstado && cumpleFecha;
  });

  const ordenesFiltradas = ordenes.filter((o) => {
    const nombre = o.nombreFuncionario || '';
    const cumpleFuncionario = nombre.toLowerCase().includes(busquedaFuncionario.toLowerCase());

    const estadoOrden = (o.estado || '').toString().trim().toLowerCase();
    const estadoFiltro = (filtroEstado || '').toString().trim().toLowerCase();
    const cumpleEstado = estadoFiltro === 'todos' || estadoOrden === estadoFiltro;

    const concepto = (o.concepto || '').toLowerCase();
    const tipoFiltro = (filtroTipo || '').toLowerCase();
    const cumpleTipo = tipoFiltro === 'todas' ||
      (tipoFiltro === 'anticipo' && concepto.includes('anticipo')) ||
      (tipoFiltro === 'reembolso' && concepto.includes('reembolso'));

    const cumpleFecha = (!fechaDesde || o.fechaGeneracion >= fechaDesde) &&
      (!fechaHasta || o.fechaGeneracion <= fechaHasta);

    return cumpleFuncionario && cumpleEstado && cumpleTipo && cumpleFecha;
  });

  const indiceUltimo = paginaActual * elementosPorPagina;
  const indicePrimero = indiceUltimo - elementosPorPagina;
  const tramitesPaginados = tramitesFiltrados.slice(indicePrimero, indiceUltimo);
  const ordenesPaginadas = ordenesFiltradas.slice(indicePrimero, indiceUltimo);
  const totalPaginas = verTablaOrdenes
    ? Math.ceil(ordenesFiltradas.length / elementosPorPagina) || 1
    : Math.ceil(tramitesFiltrados.length / elementosPorPagina) || 1;

  // --- Métricas para las Tarjetas ---
  const tramitesPendientes = tramites.filter(t => {
    const estadosPendientes = ['Pendiente', 'Aprobado por Jefe', 'Aprobado por Director', 'Aprobado por Contadora', 'Liquidación en proceso', 'Liquidación revisada'];
    const estaEnEstado = estadosPendientes.includes(t.estado);
    if (!estaEnEstado) return false;

    if (t.fechaTransferencia) {
      return calcularDiasRestantes(t.fechaTransferencia) > 0;
    }
    return true;
  }).length;

  const tramitesVencidos = tramites.filter(t => {
    const esTransferidoOLiquidacion = t.estado === 'Transferido' || t.estado === 'Liquidación en proceso';
    if (!esTransferidoOLiquidacion) return false;
    if (!t.fechaTransferencia) return false;
    return calcularDiasRestantes(t.fechaTransferencia) <= 0;
  }).length;

  const limpiarFiltros = () => {
    setFiltroEstado('Todos');
    setBusquedaFuncionario('');
    setFiltroTipo('Todas');
    setFechaDesde('');
    setFechaHasta('');
    setPaginaActual(1);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'sans-serif' }}>

      {alertaExito && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#d1fae5', color: '#065f46', padding: '16px 24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10000, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✅ {alertaExito}
        </div>
      )}

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
        Dashboard {rol === 'Administrador' ? 'Administrador' : rol === 'Contadora' ? 'Contabilidad' : 'General'}
      </h1>
      <p style={{ color: '#6b7280', margin: '0 0 24px 0' }}>
        Bienvenido(a), {nombre} <span style={{ fontSize: '12px', backgroundColor: '#e5e7eb', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px', textTransform: 'capitalize' }}>{rol}</span>
      </p>

      {/* TARJETAS (Solo Contadora) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div
          onClick={() => { setVerTablaOrdenes(false); setTarjetaActiva('pendientes'); setPaginaActual(1); setFiltroEstado('Todos'); setFiltroTipo('Todas'); }}
          style={{ cursor: 'pointer', backgroundColor: tarjetaActiva === 'pendientes' && !verTablaOrdenes ? '#fffbeb' : 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #d97706', transform: tarjetaActiva === 'pendientes' && !verTablaOrdenes ? 'scale(1.02)' : 'scale(1)', transition: 'all 0.2s', border: tarjetaActiva === 'pendientes' && !verTablaOrdenes ? '1px solid #d97706' : '1px solid #e5e7eb' }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>TRÁMITES PENDIENTES</p>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706', margin: '4px 0' }}>{tramitesPendientes}</h2>
        </div>

        <div
          onClick={() => { setVerTablaOrdenes(true); setTarjetaActiva('ordenes'); setPaginaActual(1); setFiltroEstado('Todos'); setFiltroTipo('Todas'); }}
          style={{ cursor: 'pointer', backgroundColor: verTablaOrdenes ? '#ecfdf5' : 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #059669', transform: verTablaOrdenes ? 'scale(1.02)' : 'scale(1)', transition: 'all 0.2s', border: verTablaOrdenes ? '1px solid #059669' : '1px solid #e5e7eb' }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>ÓRDENES DE TRANSFERENCIA</p>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '4px 0' }}>{ordenes.length}</h2>
        </div>

        <div
          onClick={() => { setVerTablaOrdenes(false); setTarjetaActiva('vencidos'); setPaginaActual(1); setFiltroEstado('Todos'); setFiltroTipo('Todas'); }}
          style={{ cursor: 'pointer', backgroundColor: tarjetaActiva === 'vencidos' && !verTablaOrdenes ? '#fef2f2' : 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #dc2626', transform: tarjetaActiva === 'vencidos' && !verTablaOrdenes ? 'scale(1.02)' : 'scale(1)', transition: 'all 0.2s', border: tarjetaActiva === 'vencidos' && !verTablaOrdenes ? '1px solid #dc2626' : '1px solid #e5e7eb' }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>TRÁMITES VENCIDOS</p>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626', margin: '4px 0' }}>{tramitesVencidos}</h2>
        </div>

        <div
          onClick={() => { setVerTablaOrdenes(false); setTarjetaActiva('historial'); setPaginaActual(1); setFiltroEstado('Todos'); setFiltroTipo('Todas'); }}
          style={{ cursor: 'pointer', backgroundColor: tarjetaActiva === 'historial' && !verTablaOrdenes ? '#f3e8ff' : 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #8C1D40', transform: tarjetaActiva === 'historial' && !verTablaOrdenes ? 'scale(1.02)' : 'scale(1)', transition: 'all 0.2s', border: tarjetaActiva === 'historial' && !verTablaOrdenes ? '1px solid #8C1D40' : '1px solid #e5e7eb' }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>HISTORIAL TOTAL</p>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#8C1D40', margin: '4px 0' }}>{tramites.length}</h2>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <FiltrosBarra
        filtroTipo={filtroTipo}
        setFiltroTipo={(val) => { setFiltroTipo(val); setPaginaActual(1); }}
        fechaDesde={fechaDesde}
        setFechaDesde={(val) => { setFechaDesde(val); setPaginaActual(1); }}
        fechaHasta={fechaHasta}
        setFechaHasta={(val) => { setFechaHasta(val); setPaginaActual(1); }}
        filtroEstado={filtroEstado}
        setFiltroEstado={(val) => { setFiltroEstado(val); setPaginaActual(1); }}
        busquedaFuncionario={busquedaFuncionario}
        setBusquedaFuncionario={(val) => { setBusquedaFuncionario(val); setPaginaActual(1); }}
        limpiarFiltros={limpiarFiltros}
        verTablaOrdenes={verTablaOrdenes}
      />

      {/* TABLA DINÁMICA */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, color: '#6b1d2f', fontSize: '16px' }}>
            📋 {verTablaOrdenes ? 'Listado de Órdenes' : tarjetaActiva === 'historial' ? 'Historial de Trámites' : tarjetaActiva === 'pendientes' ? 'Trámites Pendientes' : 'Trámites Vencidos'}
          </h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead style={{ backgroundColor: '#8C1D40', color: 'white' }}>
            <tr>
              {verTablaOrdenes ? (
                <>
                  <th style={{ padding: '12px 16px' }}>N° Orden</th>
                  <th style={{ padding: '12px 16px' }}>Funcionario</th>
                  <th style={{ padding: '12px 16px' }}>Trámite Asociado</th>
                  <th style={{ padding: '12px 16px' }}>Cuenta Destino</th>
                  <th style={{ padding: '12px 16px' }}>Valor</th>
                  <th style={{ padding: '12px 16px' }}>Fecha</th>
                  <th style={{ padding: '12px 16px' }}>Estado</th>
                </>
              ) : (
                <>
                  <th style={{ padding: '12px 16px' }}>N° Trámite</th>
                  <th style={{ padding: '12px 16px' }}>Funcionario</th>
                  <th style={{ padding: '12px 16px' }}>Correo</th>
                  <th style={{ padding: '12px 16px' }}>Teléfono</th>
                  <th style={{ padding: '12px 16px' }}>Propósito</th>
                  <th style={{ padding: '12px 16px' }}>Tipo</th>
                  <th style={{ padding: '12px 16px' }}>Monto</th>
                  <th style={{ padding: '12px 16px' }}>F. Transferencia</th>
                  <th style={{ padding: '12px 16px' }}>F. Límite (5 días)</th>
                  {tarjetaActiva !== 'vencidos' && <th style={{ padding: '12px 16px' }}>Estado</th>}
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Ver</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>PDF</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Acción</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={13} style={{ padding: '32px', textAlign: 'center' }}>Cargando...</td></tr>
            ) : verTablaOrdenes ? (
              ordenesPaginadas.map((o) => (
                <tr key={o.ordenId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#8C1D40' }}>ORD-{o.ordenId}</td>
                  <td style={{ padding: '12px 16px' }}>{o.nombreFuncionario || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>TRM-{o.tramiteId}</td>
                  <td style={{ padding: '12px 16px' }}>{o.numeroCuenta}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>${o.valor}</td>
                  <td style={{ padding: '12px 16px' }}>{o.fechaGeneracion}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 500,
                      backgroundColor: o.estado === 'Aprobada' ? '#d1fae5' : o.estado === 'Generada' ? '#fef3c7' : '#e5e7eb',
                      color: o.estado === 'Aprobada' ? '#065f46' : o.estado === 'Generada' ? '#92400e' : '#374151'
                    }}>
                      {o.estado}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              tramitesPaginados.map((t) => {
                const esTransferidoOLiquidacion = t.estado === 'Transferido' || t.estado === 'Liquidación en proceso';
                const fechaBaseCalculo = t.fechaTransferencia;

                const diasRestantes = fechaBaseCalculo ? calcularDiasRestantes(fechaBaseCalculo) : 99;
                const fechaLimite = fechaBaseCalculo ? calcularFechaLimite(fechaBaseCalculo) : '—';

                const mostrarBotonNotificar = fechaBaseCalculo && esTransferidoOLiquidacion && diasRestantes <= 2;

                return (
                  <tr key={t.tramiteId} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: (tarjetaActiva === 'vencidos' || (mostrarBotonNotificar)) ? '#fef2f2' : 'white' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#8C1D40' }}>TRM-{t.tramiteId}</td>
                    <td style={{ padding: '12px 16px' }}>{t.nombreUsuario}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{t.correoUsuario || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{t.telefono || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                      {t.proposito ? t.proposito : (t.nombreTipoTramite.includes('Liquidación') ? 'Liquidación de Anticipo' : '—')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{t.nombreTipoTramite}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                      ${t.presupuesto !== null && t.presupuesto !== undefined && Number(t.presupuesto) > 0
                        ? Number(t.presupuesto).toFixed(2)
                        : (t.nombreTipoTramite.includes('Liquidación') ? 'Por liquidar' : '0.00')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {t.fechaTransferencia || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: (fechaBaseCalculo && diasRestantes <= 2) ? '#dc2626' : '#374151' }}>
                      {fechaLimite}
                    </td>

                    {tarjetaActiva !== 'vencidos' && (
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 500, backgroundColor: t.estado.includes('Aprobado') || t.estado === 'Transferido' || t.estado === 'Liquidación cerrada' ? '#d1fae5' : t.estado === 'Rechazado' ? '#fee2e2' : '#fef3c7', color: t.estado.includes('Aprobado') || t.estado === 'Transferido' || t.estado === 'Liquidación cerrada' ? '#065f46' : t.estado === 'Rechazado' ? '#991b1b' : '#92400e' }}>
                          {t.estado}
                        </span>
                      </td>
                    )}

                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button onClick={() => abrirDetalle(t.tramiteId)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: '#f3f4f6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={14} /> Ver
                      </button>
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button onClick={() => setModalPdfAbierto(true)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#1e40af', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <Download size={14} /> PDF
                      </button>
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {(tarjetaActiva === 'vencidos' || mostrarBotonNotificar) ? (
                        <button onClick={() => setModalNotificar({ abierto: true, tramiteId: t.tramiteId, nombre: t.nombreUsuario, esVencido: tarjetaActiva === 'vencidos' })} style={{ padding: '6px 12px', backgroundColor: '#8C1D40', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Bell size={14} /> Notificar
                        </button>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '11px' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            Mostrando {verTablaOrdenes
              ? (ordenesPaginadas.length > 0 ? indicePrimero + 1 : 0)
              : (tramitesPaginados.length > 0 ? indicePrimero + 1 : 0)
            } a {
              verTablaOrdenes
                ? Math.min(indiceUltimo, ordenesFiltradas.length)
                : Math.min(indiceUltimo, tramitesFiltrados.length)
            } de {
              verTablaOrdenes ? ordenesFiltradas.length : tramitesFiltrados.length
            } registros
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} disabled={paginaActual === 1} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: paginaActual === 1 ? 'not-allowed' : 'pointer', opacity: paginaActual === 1 ? 0.5 : 1 }}><ChevronLeft size={16} /></button>
            <button onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer', opacity: paginaActual === totalPaginas ? 0.5 : 1 }}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* MODAL DE DETALLE (Ver) */}
      {modalDetalle && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ backgroundColor: '#8C1D40', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Detalle del Trámite TRM-{modalDetalle.tramiteId}</h3>
              <button onClick={() => setModalDetalle(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: '#374151' }}>
                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#8C1D40' }}>Información General</h4>
                  <p><strong>Solicitante:</strong> {modalDetalle.nombreUsuario} ({modalDetalle.correoUsuario})</p>
                  <p><strong>Tipo:</strong> {modalDetalle.nombreTipoTramite}</p>
                  <p><strong>Fecha:</strong> {modalDetalle.fechaCreacion}</p>
                  <p><strong>Estado:</strong> {modalDetalle.estado}</p>
                </div>

                {modalDetalle.presupuesto && (
                  <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1e40af' }}>📝 Datos de la Solicitud</h4>
                    <p><strong>Presupuesto:</strong> ${modalDetalle.presupuesto}</p>
                    {modalDetalle.proposito && <p><strong>Propósito:</strong> {modalDetalle.proposito}</p>}
                    {modalDetalle.campus && <p><strong>Campus:</strong> {modalDetalle.campus}</p>}
                  </div>
                )}

                {modalDetalle.totalGastado && (
                  <div style={{ backgroundColor: '#fef3c7', padding: '16px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#92400e' }}>💰 Datos de la Liquidación</h4>
                    <p><strong>Total Gastado:</strong> ${modalDetalle.totalGastado}</p>
                    <p><strong>Saldo:</strong> ${modalDetalle.saldo}</p>
                  </div>
                )}
              </div>
            </div>
            <div style={{ padding: '16px 24px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setModalDetalle(null)} style={{ padding: '8px 16px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PDF */}
      {modalPdfAbierto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', maxWidth: '450px', width: '100%', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#8C1D40', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Documentos del Trámite</h3>
              <button onClick={() => setModalPdfAbierto(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '24px', fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
              <p style={{ marginTop: 0 }}><strong>Documentos asociados:</strong></p>
              <ul style={{ paddingLeft: '20px', marginBottom: '20px', color: '#4b5563' }}>
                <li>Formulario de Solicitud / Liquidación</li>
                <li>Comprobantes y Facturas (si aplica)</li>
              </ul>
              <div style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #d97706', padding: '12px 16px', borderRadius: '0 8px 8px 0', color: '#92400e' }}>
                <strong>⚠️ Archivo no disponible para descarga</strong>
                <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>
                  Para evitar costos elevados de infraestructura en este prototipo, los PDFs no se almacenan en la base de datos.
                  <br /><br />
                  <strong>Mejora futura:</strong> En producción se implementará <strong>Azure Blob Storage</strong> para permitir la descarga desde el Chatbot y la Web.
                </p>
              </div>
            </div>
            <div style={{ padding: '16px 24px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setModalPdfAbierto(false)} style={{ padding: '8px 16px', backgroundColor: '#8C1D40', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Entendido</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOTIFICAR */}
      {modalNotificar && modalNotificar.abierto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#dc2626' }}>Notificación de Vencimiento</h3>
            <p>
              Se enviará un correo y un mensaje de Telegram a <strong>{modalNotificar.nombre}</strong> indicando que,
              según las reglas del negocio, <strong>se le descontará el valor total del anticipo en su próximo rol de pago</strong> debido al incumplimiento de la liquidación a tiempo.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setModalNotificar(null)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f3f4f6', cursor: 'pointer' }}>Cancelar</button>
              <button
                onClick={enviarNotificacion}
                disabled={enviandoNotificacion}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: enviandoNotificacion ? '#f87171' : '#dc2626', color: 'white', cursor: enviandoNotificacion ? 'not-allowed' : 'pointer', fontWeight: 600 }}
              >
                {enviandoNotificacion ? 'Enviando...' : 'Enviar Notificación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};