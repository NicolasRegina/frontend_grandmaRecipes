import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRecipeById, updateRecipe } from "../api/recipes";
import { getUserGroups } from "../api/groups";

const initialIngredient = { name: "", quantity: "", unit: "" };
const initialStep = { number: 1, description: "" };

const EditRecipeForm = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: [{ ...initialIngredient }],
    steps: [{ ...initialStep }],
    prepTime: 1,
    cookTime: 0,
    servings: 1,
    difficulty: "Fácil",
    category: "Desayuno",
    tags: [],
    image: "",
    group: "",
    isPrivate: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Cargar grupos al montar el componente
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoadingGroups(true);
        const response = await getUserGroups(token);
        setGroups(response.data || response);
      } catch (err) {
        console.error("Error al cargar grupos:", err);
        setGroups([]);
      } finally {
        setLoadingGroups(false);
      }
    };

    if (token) {
      fetchGroups();
    }
  }, [token]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id, token);
        console.log("Recipe data loaded:", data); // Debug
        
        setForm({
          title: data.title || "",
          description: data.description || "",
          ingredients: (data.ingredients && data.ingredients.length > 0)
            ? data.ingredients
            : [{ ...initialIngredient }],
          steps: (data.steps && data.steps.length > 0) 
            ? data.steps 
            : [{ ...initialStep }],
          prepTime: data.prepTime || 1,
          cookTime: data.cookTime || 0,
          servings: data.servings || 1,
          difficulty: data.difficulty || "Fácil",
          category: data.category || "Desayuno",
          tags: Array.isArray(data.tags) ? data.tags : [],
          image: data.image || "",
          group: (data.group && typeof data.group === "object") 
            ? data.group._id || ""
            : data.group || "",
          isPrivate: data.isPrivate ?? false,
        });
        
        // Sincronizar tagsInput con los tags cargados
        setTagsInput(Array.isArray(data.tags) ? data.tags.join(", ") : "");
      } catch (error) {
        console.error("Error loading recipe:", error);
        setError(`No se pudo cargar la receta: ${error.message}`);
      }
      setLoading(false);
    };
    fetchRecipe();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Ingredientes
  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...form.ingredients];
    updated[index][name] = value;
    setForm({ ...form, ingredients: updated });
  };

  const addIngredient = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, { ...initialIngredient }],
    });
  };

  const removeIngredient = (index) => {
    const updated = form.ingredients.filter((_, i) => i !== index);
    setForm({ ...form, ingredients: updated });
  };

  // Pasos
  const handleStepChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...form.steps];
    updated[index][name] = value;
    setForm({ ...form, steps: updated });
  };

  const addStep = () => {
    setForm({
      ...form,
      steps: [
        ...form.steps,
        { number: form.steps.length + 1, description: "" },
      ],
    });
  };

  const removeStep = (index) => {
    const updated = form.steps
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, number: idx + 1 }));
    setForm({ ...form, steps: updated });
  };

  // Tags - Manejamos las comas de manera más natural
  const handleTagsInputChange = (e) => {
    setTagsInput(e.target.value);
  };

  const handleTagsBlur = () => {
    // Procesar tags solo cuando el usuario termine de escribir
    const processedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    
    setForm({
      ...form,
      tags: processedTags,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.title.length < 3 || form.title.length > 100) {
      setError("El título debe tener entre 3 y 100 caracteres.");
      return;
    }
    if (form.description.length < 10 || form.description.length > 500) {
      setError("La descripción debe tener entre 10 y 500 caracteres.");
      return;
    }
    if (form.ingredients.length < 1) {
      setError("Debe haber al menos un ingrediente.");
      return;
    }
    if (form.steps.length < 1) {
      setError("Debe haber al menos un paso.");
      return;
    }

    // Limpiar IDs de MongoDB para evitar conflictos
    // eslint-disable-next-line no-unused-vars
    const cleanIngredients = form.ingredients.map(({ _id, ...rest }) => rest);
    // eslint-disable-next-line no-unused-vars
    const cleanSteps = form.steps.map(({ _id, ...rest }) => rest);

    const dataToSend = {
      ...form,
      ingredients: cleanIngredients,
      steps: cleanSteps,
      group: form.group === "" ? null : form.group, // Convertir cadena vacía a null
    };

    try {
      const response = await updateRecipe(id, dataToSend, token);
      setSuccess(response.message || "Receta actualizada exitosamente");
      setTimeout(() => navigate("/recipes"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar la receta");
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
        <p className="text-center mt-3 text-muted">Cargando datos de la receta...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 text-primary">Editar Receta</h2>

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

              <form onSubmit={handleSubmit}>
                {/* Información básica */}
                <div className="row">
                  <div className="col-12 col-md-8">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Título de la Receta
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="title"
                        placeholder="Ingresa el nombre de tu receta"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                      <div className="form-text">Entre 3 y 100 caracteres</div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Imagen (Opcional)
                      </label>
                      <input
                        type="url"
                        className="form-control form-control-lg"
                        name="image"
                        placeholder="URL de la imagen"
                        value={form.image}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Descripción</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    placeholder="Describe tu receta, ingredientes principales, ocasión especial..."
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">Entre 10 y 500 caracteres</div>
                </div>

                {/* Ingredientes */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Ingredientes</h4>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={addIngredient}
                    >
                      🥕 Agregar Ingrediente
                    </button>
                  </div>

                  {form.ingredients.map((ing, idx) => (
                    <div key={idx} className="card mb-2 bg-light">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-12 col-md-5">
                            <input
                              className="form-control"
                              name="name"
                              placeholder="Nombre del ingrediente"
                              value={ing.name}
                              onChange={(e) => handleIngredientChange(idx, e)}
                              required
                            />
                          </div>
                          <div className="col-6 col-md-3">
                            <input
                              className="form-control"
                              name="quantity"
                              placeholder="⚖️ Cantidad"
                              value={ing.quantity}
                              onChange={(e) => handleIngredientChange(idx, e)}
                              required
                            />
                          </div>
                          <div className="col-6 col-md-3">
                            <input
                              className="form-control"
                              name="unit"
                              placeholder="📏 Unidad (ej: gr, ml)"
                              value={ing.unit}
                              onChange={(e) => handleIngredientChange(idx, e)}
                            />
                          </div>
                          <div className="col-12 col-md-1 text-end">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeIngredient(idx)}
                              disabled={form.ingredients.length === 1}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pasos */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Pasos de Preparación</h4>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={addStep}
                    >
                      🥄 Agregar Paso
                    </button>
                  </div>

                  {form.steps.map((step, idx) => (
                    <div key={idx} className="card mb-2 bg-light">
                      <div className="card-body p-3">
                        <div className="row align-items-start">
                          <div className="col-12 col-md-11">
                            <label className="form-label fw-semibold">
                              Paso {idx + 1}
                            </label>
                            <textarea
                              className="form-control"
                              name="description"
                              rows="2"
                              placeholder="Describe este paso de preparación en detalle..."
                              value={step.description}
                              onChange={(e) => handleStepChange(idx, e)}
                              required
                            />
                          </div>
                          <div className="col-12 col-md-1 text-end">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeStep(idx)}
                              disabled={form.steps.length === 1}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tiempos y porciones */}
                <div className="row mb-4">
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold">
                      ⏱️ Tiempo de Prep. (min)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="prepTime"
                      min="1"
                      value={form.prepTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold">
                      🔥 Tiempo de Cocción (min)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="cookTime"
                      min="0"
                      value={form.cookTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-2">
                    <label className="form-label fw-semibold">
                      🍽️ Porciones
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="servings"
                      min="1"
                      value={form.servings}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-2">
                    <label className="form-label fw-semibold">
                      📊 Dificultad
                    </label>
                    <select
                      className="form-select"
                      name="difficulty"
                      value={form.difficulty}
                      onChange={handleChange}
                    >
                      <option value="Fácil">Fácil</option>
                      <option value="Media">Media</option>
                      <option value="Difícil">Difícil</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-2">
                    <label className="form-label fw-semibold">
                      🏷️ Categoría
                    </label>
                    <select
                      className="form-select"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option value="Desayuno">Desayuno</option>
                      <option value="Almuerzo">Almuerzo</option>
                      <option value="Cena">Cena</option>
                      <option value="Postre">Postre</option>
                      <option value="Merienda">Merienda</option>
                      <option value="Bebida">Bebida</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                {/* Tags y opciones */}
                <div className="row mb-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">#️⃣ Tags</label>
                    <input
                      className="form-control"
                      name="tags"
                      placeholder="vegetariano, saludable, rápido (separados por coma)"
                      value={tagsInput}
                      onChange={handleTagsInputChange}
                      onBlur={handleTagsBlur}
                    />
                    <div className="form-text">Separados por comas</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                      👥 Grupo (Opcional)
                    </label>
                    <select
                      className="form-select"
                      name="group"
                      value={form.group}
                      onChange={handleChange}
                    >
                      <option value="">Sin grupo específico</option>
                      {loadingGroups ? (
                        <option disabled>Cargando grupos...</option>
                      ) : (
                        groups.map((group) => (
                          <option key={group._id} value={group._id}>
                            {group.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Opciones de privacidad */}
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
                    <label
                      className="form-check-label fw-semibold"
                      htmlFor="isPrivate"
                    >
                      🔒 Receta Privada
                    </label>
                    <div className="form-text">
                      Las recetas privadas solo son visibles para ti
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => navigate("/recipes")}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success btn-lg">
                    Actualizar Receta
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

export default EditRecipeForm;
