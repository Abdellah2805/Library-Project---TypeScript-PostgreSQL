import { useEffect, useState } from 'react';
import api from '../api/axios';
import './BookList.css';
import { Link } from 'react-router-dom';
import { EditBookModal } from './EditBookModal'; // Importation de la nouvelle modal

// Définition de l'interface complète (avec description nécessaire pour la modal)
interface Book {
    id: number;
    titre: string;
    image_url: string; 
    prix: number; // Important : nombre
    type: string;      
    stock: number;
    description: string; // Ajoutée ici pour la modification
}

interface BookListProps {
    searchTerm: string;
    personalOnly?: boolean;
}

export const BookList = ({ searchTerm, personalOnly = false }: BookListProps) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    
    // États pour gérer la modal de modification
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

    const fetchBooks = async () => {
        try {
            const endpoint = personalOnly ? '/livres/auteur' : '/livres';
            const response = await api.get(endpoint);
            setBooks(response.data);
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [personalOnly]);

    // Ouvre la modal en stockant le livre sélectionné
    const handleOpenEdit = (book: Book) => {
        setBookToEdit(book);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce livre de votre catalogue ?")) {
            try {
                // J'ai corrigé l'URL pour correspondre à la nouvelle route backend (/livres/:id)
                await api.delete(`/livres/${id}`); 
                fetchBooks(); // Rafraîchir la liste après suppression
            } catch (error: any) {
                // Afficher l'erreur exacte renvoyée par le backend (403 ou 500)
                console.error("Erreur suppression:", error.response?.data?.error || error.message);
                alert("Erreur lors de la suppression. Vérifiez vos permissions.");
            }
        }
    };

    const filteredBooks = books.filter(book => 
        book.titre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loader">Chargement de votre catalogue...</div>;

    return (
        <div className="book-list-container">
            <h2 className="section-title">
                {personalOnly ? "Gestion de mon catalogue" : "Tous les livres"} ({filteredBooks.length})
            </h2>
            <div className="book-grid">
                {filteredBooks.map((book) => (
                    <div key={book.id} className="book-card">
                        <div className="book-card-image">
                            <img src={book.image_url} alt={book.titre} className="book-img" />
                        </div>
                        <div className="book-info">
                            <h3 className="book-title">{book.titre}</h3>
                            
                            <div className="book-footer-info">
                                <p className="book-price">{Number(book.prix).toFixed(2)} €</p>
                                
                                {personalOnly ? (
                                    <div className="admin-actions">
                                        <button 
                                            className="edit-btn" 
                                            title="Modifier"
                                            onClick={() => handleOpenEdit(book)} // Branchement ici
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            className="delete-btn" 
                                            onClick={() => handleDelete(book.id)}
                                            title="Supprimer"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ) : (
                                    <Link to={`/livre/${book.id}`} className="book-action-btn">Détails</Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Affichage conditionnel de la Modal de modification */}
            {isEditModalOpen && bookToEdit && (
                <EditBookModal 
                    book={bookToEdit} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onBookUpdated={fetchBooks} // Pour recharger la liste si modifié
                />
            )}
        </div>
    );
};