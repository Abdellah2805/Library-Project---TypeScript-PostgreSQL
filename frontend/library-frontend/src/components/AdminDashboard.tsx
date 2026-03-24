import { useEffect, useState } from 'react';
import api from '../api/axios';
import './AdminDashboard.css';

export const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [tab, setTab] = useState('users'); // Onglet par défaut : Utilisateurs

    const fetchData = async () => {
        try {
            const usersRes = await api.get('/admin/users');
            const booksRes = await api.get('/livres');
            setUsers(usersRes.data);
            setBooks(booksRes.data);
        } catch (err) { console.error("Erreur dashboard", err); }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteUser = async (id: number) => {
        if(window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
            try {
                await api.delete(`/admin/users/${id}`);
                fetchData(); // Rafraîchir la liste
            } catch (err) { console.error("Erreur de suppression", err); }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload(); // Recharger pour revenir au Login
    };

    return (
        <div className="admin-layout">
            {/* --- Barre latérale (Sidebar) --- */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <h2>MaBibli</h2>
                    <span>Admin Panel</span>
                </div>
                <nav className="admin-nav">
                    <button 
                        onClick={() => setTab('users')} 
                        className={tab === 'users' ? 'active' : ''}
                    >
                        <span className="icon">👥</span> Membres
                    </button>
                    <button 
                        onClick={() => setTab('books')} 
                        className={tab === 'books' ? 'active' : ''}
                    >
                        <span className="icon">📚</span> Livres
                    </button>
                </nav>
                <button onClick={handleLogout} className="logout-btn-sidebar">
                    Déconnexion
                </button>
            </aside>

            {/* --- Contenu principal --- */}
            <main className="admin-content">
                <header className="content-header">
                    <h1>Ma Collection <span className="collection-count">({books.length})</span></h1>
                </header>

                {/* --- Section Tableau de bord (Statistiques) --- */}
                <section className="dashboard-stats">
                    <div className="stat-card">
                        <p>Total Membres</p>
                        <h3>{users.length}</h3>
                    </div>
                    <div className="stat-card">
                        <p>Livres en ligne</p>
                        <h3>{books.length}</h3>
                    </div>
                </section>

                {/* --- Tableau de données (Utilisateurs ou Livres) --- */}
                <section className="table-section">
                    <div className="table-card">
                        <h3>{tab === 'users' ? 'Gestion des Utilisateurs' : 'Gestion des Livres'}</h3>
                        {tab === 'users' ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Email</th>
                                        <th>Rôle</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u: any) => (
                                        <tr key={u.id}>
                                            <td>{u.username}</td>
                                            <td>{u.email}</td>
                                            <td><span className={`role-tag ${u.role}`}>{u.role}</span></td>
                                            <td>
                                                <button className="delete-btn-table" onClick={() => deleteUser(u.id)}>Supprimer</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Titre</th>
                                        <th>Auteur</th>
                                        <th>ID</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map((b: any) => (
                                        <tr key={b.id}>
                                            <td>{b.titre}</td>
                                            <td>{b.auteur}</td>
                                            <td>#{b.id}</td>
                                            <td>
                                                <button className="delete-btn-table">Supprimer</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};