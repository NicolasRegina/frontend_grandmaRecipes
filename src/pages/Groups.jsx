import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getGroups, deleteGroup } from "../api/groups";
import { useNavigate } from "react-router-dom";
import GroupSearchBar from "../components/GroupSearchBar";
import ModerationStatus from "../components/ModerationStatus";

const Groups = () => {
  const { token, user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await getGroups(token);
      setGroups(data); // tu endpoint devuelve un array
    } catch {
      alert("Error al cargar grupos");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas borrar el grupo?")) {
      try {
        await deleteGroup(id, token);
        fetchGroups();
      } catch {
        alert("Error al borrar grupo");
      }
    }
  };

  const handleGroupFound = (group) => {
    navigate(`/groups/${group._id}`);
  };

  // Separar grupos por membresía
  const myGroups = groups.filter(group => 
    group.isMember || group.creator?._id === user?._id
  );
  const publicGroups = groups.filter(group => 
    !group.isMember && 
    !group.isPrivate && 
    group.creator?._id !== user?._id
  );

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="display-5 fw-bold text-dark mb-0">
              {user?.role === "admin" ? "Todos los Grupos" : "Explorar Grupos"}
            </h1>
            <button 
              className="btn btn-success btn-lg"
              onClick={() => navigate("/groups/new")}
            >
              ➕ Nuevo Grupo
            </button>
          </div>
          
          {/* Group Search Component */}
          <GroupSearchBar onGroupFound={handleGroupFound} />
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2 text-muted">Cargando grupos...</p>
            </div>
          )}
        </div>
      </div>

      {/* Groups Content */}
      {!loading && (
        <>
          {/* Mis Grupos Section */}
          {user?.role !== "admin" && (
            <>
              <div className="row mb-3">
                <div className="col-12">
                  <h2 className="h4 text-success mb-3">
                    👥 Mis Grupos ({myGroups.length})
                  </h2>
                </div>
              </div>
              <div className="row mb-5">
                {myGroups.length > 0 ? (
                  myGroups.map((grupo) => {
                    return (
                      <div key={grupo._id} className="col-12 col-md-6 col-lg-4 mb-4">
                        <div className="card h-100 shadow-sm border-0">
                          {/* Group Image/Icon */}
                          <div className="card-img-top bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                            {grupo.image ? (
                              <img 
                                src={grupo.image} 
                                alt={grupo.name}
                                className="img-fluid rounded-top"
                                style={{ maxHeight: '150px', objectFit: 'cover', width: '100%' }}
                              />
                            ) : (
                              <div className="text-center">
                                <div style={{ fontSize: '3rem' }}>👥</div>
                              </div>
                            )}
                          </div>
                          
                          {/* Card Body */}
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title fw-bold text-success mb-2">{grupo.name}</h5>
                            
                            {/* Group Info */}
                            <div className="mb-3">
                              <span className="badge bg-secondary me-2">
                                👤 {grupo.members?.length || 0} miembros
                              </span>
                              {grupo.userRole === 'owner' && (
                                <span className="badge bg-warning text-dark">
                                  👑 Owner
                                </span>
                              )}
                              {grupo.userRole === 'admin' && (
                                <span className="badge bg-info">
                                  🛡️ Admin
                                </span>
                              )}
                              {grupo.userRole === 'member' && (
                                <span className="badge bg-success">
                                  👤 Miembro
                                </span>
                              )}
                              {grupo.isPrivate && (
                                <span className="badge bg-warning ms-1">
                                  � Privado
                                </span>
                              )}
                            </div>
                            
                            {grupo.description && (
                              <p className="card-text text-muted small mb-3" style={{ flexGrow: 1 }}>
                                {grupo.description.length > 100 
                                  ? `${grupo.description.substring(0, 100)}...` 
                                  : grupo.description
                                }
                              </p>
                            )}
                            
                            {/* Creator Info */}
                            <div className="mb-3">
                              <small className="text-muted">
                                👤 Creado por: {grupo.creator?.name || 'Anónimo'}
                              </small>
                            </div>
                            
                            {/* Moderation Status for own groups */}
                            {grupo.creator?._id === user?._id && (
                              <ModerationStatus 
                                status={grupo.moderationStatus} 
                                rejectionReason={grupo.rejectionReason}
                                type="grupo"
                              />
                            )}
                            
                            {/* Action Buttons */}
                            <div className="mt-auto">
                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-outline-success flex-fill"
                                  onClick={() => navigate(`/groups/${grupo._id}`)}
                                >
                                  Ver Detalle
                                </button>
                                
                                {(grupo.userRole === 'admin' || grupo.userRole === 'owner' || user.role === "admin") && (
                                  <button 
                                    className="btn btn-warning btn-sm"
                                    onClick={() => navigate(`/groups/${grupo._id}/edit`)}
                                    title="Editar grupo"
                                  >
                                    ✏️
                                  </button>
                                )}
                                
                                {(grupo.userRole === 'owner' || user.role === "admin") && (
                                  <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(grupo._id)}
                                    title="Eliminar grupo"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <div style={{ fontSize: '4rem' }}>👥</div>
                      <h3 className="text-muted mb-3">No eres miembro de ningún grupo</h3>
                      <p className="text-muted mb-4">
                        Crea tu primer grupo o únete a uno existente.
                      </p>
                      <button 
                        className="btn btn-success btn-lg"
                        onClick={() => navigate("/groups/new")}
                      >
                        ➕ Crear Mi Primer Grupo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Grupos Públicos Section */}
          {user?.role !== "admin" && (
            <>
              <div className="row mb-3">
                <div className="col-12">
                  <h2 className="h4 text-primary mb-3">
                    🌍 Grupos Públicos ({publicGroups.length})
                  </h2>
                </div>
              </div>
              <div className="row">
                {publicGroups.length > 0 ? (
                  publicGroups.map((grupo) => (
                    <div key={grupo._id} className="col-12 col-md-6 col-lg-4 mb-4">
                      <div className="card h-100 shadow-sm border-0">
                        {/* Group Image/Icon */}
                        <div className="card-img-top bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                          {grupo.image ? (
                            <img 
                              src={grupo.image} 
                              alt={grupo.name}
                              className="img-fluid rounded-top"
                              style={{ maxHeight: '150px', objectFit: 'cover', width: '100%' }}
                            />
                          ) : (
                            <div className="text-center">
                              <div style={{ fontSize: '3rem' }}>🌍</div>
                            </div>
                          )}
                        </div>
                        
                        {/* Card Body */}
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title fw-bold text-primary mb-2">{grupo.name}</h5>
                          
                          {/* Group Info */}
                          <div className="mb-3">
                            <span className="badge bg-secondary me-2">
                              👤 {grupo.members?.length || 0} miembros
                            </span>
                            <span className="badge bg-success">
                              🌍 Público
                            </span>
                          </div>
                          
                          {grupo.description && (
                            <p className="card-text text-muted small mb-3" style={{ flexGrow: 1 }}>
                              {grupo.description.length > 100 
                                ? `${grupo.description.substring(0, 100)}...` 
                                : grupo.description
                              }
                            </p>
                          )}
                          
                          {/* Creator Info */}
                          <div className="mb-3">
                            <small className="text-muted">
                              👤 Creado por: {grupo.creator?.name || 'Anónimo'}
                            </small>
                          </div>
                          
                          {/* Moderation Status for own groups */}
                          {grupo.creator?._id === user?._id && (
                            <ModerationStatus 
                              status={grupo.moderationStatus} 
                              rejectionReason={grupo.rejectionReason}
                              type="grupo"
                            />
                          )}
                          
                          {/* Action Buttons */}
                          <div className="mt-auto">
                            <button 
                              className="btn btn-primary w-100"
                              onClick={() => navigate(`/groups/${grupo._id}`)}
                            >
                              Ver Grupo Público
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <div style={{ fontSize: '4rem' }}>🌍</div>
                      <h3 className="text-muted mb-3">No hay grupos públicos disponibles</h3>
                      <p className="text-muted">
                        Los grupos públicos aparecerán aquí cuando estén disponibles.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Admin View - Todos los grupos */}
          {user?.role === "admin" && (
            <div className="row">
              {groups.length > 0 ? (
                groups.map((grupo) => {
                  return (
                    <div key={grupo._id} className="col-12 col-md-6 col-lg-4 mb-4">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-img-top bg-info bg-opacity-10 d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                          {grupo.image ? (
                            <img 
                              src={grupo.image} 
                              alt={grupo.name}
                              className="img-fluid rounded-top"
                              style={{ maxHeight: '150px', objectFit: 'cover', width: '100%' }}
                            />
                          ) : (
                            <div className="text-center">
                              <div style={{ fontSize: '3rem' }}>🛡️</div>
                            </div>
                          )}
                        </div>
                        
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title fw-bold text-info mb-2">{grupo.name}</h5>
                          
                          <div className="mb-3">
                            <span className="badge bg-secondary me-2">
                              👤 {grupo.members?.length || 0} miembros
                            </span>
                            <span className={`badge ${grupo.isPrivate ? 'bg-warning' : 'bg-success'}`}>
                              {grupo.isPrivate ? '🔒 Privado' : '🌍 Público'}
                            </span>
                          </div>
                          
                          {grupo.description && (
                            <p className="card-text text-muted small mb-3" style={{ flexGrow: 1 }}>
                              {grupo.description.length > 100 
                                ? `${grupo.description.substring(0, 100)}...` 
                                : grupo.description
                              }
                            </p>
                          )}
                          
                          <div className="mb-3">
                            <small className="text-muted">
                              👤 Creado por: {grupo.creator?.name || 'Anónimo'}
                            </small>
                          </div>
                          
                          {/* Moderation Status - visible for all in admin view */}
                          <ModerationStatus 
                            status={grupo.moderationStatus} 
                            rejectionReason={grupo.rejectionReason}
                            type="grupo"
                          />
                          
                          <div className="mt-auto">
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-outline-info flex-fill"
                                onClick={() => navigate(`/groups/${grupo._id}`)}
                              >
                                Ver Detalle
                              </button>
                              
                              <button 
                                className="btn btn-warning btn-sm"
                                onClick={() => navigate(`/groups/${grupo._id}/edit`)}
                                title="Editar grupo"
                              >
                                ✏️
                              </button>
                              
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(grupo._id)}
                                title="Eliminar grupo"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-12">
                  <div className="text-center py-5">
                    <div style={{ fontSize: '4rem' }}>🛡️</div>
                    <h3 className="text-muted mb-3">No hay grupos en el sistema</h3>
                    <p className="text-muted">
                      Los grupos aparecerán aquí cuando los usuarios los creen.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Groups;
