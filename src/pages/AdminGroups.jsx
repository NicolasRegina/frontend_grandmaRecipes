import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllGroupsAdmin, deleteGroupByIdAdmin } from "../api/groupsAdmin";
import { useAuth } from "../context/AuthContext";

export default function AdminGroups() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await getAllGroupsAdmin(token);
      setGroups(res.data);
    } catch {
      setError("Error al cargar grupos");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token && user?.role === "admin") fetchGroups();
    // eslint-disable-next-line
  }, [token]);

  const handleEdit = (group) => {
    navigate(`/groups/${group._id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar grupo?")) {
      await deleteGroupByIdAdmin(id, token);
      fetchGroups();
    }
  };

  return (
    <div className="container py-4">
      <h2>Administrar Grupos</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div>Cargando...</div> : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Privado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(g => (
              <tr key={g._id}>
                <td>{g.name}</td>
                <td>{g.description}</td>
                <td>{g.isPrivate ? "Sí" : "No"}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(g)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(g._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
