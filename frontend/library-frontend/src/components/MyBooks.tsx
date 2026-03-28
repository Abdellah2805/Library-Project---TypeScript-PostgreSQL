import { useEffect, useState } from 'react';
import api from '../api/axios';
import './BookList.css'; // On réutilise le même CSS pour la cohérence
import { Link } from 'react-router-dom';

export const MyBooks = () => {
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBooks = async () => {
            try {
                const response = await api.get('/livres/mon-catalogue');
                setMyBooks(response.data);
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyBooks();
    }, []);

    if (loading) return <div className="loader">Chargement de votre catalogue...</div>;

    return (
        <div className="book-list-container">
            <h2 className="section-title">Mes Livres Publiés ({myBooks.length})</h2>
            {myBooks.length === 0 ? (
                <p className="no-results">Vous n'avez pas encore ajouté de livres.</p>
            ) : (
                <div className="book-grid">
                    {myBooks.map((book: any) => (
                        <div key={book.id} className="book-card">
                            <div className="book-card-image">
                                <img src={book.image_url} alt={book.titre} className="book-img" />
                            </div>
                            <div className="book-info">
                                <h3 className="book-title">{book.titre}</h3>
                                <div className="book-footer-info">
                                    <p className="book-price">{book.prix} €</p>
                                    <Link to={`/livre/${book.id}`} className="book-action-btn">Modifier / Voir</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};