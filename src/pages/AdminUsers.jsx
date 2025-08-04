import { useEffect, useState } from "react";
import { getAllUsers, updateUserById, deleteUserById, registerUserByAdmin } from "../api/users";
import { useAuth } from "../context/AuthContext";

const ROLES = ["user", "admin"];

export default function AdminUsers() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", bio: "", role: "user" });
  const [createForm, setCreateForm] = useState({ name: "", email: "", bio: "", role: "user", password: "" });
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(""); // Limpiar errores previos
    try {
      const res = await getAllUsers(token);
      setUsers(res.data);
    } catch (err) {
      setError("Error al cargar usuarios");
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token && user?.role === "admin") fetchUsers();
    // eslint-disable-next-line
  }, [token]);

  const handleEdit = (u) => {
    setEditUser(u);
    setEditForm({ name: u.name, email: u.email, bio: u.bio, role: u.role });
    setError(""); // Limpiar errores
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar usuario?")) {
      try {
        await deleteUserById(id, token);
        fetchUsers();
        setError(""); // Limpiar errores
      } catch (err) {
        setError("Error al eliminar usuario");
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUserById(editUser._id, editForm, token);
      setEditUser(null);
      setEditForm({ name: "", email: "", bio: "", role: "user" });
      fetchUsers();
      setError(""); // Limpiar errores
    } catch (err) {
      setError("Error al actualizar usuario");
      console.error("Error updating user:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await registerUserByAdmin(createForm, token);
      setCreating(false);
      setCreateForm({ name: "", email: "", bio: "", role: "user", password: "" });
      fetchUsers();
      setError(""); // Limpiar errores
    } catch (err) {
      setError("Error al crear usuario");
      console.error("Error creating user:", err);
    }
  };

  const handleCancelCreate = () => {
    setCreating(false);
    setCreateForm({ name: "", email: "", bio: "", role: "user", password: "" });
    setError(""); // Limpiar errores
  };

  const handleCancelEdit = () => {
    setEditUser(null);
    setEditForm({ name: "", email: "", bio: "", role: "user" });
    setError(""); // Limpiar errores
  };

  return (
    <div className="container py-4">
      <h2>Administrar Usuarios</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-success mb-3" onClick={() => setCreating(true)}>+ Nuevo Usuario</button>
      {creating && (
        <form className="mb-4" onSubmit={handleCreate}>
          <div className="row g-2">
            <div className="col">
              <input className="form-control" placeholder="Nombre" value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="col">
              <input className="form-control" placeholder="Email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="col">
              <input className="form-control" placeholder="Contraseña" type="password" value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <div className="col">
              <input className="form-control" placeholder="Bio" value={createForm.bio} onChange={e => setCreateForm(f => ({ ...f, bio: e.target.value }))} />
            </div>
            <div className="col">
              <select className="form-select" value={createForm.role} onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="col">
              <button className="btn btn-primary" type="submit">Crear</button>
              <button className="btn btn-secondary ms-2" type="button" onClick={handleCancelCreate}>Cancelar</button>
            </div>
          </div>
        </form>
      )}
      {loading ? <div>Cargando...</div> : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Bio</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.bio}</td>
                <td>{u.role}</td>
                <td>
                  <button 
                    className="btn btn-warning btn-sm me-2" 
                    onClick={() => handleEdit(u)}
                    title="Editar usuario"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => handleDelete(u._id)}
                    title="Eliminar usuario"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editUser && (
        <form className="mt-4" onSubmit={handleUpdate}>
          <h5>Editar Usuario</h5>
          <div className="row g-2">
            <div className="col">
              <input className="form-control" placeholder="Nombre" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="col">
              <input className="form-control" placeholder="Bio" value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} />
            </div>
            <div className="col">
              <select className="form-select" value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="col">
              <button className="btn btn-primary" type="submit">Guardar</button>
              <button className="btn btn-secondary ms-2" type="button" onClick={handleCancelEdit}>Cancelar</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
