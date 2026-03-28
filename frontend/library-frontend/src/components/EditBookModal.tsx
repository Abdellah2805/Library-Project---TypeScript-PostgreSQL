import React, { useState } from 'react';
import api from '../api/axios';
import './EditBookModal.css'; 

interface Book {
    id: number;
    titre: string;
    image_url: string;
    prix: number;
    type: string;
    description: string;
    stock: number;
}

interface EditBookModalProps {
    book: Book;
    onClose: () => void;
    onBookUpdated: () => void;
}

export const EditBookModal = ({ book, onClose, onBookUpdated }: EditBookModalProps) => {
    const [formData, setFormData] = useState({
        titre: book.titre,
        image_url: book.image_url,
        prix: book.prix,
        type: book.type,
        description: book.description || '',
        stock: book.stock
    });
    const [loading, setLoading] = useState(false);

    const genres = ['Action', 'Aventure', 'Manga', 'Fantastique', 'Drame', 'Sci-Fi'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/livres/${book.id}`, formData);
            onBookUpdated();
            onClose();
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de la modification.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal-content">
                <button className="edit-close-btn" onClick={onClose}>×</button>
                <h2 className="edit-modal-title">Modifier le livre</h2>

                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="edit-input-group">
                        <label>Titre du livre</label>
                        <input type="text" name="titre" value={formData.titre} onChange={handleChange} required />
                    </div>

                    <div className="edit-input-group">
                        <label>URL de la couverture</label>
                        <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} required />
                    </div>

                    <div className="edit-form-row">
                        <div className="edit-input-group">
                            <label>Prix (€)</label>
                            <input type="number" name="prix" step="0.01" value={formData.prix} onChange={handleChange} required />
                        </div>
                        <div className="edit-input-group">
                            <label>Catégorie</label>
                            <select name="type" value={formData.type} onChange={handleChange} required>
                                {genres.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="edit-input-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3}></textarea>
                    </div>

                    <div className="edit-input-group">
                        <label>Stock disponible</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="edit-submit-btn" disabled={loading}>
                        {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
                    </button>
                </form>
            </div>
        </div>
    );
};