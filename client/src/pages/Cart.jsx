import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, AlertCircle, LogIn } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  const user = JSON.parse(localStorage.getItem('user'));

  const hasIssue = cartItems.some(item => item.stock <= 0 || item.quantity > item.stock);

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Seu Carrinho</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Seu carrinho está vazio.</p>
            <Link to="/" className="text-primary hover:underline">Voltar a comprar</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Lista de Itens */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const isOutOfStock = item.stock <= 0;
                
                return (
                  <div key={item.id} className={`flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border ${isOutOfStock ? 'border-red-500/50 bg-red-500/5' : 'border-white/5'}`}>
                    
                    {/* Imagem */}
                    <img src={item.image} alt={item.name} className={`w-24 h-24 object-cover rounded-lg ${isOutOfStock ? 'grayscale opacity-50' : ''}`} />
                    
                    {/* Detalhes */}
                    <div className="flex-1 w-full text-center sm:text-left">
                      <h3 className={`font-bold text-lg ${isOutOfStock ? 'line-through text-gray-500' : ''}`}>
                        {item.name}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-2">Unitário: R$ {parseFloat(item.price).toFixed(2).replace('.', ',')}</p>
                      
                      {isOutOfStock ? (
                         <span className="text-xs text-red-400 font-bold bg-red-400/10 px-2 py-1 rounded flex items-center gap-1 w-fit mx-auto sm:mx-0">
                            <AlertCircle size={12} /> PRODUTO ESGOTADO
                         </span>
                      ) : (
                         <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                            Estoque disponível: {item.stock}
                         </span>
                      )}
                    </div>

                    {/* Controles de Quantidade */}
                    <div className="flex items-center gap-3 bg-background p-2 rounded-lg border border-white/10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isOutOfStock}
                        className="p-1 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock || isOutOfStock} 
                        className="p-1 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex flex-col items-end gap-2 min-w-[100px]">
                      <span className="font-bold text-lg">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                        <Trash2 size={16} /> Remover
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Resumo do Pedido */}
            <div className="bg-card p-6 rounded-xl border border-white/5 h-fit sticky top-4">
              <h3 className="text-xl font-bold mb-6">Resumo do Pedido</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>R$ {getCartTotal().toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Frete</span>
                  <span className="text-green-400">Grátis</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {getCartTotal().toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {}
              {hasIssue ? (
                <div className="text-center">
                    <button disabled className="w-full bg-gray-600 text-gray-400 font-bold py-4 rounded-lg cursor-not-allowed mb-2">
                        Indisponível
                    </button>
                    <p className="text-xs text-red-400">Corrija os itens acima para continuar.</p>
                </div>
              ) : !user ? (
                
                <div className="text-center">
                    <Link 
                        to="/login" 
                        className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <LogIn size={20} />
                        Faça Login para Finalizar
                    </Link>
                    <p className="text-xs text-gray-400 mt-2">Você precisa de uma conta para comprar.</p>
                </div>
              ) : (
                
                <Link 
                    to="/checkout" 
                    className="block w-full text-center bg-primary hover:bg-cyan-400 text-black font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-primary/20"
                >
                    Finalizar Compra
                </Link>
              )}
              
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;