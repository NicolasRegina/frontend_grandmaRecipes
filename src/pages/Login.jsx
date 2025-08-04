import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginAPI } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginAPI(form);
      // Solo recibo { message, token }
      await login(data.token); // login se encarga de pedir el profile
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Iniciar Sesión</h2>
              
              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
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
                    placeholder="Ingresa tu contraseña"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <button 
                  className="btn btn-primary btn-lg w-100 mb-3" 
                  type="submit"
                >
                  Ingresar
                </button>
              </form>
              
              <div className="text-center">
                <small className="text-muted">
                  ¿No tienes cuenta? <a href="/register" className="text-decoration-none">Regístrate aquí</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
