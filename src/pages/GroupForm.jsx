import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createGroup } from "../api/groups";

const GroupForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    isPrivate: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdGroup, setCreatedGroup] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones frontend según Joi/backend
    if (form.name.trim().length < 3 || form.name.trim().length > 50) {
      setError("El nombre debe tener entre 3 y 50 caracteres.");
      return;
    }
    if (form.description.trim().length < 10 || form.description.trim().length > 300) {
      setError("La descripción debe tener entre 10 y 300 caracteres.");
      return;
    }

    // Opcionalmente, no enviar campo image si está vacío (deja que backend ponga el default)
    const groupData = {
      name: form.name.trim(),
      description: form.description.trim(),
      isPrivate: form.isPrivate,
    };
    if (form.image.trim()) groupData.image = form.image.trim();

    try {
      const result = await createGroup(groupData, token);
      setCreatedGroup(result.group); // El grupo está en result.group
      setSuccess("Grupo creado exitosamente. Está pendiente de aprobación por un administrador antes de ser público.");
      // No redirigir inmediatamente para mostrar el código
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el grupo");
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 text-success">
                Crear Nuevo Grupo
              </h2>

              {/* Información sobre moderación */}
              <div className="alert alert-info mb-4" role="alert">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  <strong>Proceso de moderación</strong>
                </div>
                <small>
                  Tu grupo será revisado por un administrador antes de estar disponible públicamente. 
                  Mientras tanto, podrás acceder a él normalmente y gestionar sus miembros.
                </small>
              </div>
              
              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  ⚠️ {error}
                </div>
              )}
              
              {success && createdGroup && (
                <div className="alert alert-success text-center" role="alert">
                  <div className="mb-3">
                    ✅ {success}
                  </div>
                  <div className="card bg-light">
                    <div className="card-body">
                      <h5 className="card-title">Código de Invitación</h5>
                      <div className="badge bg-primary fs-6 px-3 py-2 mb-2">
                        {createdGroup.inviteCode}
                      </div>
                      <p className="card-text small mb-3">
                        Comparte este código para invitar miembros al grupo
                      </p>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(createdGroup.inviteCode);
                              alert('¡Código copiado al portapapeles!');
                            } catch {
                              alert('No se pudo copiar el código');
                            }
                          }}
                        >
                          📋 Copiar Código
                        </button>
                        <button 
                          className="btn btn-success"
                          onClick={() => navigate(`/groups/${createdGroup._id}`)}
                        >
                          Ver Grupo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {success && !createdGroup && (
                <div className="alert alert-success text-center" role="alert">
                  ✅ {success}
                </div>
              )}
              
              {/* Solo mostrar el formulario si no se ha creado un grupo exitosamente */}
              {!createdGroup && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nombre del Grupo
                    </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="name"
                    placeholder="Ingresa el nombre del grupo"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">
                    Entre 3 y 50 caracteres
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Descripción
                  </label>
                  <textarea
                    className="form-control form-control-lg"
                    name="description"
                    rows="4"
                    placeholder="Describe el propósito del grupo"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">
                    Entre 10 y 300 caracteres
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Imagen del Grupo (Opcional)
                  </label>
                  <input
                    type="url"
                    className="form-control form-control-lg"
                    name="image"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={form.image}
                    onChange={handleChange}
                  />
                  <div className="form-text">
                    URL de una imagen para representar el grupo
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isPrivate"
                      id="isPrivate"
                      checked={form.isPrivate}
                      onChange={handleChange}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="isPrivate">
                      🔒 Grupo Privado
                    </label>
                    <div className="form-text">
                      Los grupos privados requieren invitación para unirse
                    </div>
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-success btn-lg"
                  >
                    ✨ Crear Grupo
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/groups")}
                  >
                    ← Volver a Grupos
                  </button>
                </div>
              </form>
              )}
              
              {/* Botón para volver cuando se ha creado un grupo */}
              {createdGroup && (
                <div className="d-grid">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/groups")}
                  >
                    ← Volver a Grupos
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupForm;