import { useState } from 'react';
import api from '../api/axios';
import './Login.css'; 

interface LoginProps {
    onSwitch: () => void;
    onLoginSuccess: () => void;
}

export const Login = ({ onSwitch, onLoginSuccess }: LoginProps) => { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); 
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.token);
            onLoginSuccess();
        } catch (error) {
            console.error(error);
            alert("Erreur : identifiants incorrects");
        }
    };

    return ( 
        <div className="login-page"> 
            <div className="login-card"> {/* Changé de login-container à login-card */}
                <div className="login-header">
                    <h1>MaBibli</h1>
                    <p className="subtitle">Heureux de vous revoir !</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-field"> {/* Changé de input-group à input-field */}
                        <label>Email professionnel</label>
                        <input
                            type="email"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                    </div>

                    <div className="input-field"> {/* Changé de input-group à input-field */}
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-submit-btn"> {/* Changé de login-button à login-submit-btn */}
                        Se connecter
                    </button>

                    <div className="login-footer">
                        <p>
                            Pas encore de compte ? 
                            <span onClick={onSwitch} style={{ cursor: 'pointer', marginLeft: '5px' }}>S'inscrire</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};