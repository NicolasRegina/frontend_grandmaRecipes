import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      {/* Hero Section */}
      <div className="row justify-content-center align-items-center min-vh-100 bg-light">
        <div className="col-12 col-lg-8 text-center">
          <div className="py-5">
            {/* Title */}
            <h1 className="display-4 fw-bold text-primary mb-4">
              Bienvenido al Recetario de la Abuela
            </h1>

            {/* Subtitle */}
            <p className="lead text-muted mb-5">
              El lugar perfecto para preservar y compartir las recetas más
              preciadas de tu familia
            </p>

            {/* Description */}
            <div className="row justify-content-center mb-5">
              <div className="col-12 col-md-10">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="h5 text-dark mb-3">
                      ¿Qué puedes hacer aquí?
                    </h3>
                    <div className="row text-start">
                      <div className="col-12 col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-book text-primary me-3 mt-1"></i>
                          <div>
                            <h6 className="fw-semibold mb-1">
                              Gestionar Recetas
                            </h6>
                            <p className="text-muted small mb-0">
                              Crea, edita y organiza todas tus recetas favoritas
                              en un solo lugar
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-people text-success me-3 mt-1"></i>
                          <div>
                            <h6 className="fw-semibold mb-1">Crear Grupos</h6>
                            <p className="text-muted small mb-0">
                              Forma grupos familiares o de amigos para compartir
                              recetas especiales
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-share text-info me-3 mt-1"></i>
                          <div>
                            <h6 className="fw-semibold mb-1">
                              Compartir Tradiciones
                            </h6>
                            <p className="text-muted small mb-0">
                              Preserva las recetas familiares y compártelas con
                              las nuevas generaciones
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-heart text-danger me-3 mt-1"></i>
                          <div>
                            <h6 className="fw-semibold mb-1">
                              Guardar Favoritas <span className="fw-normal">- Próximamente</span>
                            </h6>
                            <p className="text-muted small mb-0">
                              Marca tus recetas preferidas y accede a ellas
                              fácilmente
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <button
                className="btn btn-primary btn-lg px-5 py-3"
                onClick={() => navigate("/recipes")}
              >
                <i className="bi bi-book me-2"></i>
                Explorar Recetas
              </button>
              <button
                className="btn btn-success btn-lg px-5 py-3"
                onClick={() => navigate("/groups")}
              >
                <i className="bi bi-people me-2"></i>
                Ver Grupos
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-5 pt-4">
              <p className="text-muted">
                <small>
                  <i className="bi bi-shield-check me-1"></i>
                  Tus recetas están seguras y siempre accesibles
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
