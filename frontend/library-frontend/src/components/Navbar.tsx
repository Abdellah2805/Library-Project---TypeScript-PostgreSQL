import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import { Cart } from './Cart';

interface CartItem {
    id: number;
    titre: string;
    prix: number;
    image_url: string;
}

interface NavbarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    cartItems: CartItem[];
    onRemoveFromCart: (id: number) => void;
    onClearCart: () => void;
}

export const Navbar = ({ searchTerm, setSearchTerm, cartItems, onRemoveFromCart, onClearCart }: NavbarProps) => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole'); 
    const isConnected = !!localStorage.getItem('token');
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('cart');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link title="Accueil" to="/" className="nav-logo">📚 MaBiblio</Link>
            </div>
            
            <div className="nav-center">
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Rechercher un livre..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="nav-menu">
                    {isConnected && role === 'Auteur' && (
                        <Link to="/mes-livres" className="nav-item-link">Mes livres</Link>
                    )}
                    {isConnected && (
                        <Link to="/mes-ventes" className="nav-item-link">
                            {role === 'Auteur' ? 'Mes ventes' : 'Mes achats'}
                        </Link>
                    )}
                </div>
            </div>

            <div className="nav-right">
                {isConnected && role === 'Emprunteur' && (
                    <div className="cart-container" onClick={() => setIsCartOpen(true)} style={{cursor: 'pointer', marginRight: '20px', position: 'relative'}}>
                        <span style={{fontSize: '1.8rem'}}>🛒</span>
                        {cartItems.length > 0 && (
                            <span className="cart-badge">
                                {cartItems.length}
                            </span>
                        )}
                    </div>
                )}

                {isConnected ? (
                    <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
                ) : (
                    <Link to="/login" className="login-btn">Connexion</Link>
                )}
            </div>

            {isCartOpen && (
                <Cart 
                    cartItems={cartItems} 
                    onClose={() => setIsCartOpen(false)} 
                    onRemove={onRemoveFromCart}
                    onClear={onClearCart}
                />
            )}
        </nav>
    );
};