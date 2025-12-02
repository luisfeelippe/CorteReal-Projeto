import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Register from './pages/Register';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import MyOrders from './pages/MyOrders';
import Admin from './pages/Admin'; 

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToProducts = () => {
    document.getElementById('ofertas').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar onSelectCategory={setSelectedCategory} onSearch={setSearchTerm} />
      
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div 
          className="w-full h-96 rounded-2xl mb-12 flex items-center px-12 relative overflow-hidden shadow-2xl bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>

            <div className="z-10 max-w-lg relative">
                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Nova Coleção 2025</span>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Estilo e Conforto <br/> Para o seu dia.
                </h1>
                <button onClick={scrollToProducts} className="bg-primary hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-primary/20">
                    Ver Ofertas
                </button>
            </div>
        </div>

        <div id="ofertas" className="flex items-center justify-between mb-8 pt-8">
            <h2 className="text-2xl font-bold text-white">
              {searchTerm ? `Resultados para: "${searchTerm}"` : (selectedCategory === 'Todos' ? 'Destaques' : selectedCategory)}
            </h2>
            
            {(selectedCategory !== 'Todos' || searchTerm) && (
              <button onClick={() => {setSelectedCategory('Todos'); setSearchTerm('')}} className="text-primary text-sm hover:underline">
                Limpar filtros
              </button>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                price={parseFloat(product.price)}
                image={product.image_url}
                category={product.category}
                stock={product.stock}
              />
            ))
          ) : (
            <p className="text-gray-400 col-span-3 text-center py-10">Nenhum produto encontrado.</p>
          )}
        </div>
      </main>
    </>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-gray-100">
      {/* Configuração das Notificações */}
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#1E293B',
          color: '#fff',
          border: '1px solid #334155'
        },
      }}/>

      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;