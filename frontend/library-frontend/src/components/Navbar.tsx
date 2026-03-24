import './Navbar.css';

interface NavbarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export const Navbar = ({ searchTerm, setSearchTerm }: NavbarProps) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <a href="/" className="nav-logo">📚 MaBiblio</a>
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Rechercher un livre ou un auteur..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
            
            <div className="nav-auth">
                <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
            </div>
        </nav>
    );
};