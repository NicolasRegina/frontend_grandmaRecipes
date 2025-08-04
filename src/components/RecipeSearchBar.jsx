import { useState } from "react";

const categories = ["Desayuno", "Almuerzo", "Cena", "Postre", "Merienda", "Bebida", "Otro"];
const difficulties = ["Fácil", "Media", "Difícil"];

const RecipeSearchBar = ({ onSearch }) => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ q, category, difficulty });
  };

  const handleClear = () => {
    setQ("");
    setCategory("");
    setDifficulty("");
    onSearch({ q: "", category: "", difficulty: "" });
  };

  return (
    <div className="card border-0 shadow-sm bg-light">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-2 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Buscar recetas..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Select */}
            <div className="col-12 col-lg-2">
              <select 
                className="form-select"
                value={category} 
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">🏷️ Categoría</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            {/* Difficulty Select */}
            <div className="col-12 col-lg-2">
              <select 
                className="form-select"
                value={difficulty} 
                onChange={e => setDifficulty(e.target.value)}
              >
                <option value="">📊 Dificultad</option>
                {difficulties.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            
            {/* Action Buttons */}
            <div className="col-12 col-lg-3">
              <div className="d-flex gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary flex-fill"
                  onClick={handleClear}
                >
                  🗑️ Limpiar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary flex-fill"
                >
                  🔍 Buscar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeSearchBar;