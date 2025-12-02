import React from 'react';
import { ShoppingBag, Heart, Check, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ id, name, price, category, image, stock }) => {
  const { addToCart, cartItems, wishlist, toggleWishlist } = useCart(); 
  const isAdded = cartItems.some(item => item.id === id);
  const isOutOfStock = stock <= 0;
  const isLiked = wishlist.some(item => item.id === id);
  const handleAdd = () => {
    if (!isAdded && !isOutOfStock) {
      addToCart({ id, name, price, image, stock });
    }
  };

  return (
    <div className={`bg-card rounded-xl overflow-hidden transition-all duration-300 group ${isOutOfStock ? 'opacity-70' : 'hover:transform hover:-translate-y-1'}`}>
      <div className="relative h-64 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
        {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-xl uppercase tracking-widest border-2 border-white px-4 py-2">Esgotado</span>
            </div>
        )}
        {}
        <button 
            onClick={() => toggleWishlist({ id, name, price, image, stock })}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                isLiked 
                ? 'bg-primary text-black' 
                : 'bg-black/50 text-white hover:bg-primary hover:text-black' 
            }`}
        >
          {}
          <Heart size={18} fill={isLiked ? "black" : "none"} />
        </button>
      </div>
      <div className="p-5">
        <span className="text-xs text-primary font-bold uppercase tracking-wider">{category}</span>
        <h3 className="text-lg font-bold text-white mt-1 mb-2">{name}</h3>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-white">
            R$ {price.toFixed(2).replace('.', ',')}
          </span>
          <button
            onClick={handleAdd}
            disabled={isAdded || isOutOfStock} 
            className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-all text-sm ${
              isOutOfStock 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : isAdded
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-primary hover:bg-cyan-400 text-black'
            }`}
          >
            {isOutOfStock ? (
                <>
                    <XCircle size={16} />
                    Indisponível
                </>
            ) : isAdded ? (
              <>
                <Check size={16} />
                Adicionado
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                Adicionar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;