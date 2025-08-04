import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerAPI } from "../api/auth";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await registerAPI(form);
      setSuccess("Usuario registrado correctamente. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 text-dark">Registrarse</h2>
              
              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success text-center" role="alert">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input
                    className="form-control form-control-lg"
                    name="name"
                    type="text"
                    placeholder="Ingresa tu nombre completo"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    className="form-control form-control-lg"
                    name="email"
                    type="email"
                    placeholder="Ingresa tu email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input
                    className="form-control form-control-lg"
                    name="password"
                    type="password"
                    placeholder="Crea una contraseña segura"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <button 
                  className="btn btn-success btn-lg w-100 mb-3" 
                  type="submit"
                >
                  Crear Cuenta
                </button>
              </form>
              
              <div className="text-center">
                <small className="text-muted">
                  ¿Ya tienes cuenta? <a href="/login" className="text-decoration-none">Inicia sesión aquí</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
