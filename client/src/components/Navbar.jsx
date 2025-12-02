import React from 'react';
import { Search, User, LogOut, Heart, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = ({ onSelectCategory, onSearch }) => {
  const navigate = useNavigate();
  const { cartItems, wishlist } = useCart();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const handleFilter = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md py-4 px-8 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
            CR
          </div>
          <span className="text-xl font-medium tracking-wide text-white">CorteReal</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <button onClick={() => handleFilter('Todos')} className="hover:text-primary transition-colors">Início</button>
          <button onClick={() => handleFilter('Jaquetas')} className="hover:text-primary transition-colors">Jaquetas</button>
          <button onClick={() => handleFilter('Acessórios')} className="hover:text-primary transition-colors">Acessórios</button>
          <button onClick={() => handleFilter('Camisetas')} className="hover:text-primary transition-colors">Camisetas</button>
        </div>

        <div className="flex items-center gap-6">
          
          {}
          <div className="hidden lg:flex items-center bg-card rounded-full px-4 py-2 w-64 border border-white/5 focus-within:border-primary/50 transition-colors">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              onChange={(e) => onSearch && onSearch(e.target.value)} 
              className="bg-transparent border-none outline-none text-sm ml-2 text-gray-200 w-full placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-4">
            {}
            <Link to="/wishlist" className="relative p-2 hover:bg-white/5 rounded-full transition-colors text-white" title="Meus Favoritos">
              <Heart size={20} />
              {wishlist.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-xs text-gray-400">Olá,</span>
                  <span className="text-sm font-bold text-primary leading-none">{user.name.split(' ')[0]}</span>
                </div>
                {}
                <Link to="/my-orders" title="Meus Pedidos" className="p-2 hover:bg-white/5 rounded-full transition-colors text-white">
                  <Package size={20} />
                </Link>

                <button onClick={handleLogout} title="Sair" className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors text-gray-400">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" title="Fazer Login" className="p-2 hover:bg-white/5 rounded-full transition-colors text-white">
                <User size={20} />
              </Link>
            )}
            
            <Link to="/cart" className="relative bg-gradient-to-r from-primary to-secondary p-2 px-4 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity text-white">
              <span className="text-xs font-bold">Carrinho</span>
              <div className="bg-white text-background w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                {cartItems.length}
              </div>
            </Link>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;