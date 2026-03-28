import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './BookDetails.css';

interface Book {
    id: number;
    titre: string;
    image_url: string;
    prix: number;
    type: string;
    stock: number;
    description: string;
}

interface BookDetailsProps {
    onAddToCart: (book: Book) => void;
}

export const BookDetails = ({ onAddToCart }: BookDetailsProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    const [error, setError] = useState(false);
    const role = localStorage.getItem('userRole');

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await api.get(`/livres/${id}`);
                setBook(response.data);
            } catch (err) {
                setError(true);
            }
        };
        fetchBook();
    }, [id]);

    if (error) return <div className="error-page"><h2>Livre introuvable</h2><button onClick={() => navigate('/')}>Retour</button></div>;
    if (!book) return <div className="loader">Chargement...</div>;

    return (
        <div className="details-page">
            <button className="back-link" onClick={() => navigate(-1)}>← Retour</button>
            <div className="details-layout">
                <div className="details-visual">
                    <img src={book.image_url} alt={book.titre} className="main-cover" />
                </div>
                <div className="details-content">
                    <span className="genre-label">{book.type}</span>
                    <h1 className="title-display">{book.titre}</h1>
                    <div className="price-section">
                        <span className="current-price">{Number(book.prix).toFixed(2)} €</span>
                        <span className={`status-pill ${book.stock > 0 ? 'is-in' : 'is-out'}`}>
                            {book.stock > 0 ? `${book.stock} en stock` : 'Rupture'}
                        </span>
                    </div>
                    <p className="description-block">{book.description}</p>
                    <div className="action-footer">
                        {role === 'Emprunteur' ? (
                            <button className="main-buy-btn" onClick={() => onAddToCart(book)} disabled={book.stock === 0}>
                                {book.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
                            </button>
                        ) : (
                            <p>Connectez-vous pour acheter</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};