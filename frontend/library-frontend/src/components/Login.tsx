import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import './Login.css'; 

export const Login = () => { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); 
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('username', response.data.username);
            
            // Redirection vers l'accueil et rafraîchissement pour mettre à jour la Navbar
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Erreur : identifiants incorrects");
        }
    };

    return ( 
        <div className="login-page"> 
            <div className="login-card">
                <div className="login-header">
                    <h1>MaBibli</h1>
                    <p className="subtitle">Heureux de vous revoir !</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-field">
                        <label>Email professionnel</label>
                        <input
                            type="email"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-submit-btn">
                        Se connecter
                    </button>

                    <div className="login-footer">
                        <p>
                            Pas encore de compte ? 
                            <Link to="/register" style={{ marginLeft: '5px', color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>
                                S'inscrire
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};