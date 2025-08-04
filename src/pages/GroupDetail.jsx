import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getGroupById, deleteGroup, approveJoinRequest, rejectJoinRequest, changeMemberRole, removeMember, requestJoinGroup } from "../api/groups";

const GroupDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await getGroupById(id, token);
        setGroup(data);
      } catch {
        setError("No se pudo cargar el grupo.");
      }
    };
    fetchGroup();
  }, [id, token]);

  const handleDelete = async () => {
    if (window.confirm("¿Seguro que deseas eliminar este grupo?")) {
      try {
        await deleteGroup(group._id, token);
        navigate("/groups");
      } catch {
        setError("No tienes permiso para eliminar este grupo.");
      }
    }
  };

  const handleApproveRequest = async (userId) => {
    try {
      await approveJoinRequest(group._id, userId, token);
      // Recargar datos del grupo
      const data = await getGroupById(id, token);
      setGroup(data);
    } catch {
      alert("Error al aprobar solicitud");
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await rejectJoinRequest(group._id, userId, token);
      // Recargar datos del grupo
      const data = await getGroupById(id, token);
      setGroup(data);
    } catch {
      alert("Error al rechazar solicitud");
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await changeMemberRole(group._id, userId, newRole, token);
      // Recargar datos del grupo
      const data = await getGroupById(id, token);
      setGroup(data);
    } catch {
      alert("Error al cambiar rol del miembro");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm("¿Seguro que deseas remover este miembro?")) {
      try {
        await removeMember(group._id, userId, token);
        // Recargar datos del grupo
        const data = await getGroupById(id, token);
        setGroup(data);
      } catch {
        alert("Error al remover miembro");
      }
    }
  };

  const handleJoinGroup = async () => {
    try {
      await requestJoinGroup(group.inviteCode, token);
      
      // Recargar datos del grupo
      const data = await getGroupById(id, token);
      setGroup(data);
      
      if (group.isPrivate) {
        alert("Solicitud enviada. Un administrador debe aprobar tu unión al grupo.");
      } else {
        alert("¡Te has unido al grupo exitosamente!");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        alert(`Error: ${err.response?.data?.message || "Ya eres miembro de este grupo o ya enviaste una solicitud"}`);
      } else {
        alert("Error al intentar unirse al grupo");
      }
    }
  };

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger text-center" role="alert">
          ⚠️ {error}
        </div>
      </div>
    );
  }
  
  if (!group) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando grupo...</p>
        </div>
      </div>
    );
  }

  // Verificar permisos
  const member = group.members.find((m) => m.user?._id === user._id);
  const isAdmin = member && (member.role === "admin" || member.role === "owner");
  const isCreator = member && member.role === "owner";
  const isMember = !!member;
  
  // Verificar si ya envió solicitud pendiente
  const hasPendingRequest = group.pendingRequests?.some(req => req.user._id === user._id);

  return (
    <div className="container py-4">
      <div className="row">
        {/* Header con botón de volver */}
        <div className="col-12 mb-3">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate("/groups")}
          >
            ← Volver a Grupos
          </button>
        </div>
        
        {/* Información principal del grupo */}
        <div className="col-12">
          <div className="card shadow-sm border-0 mb-4">
            <div className="row g-0">
              {/* Imagen del grupo */}
              <div className="col-md-4">
                <div className="bg-success bg-opacity-10 h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '250px' }}>
                  {group.image ? (
                    <img
                      src={group.image}
                      alt={group.name}
                      className="img-fluid rounded-start h-100 w-100"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="text-center">
                      <div style={{ fontSize: '4rem' }}>👥</div>
                      <small className="text-muted">Sin imagen</small>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Información del grupo */}
              <div className="col-md-8">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h1 className="card-title text-success mb-0">{group.name}</h1>
                    <div>
                      {isCreator && (
                        <span className="badge bg-warning text-dark me-2">
                          👑 Creador
                        </span>
                      )}
                      {isAdmin && !isCreator && (
                        <span className="badge bg-info me-2">
                          🛡️ Admin
                        </span>
                      )}
                      <span className={`badge ${group.isPrivate ? 'bg-secondary' : 'bg-success'}`}>
                        {group.isPrivate ? '🔒 Privado' : '🌐 Público'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">📝 Descripción</h6>
                    <p className="card-text">{group.description}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">👤 Creador</h6>
                    <p className="card-text">{group.creator?.name || 'Desconocido'}</p>
                  </div>
                  
                  <div className="mb-3">
                    <span className="badge bg-secondary me-2">
                      👥 {group.members?.length || 0} miembros
                    </span>
                    <span className="badge bg-info">
                      🍽️ {group.recipes?.length || 0} recetas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="row">
          {/* Recetas del Grupo */}
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">🍽️ Recetas del Grupo</h5>
                  {isMember && (
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => navigate(`/recipes/new?group=${group._id}`)}
                    >
                      ➕ Agregar Receta
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body">
                {group.recipes && group.recipes.length > 0 ? (
                  <div className="row">
                    {group.recipes.map((recipe) => (
                      <div key={recipe._id} className="col-12 col-md-6 mb-3">
                        <div className="card h-100 border-0 shadow-sm">
                          {/* Imagen de la receta */}
                          <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                            {recipe.image ? (
                              <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="img-fluid rounded-top w-100 h-100"
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="text-center text-muted">
                                <div style={{ fontSize: '2rem' }}>🍽️</div>
                                <small>Sin imagen</small>
                              </div>
                            )}
                          </div>
                          
                          {/* Información de la receta */}
                          <div className="card-body d-flex flex-column">
                            <h6 className="card-title fw-bold text-success">{recipe.title}</h6>
                            
                            {recipe.description && (
                              <p className="card-text text-muted small mb-2" style={{ flexGrow: 1 }}>
                                {recipe.description.length > 100 
                                  ? `${recipe.description.substring(0, 100)}...` 
                                  : recipe.description
                                }
                              </p>
                            )}
                            
                            <div className="mb-2">
                              <small className="text-muted">
                                👤 Por: {recipe.author?.name || 'Anónimo'}
                              </small>
                            </div>
                            
                            <div className="mb-3">
                              <small className="text-muted">
                                📅 {new Date(recipe.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            
                            {/* Botón para ver receta */}
                            <div className="mt-auto">
                              <button 
                                className="btn btn-outline-success w-100"
                                onClick={() => navigate(`/recipes/${recipe._id}`)}
                              >
                                Ver Receta
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div style={{ fontSize: '3rem' }}>🍽️</div>
                    <h6 className="text-muted mb-3">No hay recetas en este grupo</h6>
                    {isMember ? (
                      <div>
                        <p className="text-muted mb-3">¡Sé el primero en agregar una receta!</p>
                        <button 
                          className="btn btn-success"
                          onClick={() => navigate(`/recipes/new?group=${group._id}`)}
                        >
                          ➕ Agregar Primera Receta
                        </button>
                      </div>
                    ) : (
                      <p className="text-muted">Las recetas aparecerán aquí cuando los miembros las agreguen.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar con miembros y acciones */}
          <div className="col-12 col-lg-4">
          {/* Código de invitación - Solo para miembros */}
          {isMember && (
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">📧 Código de Invitación</h5>
              </div>
              <div className="card-body text-center">
                <div className="badge bg-primary fs-6 px-3 py-2 mb-2">
                  {group.inviteCode}
                </div>
                <p className="small text-muted mb-0">
                  Comparte este código para invitar nuevos miembros
                </p>
              </div>
            </div>
          )}

          {/* Solicitudes pendientes - Solo para admins/owner */}
          {(isAdmin || isCreator) && group.pendingRequests?.length > 0 && (
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-warning bg-opacity-25">
                <h5 className="mb-0">⏳ Solicitudes Pendientes</h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {group.pendingRequests.map((request) => (
                    <div key={request.user._id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-medium">{request.user.name}</span>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApproveRequest(request.user._id)}
                          >
                            ✅
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRejectRequest(request.user._id)}
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Lista de miembros */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">👥 Miembros del Grupo</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {group.members.map((m) => (
                  <div key={m.user?._id || m.user} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-medium">{m.user?.name || 'Usuario desconocido'}</span>
                        <div className="mt-1">
                          <span className={`badge ${
                            m.role === 'admin' ? 'bg-warning text-dark' : 
                            m.role === 'owner' ? 'bg-primary' : 'bg-secondary'
                          }`}>
                            {m.role === 'admin' ? '🛡️ Admin' : 
                             m.role === 'owner' ? '👑 Owner' : '👤 Miembro'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Controles para admins/owner */}
                      {(isAdmin || isCreator) && m.user._id !== user._id && m.role !== 'owner' && (
                        <div className="btn-group" role="group">
                          {/* Cambiar rol */}
                          <div className="dropdown">
                            <button className="btn btn-outline-secondary btn-sm dropdown-toggle" 
                                    type="button" data-bs-toggle="dropdown">
                              Rol
                            </button>
                            <ul className="dropdown-menu">
                              {m.role !== 'admin' && (
                                <li>
                                  <button className="dropdown-item" onClick={() => handleChangeRole(m.user._id, 'admin')}>
                                    Hacer Admin
                                  </button>
                                </li>
                              )}
                              {m.role !== 'member' && (
                                <li>
                                  <button className="dropdown-item" onClick={() => handleChangeRole(m.user._id, 'member')}>
                                    Hacer Miembro
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>
                          {/* Remover miembro */}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRemoveMember(m.user._id)}
                            title="Remover miembro"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light">
              <h5 className="mb-0">⚙️ Acciones</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                {/* Botón Unirme - Para usuarios no miembros */}
                {!isMember && !hasPendingRequest && (
                  <button 
                    className="btn btn-success btn-lg"
                    onClick={handleJoinGroup}
                  >
                    ➕ Unirme al Grupo
                  </button>
                )}
                
                {/* Estado de solicitud pendiente */}
                {!isMember && hasPendingRequest && (
                  <div className="alert alert-warning mb-0">
                    ⏳ Solicitud de unión pendiente de aprobación
                  </div>
                )}
                
                {/* Botones de administración - Solo para miembros admin/owner */}
                {(isAdmin || isCreator) && (
                  <>
                    <button 
                      className="btn btn-warning"
                      onClick={() => navigate(`/groups/${group._id}/edit`)}
                    >
                      ✏️ Editar Grupo
                    </button>
                    
                    {isCreator && (
                      <button 
                        className="btn btn-danger"
                        onClick={handleDelete}
                      >
                        🗑️ Eliminar Grupo
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        </div> {/* Cierre de row */}
      </div>
    </div>
  );
};

export default GroupDetail;
