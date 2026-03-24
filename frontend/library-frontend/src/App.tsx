import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { BookList } from './components/BookList';
import { AddBook } from './components/AddBook';
import { AdminDashboard } from './components/AdminDashboard';
import { jwtDecode} from 'jwt-decode'; 
import './App.css';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string>('')
  const [showRegister, setShowRegister] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Pour forcer le rechargement des livres

  // Fonction pour déclencher le rafraîchissement de la liste
  const handleBookAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserRole(decoded.role);  
      } catch (e) { localStorage.clear(); }
    }
  }, [token]);

  if (!token) {
    return (
      <div className="auth-screen">
        {showRegister ? (
          <Register onSwitch={() => setShowRegister(false)} />
        ) : (
          <Login 
            onSwitch={() => setShowRegister(true)} 
            onLoginSuccess={() => setToken(localStorage.getItem('token'))} 
          />
        )}
      </div>
    );
  }

  if (userRole === 'Admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="app-container">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="main-content">
        <header className="welcome-banner">
          <div className="banner-text">
            <h1>Bienvenue dans votre espace</h1>
            
          </div>
          {userRole === 'Auteur' && (
            <button className="open-add-btn" onClick={() => setShowAddModal(true)}>
            + Ajouter un livre
          </button>
          )}
          
        </header>

        {/* On passe la refreshKey pour que BookList se mette à jour */}
        <BookList key={refreshKey} searchTerm={searchTerm} />
      </main>

      {/* Affichage conditionnel de la Modal */}
      {showAddModal && (
        <AddBook 
          onClose={() => setShowAddModal(false)} 
          onBookAdded={handleBookAdded} 
        />
      )}
    </div>
  );
}

export default App;