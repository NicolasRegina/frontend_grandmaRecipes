import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getGroupById, updateGroup } from "../api/groups";

const EditGroupForm = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    isPrivate: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await getGroupById(id, token);
        setForm({
          name: data.name || "",
          description: data.description || "",
          image: data.image || "",
          isPrivate: data.isPrivate ?? true,
        });
      } catch {
        setError("No se pudo cargar el grupo.");
      }
      setLoading(false);
    };
    fetchGroup();
  }, [id, token]);

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

    if (form.name.trim().length < 3 || form.name.trim().length > 50) {
      setError("El nombre debe tener entre 3 y 50 caracteres.");
      return;
    }
    if (
      form.description.trim().length < 10 ||
      form.description.trim().length > 300
    ) {
      setError("La descripción debe tener entre 10 y 300 caracteres.");
      return;
    }

    const groupData = {
      name: form.name.trim(),
      description: form.description.trim(),
      isPrivate: form.isPrivate,
    };
    if (form.image.trim()) groupData.image = form.image.trim();

    try {
      const response = await updateGroup(id, groupData, token);
      setSuccess(response.message || "Grupo actualizado exitosamente");
      setTimeout(() => navigate("/groups"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el grupo");
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2 text-muted">Cargando datos del grupo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 text-warning">
                Editar Grupo
              </h2>
              
              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  ⚠️ {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success text-center" role="alert">
                  ✅ {success}
                </div>
              )}
              
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
                    className="btn btn-warning btn-lg"
                  >
                    Actualizar Grupo
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGroupForm;
