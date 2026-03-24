import { useState } from 'react';
import api from '../api/axios';
import './AddBook.css';

interface AddBookProps {
    onBookAdded: () => void;
    onClose: () => void;
}

export const AddBook = ({ onBookAdded, onClose }: AddBookProps) => {
    // État initial avec tous les nouveaux champs
    const [formData, setFormData] = useState({
        titre: '',
        image_url: '',
        prix: '',
        type: 'Action', // Valeur par défaut pour le menu déroulant
        description: '',
        stock: 1
    });

    // Gestionnaire de changement unique pour tous les champs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

   

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Envoi des données au backend
            // Note: l'auteur n'est pas envoyé ici car le backend le récupère via le Token
             const dataToSend = {
                ...formData,
                prix: parseFloat(formData.prix), // Convertit "15.5" en 15.5
                stock: parseInt(formData.stock.toString()) // Convertit "5" en 5
            };
            await api.post('/livres', formData);
            
            // Réinitialisation
            setFormData({
                titre: '',
                image_url: '',
                prix: '',
                type: 'Action',
                description: '',
                stock: 1
            });
            
            onBookAdded(); 
            onClose(); // Ferme la modal après succès
            alert("Livre ajouté avec succès à la collection !");
        } catch (error: any) {
            console.error("Erreur lors de l'ajout:", error);
            alert(error.response?.data?.error || "Erreur lors de l'ajout du livre");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-modal" onClick={onClose}>&times;</button>
                
                <form className="add-book-form" onSubmit={handleSubmit}>
                    <h3>Ajouter un nouveau livre</h3>
                    
                    <div className="input-group">
                        <label>Titre</label>
                        <input 
                            name="titre"
                            placeholder="Ex: Le Seigneur des Anneaux" 
                            value={formData.titre} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>URL de l'image</label>
                        <input 
                            name="image_url"
                            placeholder="https://lien-de-l-image.jpg" 
                            value={formData.image_url} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="row">
                        <div className="input-group">
                            <label>Prix (€)</label>
                            <input 
                                name="prix"
                                type="number"
                                step="0.01"
                                placeholder="0.00" 
                                value={formData.prix} 
                                onChange={handleChange} 
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Genre / Type</label>
                            <select 
                                name="type" 
                                value={formData.type} 
                                onChange={handleChange}
                            >
                                <option value="Action">Action</option>
                                <option value="Science-fiction">Science-fiction</option>
                                <option value="Policier">Policier</option>
                                <option value="Drame">Drame</option>
                                <option value="Historique">Historique</option>
                                <option value="Comédie">Comédie</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Description</label>
                        <textarea 
                            name="description"
                            placeholder="Résumé du livre..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    <div className="input-group">
                        <label>Nombre d'exemplaires en stock</label>
                        <input 
                            name="stock"
                            type="number"
                            min="0"
                            value={formData.stock} 
                            onChange={handleChange} 
                            required
                        />
                    </div>

                    <button type="submit" className="add-btn">
                        Publier le livre
                    </button>
                </form>
            </div>
        </div>
    );
};