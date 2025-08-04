import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useModerationCounts } from '../hooks/useModerationCounts'

const ModerationGroups = () => {
  const [pendingGroups, setPendingGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})
  const { refresh } = useModerationCounts()

  // Obtener grupos pendientes
  const fetchPendingGroups = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/groups/moderation/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPendingGroups(data)
      } else {
        toast.error('Error al cargar grupos pendientes')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  // Aprobar grupo
  const handleApprove = async (groupId) => {
    setActionLoading(prev => ({ ...prev, [groupId]: true }))
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/groups/moderation/${groupId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Grupo aprobado exitosamente')
        setPendingGroups(prev => prev.filter(group => group._id !== groupId))
        refresh() // Actualizar contador en navbar
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al aprobar grupo')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión')
    } finally {
      setActionLoading(prev => ({ ...prev, [groupId]: false }))
    }
  }

  // Rechazar grupo
  const handleReject = async (groupId, rejectionReason) => {
    setActionLoading(prev => ({ ...prev, [groupId]: true }))
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/groups/moderation/${groupId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason })
      })

      if (response.ok) {
        toast.success('Grupo rechazado')
        setPendingGroups(prev => prev.filter(group => group._id !== groupId))
        refresh() // Actualizar contador en navbar
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al rechazar grupo')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión')
    } finally {
      setActionLoading(prev => ({ ...prev, [groupId]: false }))
    }
  }

  // Manejar rechazo con razón
  const handleRejectWithReason = (groupId) => {
    const reason = prompt('Ingrese la razón del rechazo (opcional):')
    if (reason !== null) { // Usuario no canceló
      handleReject(groupId, reason)
    }
  }

  useEffect(() => {
    fetchPendingGroups()
  }, [])

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>🔍 Moderación de Grupos</h2>
            <span className="badge bg-warning text-dark fs-6">
              {pendingGroups.length} pendientes
            </span>
          </div>

          {pendingGroups.length === 0 ? (
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <div style={{ fontSize: '3rem' }}>✅</div>
                <h5 className="text-muted mb-3">No hay grupos pendientes</h5>
                <p className="text-muted">Todos los grupos han sido revisados.</p>
              </div>
            </div>
          ) : (
            <div className="row">
              {pendingGroups.map((group) => (
                <div key={group._id} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                  <div className="card shadow-sm border-0 h-100">
                    {/* Header del grupo */}
                    <div className="card-header bg-warning bg-opacity-25 py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-bold small">⏳ Pendiente</h6>
                        <small className="text-muted">
                          {new Date(group.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>

                    {/* Imagen del grupo */}
                    <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '120px' }}>
                      {group.image ? (
                        <img
                          src={group.image}
                          alt={group.name}
                          className="img-fluid rounded-top w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="text-center text-muted">
                          <div style={{ fontSize: '3rem' }}>👥</div>
                          <small>Sin imagen</small>
                        </div>
                      )}
                    </div>

                    {/* Información del grupo */}
                    <div className="card-body d-flex flex-column p-3">
                      <h6 className="card-title text-success mb-2">{group.name}</h6>
                      
                      <p className="card-text text-muted mb-2 small">
                        {group.description.length > 80 
                          ? `${group.description.substring(0, 80)}...` 
                          : group.description
                        }
                      </p>

                      <div className="mb-1">
                        <small className="text-muted">
                          👤 {group.creator?.name || 'Desconocido'}
                        </small>
                      </div>

                      <div className="mb-1">
                        <small className="text-muted">
                          🔒 {group.isPrivate ? 'Privado' : 'Público'}
                        </small>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted">
                          🎫 <code>{group.inviteCode}</code>
                        </small>
                      </div>

                      {/* Botones de acción */}
                      <div className="mt-auto">
                        <div className="d-grid gap-1">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApprove(group._id)}
                            disabled={actionLoading[group._id]}
                          >
                            {actionLoading[group._id] ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                Procesando...
                              </>
                            ) : (
                              <>✅ Aprobar</>
                            )}
                          </button>
                          
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRejectWithReason(group._id)}
                            disabled={actionLoading[group._id]}
                          >
                            ❌ Rechazar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModerationGroups
