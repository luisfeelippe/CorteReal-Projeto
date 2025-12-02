import React, { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (product) => {
    const itemExists = cartItems.find((item) => item.id === product.id);
    if (itemExists) {
      toast.success(`Mais um(a) ${product.name} no carrinho!`, { id: 'cart-toast' });
    } else {
      toast.success(`${product.name} adicionado!`, { icon: '🛍️', id: 'cart-toast' });
    }
    
    setCartItems((prevItems) => {
      if (itemExists) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => 
      prevItems.map((item) => {
        if (item.id === productId) {
          const validQuantity = Math.max(1, Math.min(newQuantity, item.stock));
          if (newQuantity > item.stock) toast.error("Estoque máximo atingido!", { id: 'stock-error' });
          return { ...item, quantity: validQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    toast.success('Item removido', { icon: '🗑️', id: 'remove-toast' });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.find(item => item.id === product.id);
    
    if (exists) {
      toast('Removido dos favoritos', { icon: '💔', id: 'wishlist-toast' });
      setWishlist((prev) => prev.filter(item => item.id !== product.id));
    } else {
      toast.success('Adicionado aos favoritos!', { icon: '❤️', id: 'wishlist-toast' });
      setWishlist((prev) => [...prev, product]);
    }
  };

  return (
    <CartContext.Provider value={{ 
        cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal, 
        wishlist, toggleWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);