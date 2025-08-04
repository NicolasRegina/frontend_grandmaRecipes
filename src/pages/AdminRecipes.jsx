import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRecipesAdmin, deleteRecipeByIdAdmin } from "../api/recipesAdmin";
import { useAuth } from "../context/AuthContext";

export default function AdminRecipes() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await getAllRecipesAdmin(token);
      setRecipes(res.data);
    } catch {
      setError("Error al cargar recetas");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token && user?.role === "admin") fetchRecipes();
    // eslint-disable-next-line
  }, [token]);

  const handleEdit = (recipe) => {
    navigate(`/recipes/${recipe._id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar receta?")) {
      await deleteRecipeByIdAdmin(id, token);
      fetchRecipes();
    }
  };

  return (
    <div className="container py-4">
      <h2>Administrar Recetas</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div>Cargando...</div> : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Dificultad</th>
              <th>Autor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map(r => (
              <tr key={r._id}>
                <td>{r.title}</td>
                <td>{r.category}</td>
                <td>{r.difficulty}</td>
                <td>{r.author?.name || "-"}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(r)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
