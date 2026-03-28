import { useEffect, useState } from 'react';
import api from '../api/axios';
import './MesVentes.css';

interface Vente {
    id: number;
    titre: string;
    prix: number;
    image_url: string;
    acheteur: string; // Le nom du compte de l'emprunteur
    date_achat: string;
}

export const MesVentes = () => {
    const [ventes, setVentes] = useState<Vente[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVentes = async () => {
            try {
                const response = await api.get('/ventes/auteur');
                setVentes(response.data);
            } catch (error) {
                console.error("Erreur chargement ventes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVentes();
    }, []);

    if (loading) return <div className="loader">Chargement de vos ventes...</div>;

    return (
        <div className="ventes-container">
            <div className="ventes-header">
                <h1>Tableau de bord des ventes</h1>
                <p>Retrouvez ici tous les lecteurs qui ont acheté vos œuvres.</p>
            </div>

            {ventes.length === 0 ? (
                <div className="empty-ventes">
                    <p>Aucun achat n'a encore été effectué pour vos livres.</p>
                </div>
            ) : (
                <div className="ventes-grid">
                    {ventes.map((vente) => (
                        <div key={vente.id} className="vente-card">
                            <img src={vente.image_url} alt={vente.titre} className="vente-img" />
                            <div className="vente-info">
                                <div className="vente-main-info">
                                    <h3>{vente.titre}</h3>
                                    <span className="vente-price">{Number(vente.prix).toFixed(2)} €</span>
                                </div>
                                <div className="vente-details">
                                    <p><strong>Acheté par :</strong> <span className="buyer-name">{vente.acheteur}</span></p>
                                    <p><strong>Date :</strong> {new Date(vente.date_achat).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};