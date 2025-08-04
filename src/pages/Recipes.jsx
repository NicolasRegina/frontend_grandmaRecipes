import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRecipes, searchRecipes, deleteRecipe } from "../api/recipes";
import { useNavigate, useLocation } from "react-router-dom";
import RecipeSearchBar from "../components/RecipeSearchBar";
import ModerationStatus from "../components/ModerationStatus";

const Recipes = () => {
  const { token, user } = useAuth();
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await getRecipes(token);
      // El backend devuelve {recipes, totalPages, currentPage, totalRecipes}
      const recipesArray = data.recipes || data;
      setRecipes(Array.isArray(recipesArray) ? recipesArray : []);
      setError("");
    } catch (err) {
      console.error("Error al cargar recetas:", err);
      setError("No se pudieron cargar las recetas.");
      setRecipes([]);
    }
    setLoading(false);
  };

  const handleSearch = async (params) => {
    setLoading(true);
    try {
      if (!params.q && !params.category && !params.difficulty) {
        fetchRecipes();
        return;
      }
      const data = await searchRecipes(params, token);
      // Para la búsqueda, el backend devuelve directamente el array
      setRecipes(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setError("No se pudo realizar la búsqueda.");
      setRecipes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
    
    // Si viene con query param refresh=true, limpiar la URL
    const params = new URLSearchParams(location.search);
    if (params.get('refresh') === 'true') {
      // Limpiar la URL sin recargar la página
      navigate('/recipes', { replace: true });
    }
    // eslint-disable-next-line
  }, [location.search]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas borrar la receta?")) {
      try {
        await deleteRecipe(id, token);
        fetchRecipes();
      } catch {
        alert("Error al borrar receta");
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="display-5 fw-bold text-dark mb-0">
              {user?.role === "admin" ? "Todas las Recetas" : "Mis Recetas"}
            </h1>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/recipes/new")}
            >
              ➕ Nueva Receta
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="mb-4">
            <RecipeSearchBar onSearch={handleSearch} />
          </div>
          
          {/* Status Messages */}
          {error && (
            <div className="alert alert-danger" role="alert">
              ⚠️ {error}
            </div>
          )}
          
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2 text-muted">Cargando recetas...</p>
            </div>
          )}
        </div>
      </div>

      {/* Recipes Grid */}
      {!loading && (
        <div className="row">
          {Array.isArray(recipes) && recipes.length > 0 ? (
            recipes.map((receta) => (
              <div key={receta._id} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm border-0">
                  {/* Recipe Image */}
                  <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                    {receta.image ? (
                      <img 
                        src={receta.image} 
                        alt={receta.title}
                        className="img-fluid rounded-top"
                        style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                      />
                    ) : (
                      <div className="text-center">
                        🖼️
                      </div>
                    )}
                  </div>
                  
                  {/* Card Body */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-primary mb-2">{receta.title}</h5>
                    
                    {/* Mostrar estado de moderación si es del usuario */}
                    {receta.author?._id === user?._id && (
                      <ModerationStatus 
                        status={receta.moderationStatus}
                        rejectionReason={receta.rejectionReason}
                        moderatedAt={receta.moderatedAt}
                        type="receta"
                      />
                    )}
                    
                    {/* Recipe Info */}
                    <div className="mb-3">
                      <span className="badge bg-secondary me-2">
                        🏷️ {receta.category}
                      </span>
                      {receta.difficulty && (
                        <span className="badge bg-info">
                          📊 {receta.difficulty}
                        </span>
                      )}
                    </div>
                    
                    {receta.description && (
                      <p className="card-text text-muted small mb-3" style={{ flexGrow: 1 }}>
                        {receta.description.length > 100 
                          ? `${receta.description.substring(0, 100)}...` 
                          : receta.description
                        }
                      </p>
                    )}
                    
                    {/* Author Info */}
                    <div className="mb-3">
                      <small className="text-muted">
                        👤 Por: {receta.author?.name || 'Anónimo'}
                      </small>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-auto">
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-primary flex-fill"
                          onClick={() => navigate(`/recipes/${receta._id}`)}
                        >
                          Ver Detalle
                        </button>
                        
                        {user && (receta.author?._id === user?._id || user.role === "admin") && (
                          <>
                            <button 
                              className="btn btn-warning btn-sm"
                              onClick={() => navigate(`/recipes/${receta._id}/edit`)}
                              title="Editar receta"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(receta._id)}
                              title="Eliminar receta"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="col-12">
                <div className="text-center py-5">
                  📚
                  <h3 className="text-muted mb-3">No hay recetas disponibles</h3>
                  <p className="text-muted mb-4">
                    {error ? 'No se pudieron cargar las recetas.' : 'Comienza creando tu primera receta.'}
                  </p>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate("/recipes/new")}
                  >
                    ➕ Crear Primera Receta
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Recipes;