import { useState } from 'react'

const ModerationStatus = ({ status, rejectionReason, moderatedAt, type = "receta" }) => {
  const [showReason, setShowReason] = useState(false)

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return (
          <span className="badge bg-warning text-dark">
            <i className="bi bi-clock me-1"></i>
            Pendiente de revisión
          </span>
        )
      case 'approved':
        return (
          <span className="badge bg-success">
            <i className="bi bi-check-circle me-1"></i>
            Aprobado
          </span>
        )
      case 'rejected':
        return (
          <span className="badge bg-danger">
            <i className="bi bi-x-circle me-1"></i>
            Rechazado
          </span>
        )
      default:
        return null
    }
  }

  if (!status || status === 'approved') {
    return null // No mostrar nada para contenido aprobado
  }

  return (
    <div className="mb-2">
      <div className="d-flex align-items-center gap-2">
        {getStatusBadge()}
        {status === 'rejected' && rejectionReason && (
          <button
            className="btn btn-link btn-sm p-0 text-decoration-none"
            onClick={() => setShowReason(!showReason)}
          >
            <i className={`bi bi-chevron-${showReason ? 'up' : 'down'}`}></i>
            Ver motivo
          </button>
        )}
      </div>
      
      {status === 'pending' && (
        <small className="text-muted d-block mt-1">
          <i className="bi bi-info-circle me-1"></i>
          Tu {type} está siendo revisada por nuestro equipo de moderación.
        </small>
      )}
      
      {status === 'rejected' && showReason && (
        <div className="alert alert-danger mt-2 mb-0 py-2">
          <small>
            <strong>Motivo del rechazo:</strong><br />
            {rejectionReason || 'No se especificó un motivo'}
          </small>
          {moderatedAt && (
            <small className="d-block mt-1 text-muted">
              Revisado el {new Date(moderatedAt).toLocaleDateString()}
            </small>
          )}
        </div>
      )}
    </div>
  )
}

export default ModerationStatus
