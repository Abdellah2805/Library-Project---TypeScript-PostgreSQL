import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BookList } from './components/BookList';
import { BookDetails } from './components/BookDetails';
import { Login } from './components/Login';
import { Register } from './components/Register';
import './App.css';
import { MesVentes } from './components/MesVentes';

interface CartItem {
    id: number;
    titre: string;
    prix: number;
    image_url: string;
}

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                setCart(JSON.parse(saved));
            } catch (e) {
                console.error("Erreur lecture panier", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (book: any) => {
        if (cart.some(item => item.id === book.id)) {
            alert("Ce livre est déjà dans votre panier.");
            return;
        }
        setCart([...cart, { 
            id: book.id, 
            titre: book.titre, 
            prix: Number(book.prix), 
            image_url: book.image_url 
        }]);
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter(item => item.id !== id));
    };
    

    const clearCart = () => setCart([]);

    return (
        <div className="app-container">
            <Navbar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                cartItems={cart} 
                onRemoveFromCart={removeFromCart}
                onClearCart={clearCart}
            />
            
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<BookList searchTerm={searchTerm} />} />
                    <Route path="/livre/:id" element={<BookDetails onAddToCart={addToCart} />} />
                    <Route path="/mes-livres" element={<BookList searchTerm={searchTerm} personalOnly={true} />} />
                    <Route path="/mes-ventes" element={<MesVentes />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;