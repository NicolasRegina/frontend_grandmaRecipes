import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRecipeById, deleteRecipe } from "../api/recipes";

const RecipeDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id, token);
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError("No se pudo cargar la receta.");
      }
    };
    fetchRecipe();
  }, [id, token]);

  const handleDelete = async () => {
    if (window.confirm("¿Seguro que deseas eliminar esta receta?")) {
      try {
        await deleteRecipe(recipe._id, token);
        navigate("/recipes");
      } catch (error) {
        console.error("Error deleting recipe:", error);
        setError("No tienes permiso para eliminar esta receta.");
      }
    }
  };

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <strong>😞 Error:</strong> {error}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate("/recipes")}
        >
          ⬅️ Volver a Recetas
        </button>
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
        <p className="text-center mt-3 text-muted">Cargando receta...</p>
      </div>
    );
  }

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      "Fácil": "success",
      "Media": "warning", 
      "Difícil": "danger"
    };
    return badges[difficulty] || "secondary";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Desayuno": "🌅",
      "Almuerzo": "🍽️",
      "Cena": "🌙",
      "Postre": "🍰",
      "Merienda": "☕",
      "Bebida": "🥤",
      "Otro": "🍴"
    };
    return icons[category] || "🍴";
  };

  return (
    <div className="container py-4">
      {/* Botón volver */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-primary"
          onClick={() => navigate("/recipes")}
        >
          ⬅️ Volver a Recetas
        </button>
      </div>

      <div className="row">
        {/* Columna principal */}
        <div className="col-12 col-lg-8">
          <div className="card shadow mb-4">
            <div className="card-body">
              {/* Header con título y badges */}
              <div className="d-flex flex-wrap justify-content-between align-items-start mb-4">
                <div className="flex-grow-1 me-3">
                  <h1 className="card-title mb-2">{recipe.title}</h1>
                  <p className="text-muted mb-3">{recipe.description}</p>
                  
                  <div className="d-flex flex-wrap gap-2">
                    <span className={`badge bg-${getDifficultyBadge(recipe.difficulty)} fs-6`}>
                      📊 {recipe.difficulty}
                    </span>
                    <span className="badge bg-info fs-6">
                      {getCategoryIcon(recipe.category)} {recipe.category}
                    </span>
                    {recipe.isPrivate && (
                      <span className="badge bg-warning fs-6">
                        🔒 Privada
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Imagen */}
              <div className="text-center mb-4">
                <img
                  src={recipe.image || "/img/default-recipe.jpg"}
                  alt={recipe.title}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              </div>

              {/* Información rápida */}
              <div className="row text-center mb-4">
                <div className="col-6 col-md-3">
                  <div className="card bg-light h-100">
                    <div className="card-body py-3">
                      <div className="h5 mb-0 text-primary">⏱️</div>
                      <small className="text-muted">Preparación</small>
                      <div className="fw-bold">{recipe.prepTime} min</div>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="card bg-light h-100">
                    <div className="card-body py-3">
                      <div className="h5 mb-0 text-primary">🔥</div>
                      <small className="text-muted">Cocción</small>
                      <div className="fw-bold">{recipe.cookTime} min</div>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="card bg-light h-100">
                    <div className="card-body py-3">
                      <div className="h5 mb-0 text-primary">🍽️</div>
                      <small className="text-muted">Porciones</small>
                      <div className="fw-bold">{recipe.servings}</div>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="card bg-light h-100">
                    <div className="card-body py-3">
                      <div className="h5 mb-0 text-primary">⏰</div>
                      <small className="text-muted">Total</small>
                      <div className="fw-bold">
                        {recipe.prepTime + recipe.cookTime} min
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">#️⃣ Tags</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {recipe.tags.map((tag, idx) => (
                      <span key={idx} className="badge bg-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ingredientes */}
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title mb-0">🥕 Ingredientes</h4>
            </div>
            <div className="card-body">
              <div className="row">
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="col-12 col-md-6 mb-2">
                    <div className="d-flex align-items-center p-2 bg-light rounded">
                      <span className="badge bg-primary me-2">{idx + 1}</span>
                      <span className="fw-semibold me-2">{ing.quantity}</span>
                      {ing.unit && <span className="text-muted me-2">{ing.unit}</span>}
                      <span>{ing.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pasos */}
          <div className="card shadow mb-4">
            <div className="card-header bg-success text-white">
              <h4 className="card-title mb-0">🥄 Instrucciones</h4>
            </div>
            <div className="card-body">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                  <span className="badge bg-success me-3 mt-1" style={{ minWidth: "2rem" }}>
                    {idx + 1}
                  </span>
                  <p className="mb-0 flex-grow-1">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-12 col-lg-4">
          {/* Información del autor */}
          <div className="card shadow mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">👨‍🍳 Autor</h5>
            </div>
            <div className="card-body text-center">
              <div className="mb-3">
                <img
                  src="/img/default-profile.png"
                  alt="Perfil"
                  className="rounded-circle"
                  width="60"
                  height="60"
                />
              </div>
              <h6 className="fw-bold">{recipe.author?.name}</h6>
              {recipe.group && (
                <div className="mt-2">
                  <small className="text-muted">Grupo:</small>
                  <div className="badge bg-info ms-1">
                    👥 {recipe.group.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          {user && recipe.author?._id === user._id && (
            <div className="card shadow mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">⚙️ Acciones</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-warning"
                    onClick={() => navigate(`/recipes/${recipe._id}/edit`)}
                  >
                    ✏️ Editar Receta
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    🗑️ Eliminar Receta
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="card shadow">
            <div className="card-header">
              <h5 className="card-title mb-0">ℹ️ Información</h5>
            </div>
            <div className="card-body">
              <div className="small text-muted">
                <p className="mb-2">
                  <strong>📅 Creada:</strong><br />
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </p>
                {recipe.updatedAt !== recipe.createdAt && (
                  <p className="mb-2">
                    <strong>📝 Actualizada:</strong><br />
                    {new Date(recipe.updatedAt).toLocaleDateString()}
                  </p>
                )}
                <p className="mb-0">
                  <strong>👁️ Visibilidad:</strong><br />
                  {recipe.isPrivate ? "🔒 Privada" : "🌍 Pública"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
