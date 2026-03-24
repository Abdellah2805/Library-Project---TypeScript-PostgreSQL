import { useState } from 'react';
import api from '../api/axios';
import './Register.css'; 

interface RegisterProps {
    onSwitch: () => void;
}

export const Register = ({ onSwitch }: RegisterProps) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Emprunteur' // Rôle par défaut
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
            onSwitch();
        } catch (error: any) {
            console.error("Erreur d'inscription:", error);
            alert(error.response?.data?.error || "Erreur lors de l'inscription");
        }
    };

    return (
        <div className="login-page"> {/* Utilise la classe parente de Login.css */}
            <div className="login-card"> {/* Utilise la structure de carte de Login.css */}
                <div className="login-header">
                    <h1>MaBibli</h1>
                    <p className="subtitle">Rejoignez notre communauté de lecteurs</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-field">
                        <label>Nom d'utilisateur</label>
                        <input 
                            name="username"
                            type="text"
                            placeholder="Ex: Jean Dupont"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label>Email professionnel</label>
                        <input 
                            name="email"
                            type="email"
                            placeholder="nom@exemple.com"
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
                            <option  value="Emprunteur">Emprunteur (Lire des livres)</option>
                            <option  value="Auteur">Auteur (Publier des livres)</option>
                            <option value="Admin">Administrateur</option>
                        </select>
                    </div>
                            
                    <button type="submit" className="login-submit-btn">
                        Créer mon compte
                    </button>
                </form>

                <div className="login-footer">
                    <p>Déjà un compte ? <span onClick={onSwitch}>Se connecter</span></p>
                </div>
            </div>
        </div>
    );
};