import { useState } from "react";
import { updateProfile } from "../api/auth";

const EditProfileForm = ({ profile, token, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    name: profile.name || "",
    bio: profile.bio || "",
    profilePicture: profile.profilePicture || ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updatedUser = await updateProfile(form, token);
      onSuccess(updatedUser.user); // El backend devuelve { message, user }
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">✏️ Editar Perfil</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onCancel}
              disabled={loading}
            ></button>
          </div>
          
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={50}
                  placeholder="Tu nombre completo"
                />
                <div className="form-text">Entre 2 y 50 caracteres</div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Biografía
                </label>
                <textarea
                  name="bio"
                  className="form-control"
                  value={form.bio}
                  onChange={handleChange}
                  maxLength={200}
                  rows={4}
                  placeholder="Cuéntanos algo sobre ti..."
                />
                <div className="form-text d-flex justify-content-between">
                  <span>Opcional - Describe tus intereses culinarios</span>
                  <span className={form.bio.length > 180 ? "text-warning" : "text-muted"}>
                    {form.bio.length}/200
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Foto de Perfil
                </label>
                <input
                  type="url"
                  name="profilePicture"
                  className="form-control"
                  value={form.profilePicture}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/mi-foto.jpg"
                />
                <div className="form-text">URL de tu imagen de perfil (opcional)</div>
                
                {form.profilePicture && (
                  <div className="text-center mt-3">
                    <img 
                      src={form.profilePicture} 
                      alt="Vista previa"
                      className="rounded-circle border border-2 border-light shadow"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="small text-muted mt-1">Vista previa</div>
                  </div>
                )}
              </div>
            </form>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              ❌ Cancelar
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
