import React from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { wishlist } = useCart();

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Heart className="text-primary" fill="currentColor" /> Meus Favoritos
        </h2>

        {wishlist.length === 0 ? (
          <p className="text-gray-400">Sua lista de desejos está vazia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((product) => (
              <ProductCard 
                key={product.id}
                {...product} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;