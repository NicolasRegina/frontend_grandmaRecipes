import { useState } from 'react';
import { searchGroups, findGroupByInviteCode, requestJoinGroup } from '../api/groups';
import { useAuth } from '../context/AuthContext';

const GroupSearchBar = ({ onGroupFound }) => {
    const { token } = useAuth();
    const [searchType, setSearchType] = useState('name'); // 'name' o 'code'
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [inviteGroup, setInviteGroup] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setResults([]);
        setInviteGroup(null);

        try {
            if (searchType === 'name') {
                // Búsqueda por nombre
                const data = await searchGroups(query, token);
                setResults(data);
            } else {
                // Búsqueda por código de invitación
                const data = await findGroupByInviteCode(query, token);
                setInviteGroup(data.group);
            }
        } catch {
            setError(searchType === 'name' ? 
                'No se encontraron grupos con ese nombre' : 
                'Código de invitación inválido o grupo no encontrado'
            );
        }
        setLoading(false);
    };

    const handleJoinRequest = async (code) => {
        try {
            const response = await requestJoinGroup(code, token);
            alert(response.message);
            setInviteGroup(null);
            setQuery('');
        } catch (err) {
            alert(err.response?.data?.message || 'Error al solicitar unirse al grupo');
        }
    };

    const handleSelectGroup = (group) => {
        if (onGroupFound) {
            onGroupFound(group);
        }
        setResults([]);
        setQuery('');
    };

    return (
        <div className="mb-4">
            <div className="card">
                <div className="card-header">
                    <h6 className="mb-0">🔍 Buscar Grupos</h6>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSearch} className="mb-3">
                        <div className="row g-2">
                            <div className="col-auto">
                                <select 
                                    className="form-select"
                                    value={searchType}
                                    onChange={(e) => {
                                        setSearchType(e.target.value);
                                        setQuery('');
                                        setResults([]);
                                        setInviteGroup(null);
                                        setError('');
                                    }}
                                >
                                    <option value="name">Por nombre</option>
                                    <option value="code">Por código</option>
                                </select>
                            </div>
                            <div className="col">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={searchType === 'name' ? 
                                        'Buscar grupos por nombre...' : 
                                        'Ingresa código de invitación (ej: ABC123)'
                                    }
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    maxLength={searchType === 'code' ? 8 : 50}
                                />
                            </div>
                            <div className="col-auto">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={loading || !query.trim()}
                                >
                                    {loading ? '🔍' : 'Buscar'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {error && (
                        <div className="alert alert-warning">
                            {error}
                        </div>
                    )}

                    {/* Resultados de búsqueda por nombre */}
                    {results.length > 0 && (
                        <div>
                            <h6>Resultados encontrados:</h6>
                            <div className="list-group">
                                {results.map(group => (
                                    <div key={group._id} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">{group.name}</h6>
                                                <p className="mb-1 text-muted small">{group.description}</p>
                                                <small>
                                                    <span className={`badge ${group.isPrivate ? 'bg-warning' : 'bg-success'} me-2`}>
                                                        {group.isPrivate ? '🔒 Privado' : '🌍 Público'}
                                                    </span>
                                                    <span className="text-muted">
                                                        👤 {group.creator?.name}
                                                    </span>
                                                    {group.isMember && (
                                                        <span className="badge bg-info ms-2">
                                                            {group.userRole === 'owner' ? '👑 Propietario' :
                                                             group.userRole === 'admin' ? '🛡️ Admin' : '👤 Miembro'}
                                                        </span>
                                                    )}
                                                </small>
                                            </div>
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleSelectGroup(group)}
                                            >
                                                Ver Detalle
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resultado de búsqueda por código */}
                    {inviteGroup && (
                        <div>
                            <h6>Grupo encontrado:</h6>
                            <div className="card border-primary">
                                <div className="card-body">
                                    <h5 className="card-title">{inviteGroup.name}</h5>
                                    <p className="card-text">{inviteGroup.description}</p>
                                    <div className="mb-3">
                                        <span className={`badge ${inviteGroup.isPrivate ? 'bg-warning' : 'bg-success'} me-2`}>
                                            {inviteGroup.isPrivate ? '🔒 Privado' : '🌍 Público'}
                                        </span>
                                        <span className="badge bg-secondary">
                                            📧 {inviteGroup.inviteCode}
                                        </span>
                                    </div>
                                    <small className="text-muted d-block mb-3">
                                        👤 Creado por: {inviteGroup.creator?.name}
                                    </small>
                                    
                                    {inviteGroup.isMember ? (
                                        <div>
                                            <span className="badge bg-success">✅ Ya eres miembro</span>
                                            <button
                                                className="btn btn-outline-primary btn-sm ms-2"
                                                onClick={() => handleSelectGroup(inviteGroup)}
                                            >
                                                Ver Grupo
                                            </button>
                                        </div>
                                    ) : inviteGroup.hasPendingRequest ? (
                                        <span className="badge bg-warning">⏳ Solicitud pendiente</span>
                                    ) : (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleJoinRequest(inviteGroup.inviteCode)}
                                        >
                                            {inviteGroup.isPrivate ? '📩 Solicitar Unirse' : '✅ Unirse al Grupo'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupSearchBar;
