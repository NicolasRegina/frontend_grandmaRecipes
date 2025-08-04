import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../api/auth";
import EditProfileForm from "../components/EditProfileForm";

const Profile = () => {
  const { user, token, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token) {
          const profileData = await getProfile(token);
          setProfile(profileData);
        }
      } catch (err) {
        setError("Error al cargar el perfil");
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleEditSuccess = (updatedUser) => {
    setProfile(updatedUser);
    setIsEditing(false);
    setSuccess("Perfil actualizado exitosamente");
    // Limpiar mensaje de éxito después de 3 segundos
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning text-center" role="alert">
          <h5>🔐 Acceso Requerido</h5>
          <p className="mb-0">Debes iniciar sesión para ver tu perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h2 className="text-center mb-4">Mi Perfil</h2>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}
          
          {profile && (
            <div className="card shadow">
              <div className="card-body p-4">
                {/* Imagen de perfil */}
                <div className="text-center mb-4">
                  <img 
                    src={profile.profilePicture || "/img/default-profile.png"} 
                    alt="Foto de perfil"
                    className="rounded-circle border border-3 border-light shadow"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover"
                    }}
                  />
                </div>

                {/* Información del usuario */}
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <strong className="text-muted small">NOMBRE</strong>
                      <div className="fs-5 fw-semibold">{profile.name}</div>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <strong className="text-muted small">EMAIL</strong>
                      <div className="fs-6">{profile.email}</div>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <strong className="text-muted small">BIOGRAFÍA</strong>
                      <div className="fs-6 text-muted mt-1">
                        {profile.bio || "Sin biografía"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="p-3 bg-light rounded text-center">
                      <strong className="text-muted small">MIEMBRO DESDE</strong>
                      <div className="fs-6 fw-semibold">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="p-3 bg-light rounded text-center">
                      <strong className="text-muted small">GRUPOS</strong>
                      <div className="fs-6 fw-semibold">
                        {profile.groups?.length || 0} grupos
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón de editar */}
                <div className="text-center">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Editar Perfil
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal/Vista de edición */}
          {isEditing && (
            <EditProfileForm
              profile={profile}
              token={token}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
