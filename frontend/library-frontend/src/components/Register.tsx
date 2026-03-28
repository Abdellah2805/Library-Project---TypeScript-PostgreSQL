import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import './Register.css'; 

export const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Emprunteur'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/register', formData);
            alert(`Compte ${formData.role} créé avec succès !`);
            navigate('/login'); // Redirige vers la page de connexion
        } catch (error: any) {
            console.error("Erreur d'inscription:", error);
            alert(error.response?.data?.error || "Erreur lors de l'inscription");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>MaBibli</h1>
                    <p className="subtitle">Rejoignez notre communauté</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-field">
                        <label>Nom d'utilisateur</label>
                        <input 
                            name="username"
                            type="text"
                            placeholder="Votre nom"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label>Email professionnel</label>
                        <input 
                            name="email"
                            type="email"
                            placeholder="votre@email.com"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label>Mot de passe</label>
                        <input 
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label>Je m'inscris en tant que :</label>
                        <select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange}
                            className="role-select" 
                        >
                            <option value="Emprunteur">Emprunteur (Lire des livres)</option>
                            <option value="Auteur">Auteur (Publier des livres)</option>
                        </select>
                    </div>
                            
                    <button type="submit" className="login-submit-btn">
                        Créer mon compte
                    </button>
                </form>

                <div className="login-footer">
                    <p>Déjà un compte ? 
                        <Link to="/login" style={{ marginLeft: '5px', color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};