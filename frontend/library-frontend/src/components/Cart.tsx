import React from 'react';
import api from '../api/axios';
import './Cart.css';

interface CartProps {
    cartItems: any[];
    onClose: () => void;
    onRemove: (id: number) => void;
    onClear: () => void;
}

export const Cart = ({ cartItems, onClose, onRemove, onClear }: CartProps) => {
    const total = cartItems.reduce((sum, item) => sum + Number(item.prix), 0);

    const handleConfirmPurchase = async () => {
        try {
            for (const item of cartItems) {
                await api.post('/achats', { livre_id: item.id });
            }
            alert("Achat confirmé avec succès !");
            onClear();
            onClose();
        } catch (error) {
            alert("Erreur lors de la validation de l'achat.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content cart-modal">
                <button className="close-modal" onClick={onClose}>&times;</button>
                <h2>Mon Panier</h2>
                
                {cartItems.length === 0 ? (
                    <p className="empty-cart">Votre panier est vide.</p>
                ) : (
                    <>
                        <div className="cart-items-list">
                            {cartItems.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <img src={item.image_url} alt={item.titre} />
                                    <div className="cart-item-info">
                                        <h4>{item.titre}</h4>
                                        <p>{item.prix} €</p>
                                    </div>
                                    <button className="remove-item" onClick={() => onRemove(item.id)}>🗑️</button>
                                </div>
                            ))}
                        </div>
                        <div className="cart-summary">
                            <div className="total">Total: <span>{total.toFixed(2)} €</span></div>
                            <button className="confirm-btn" onClick={handleConfirmPurchase}>Confirmer l'achat</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};