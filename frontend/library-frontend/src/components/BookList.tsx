import { useEffect, useState } from 'react';
import api from '../api/axios';
import './BookList.css';

interface Book {
    id: number;
    titre: string;
    auteur: string;
}

interface BookListProps {
    searchTerm: string;
}

export const BookList = ({ searchTerm }: BookListProps) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await api.get('/livres');
                setBooks(response.data);
            } catch (error) {
                console.error("Erreur chargement livres:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    // Filtrage en temps réel
    const filteredBooks = books.filter(book => 
        book.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.auteur.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loader">Chargement de la collection...</div>;

    return (
        <div className="book-list-container">
            <h2 className="section-title">Ma Collection ({filteredBooks.length})</h2>
            <div className="book-grid">
                {filteredBooks.map((book) => (
                    <div key={book.id} className="book-card">
                        <div className="book-cover-placeholder">📖</div>
                        <div className="book-info">
                            <span className="book-tag">Disponible</span>
                            <h3 className="book-title">{book.titre}</h3>
                            <p className="book-author">de {book.auteur}</p>
                            <button className="book-action-btn">Détails</button>
                        </div>
                    </div>
                ))}
            </div>
            {filteredBooks.length === 0 && (
                <p className="no-results">Aucun livre ne correspond à votre recherche.</p>
            )}
        </div>
    );
};