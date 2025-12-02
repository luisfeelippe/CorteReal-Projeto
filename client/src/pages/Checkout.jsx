import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, MapPin, Truck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast'; 

const Checkout = () => {
  const { cartItems, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    street: '', number: '', city: '', state: '', cep: '',
    cardName: '', cardNumber: '', cardExpiry: '', cardCvv: ''
  });

  const handleCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setFormData({ ...formData, cardNumber: value.substring(0, 19) });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalize = () => {
    setLoading(true);
    const loadingToast = toast.loading('Processando pagamento...');

    setTimeout(async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      
      const orderData = {
        userId: user ? user.id : null,
        total: getCartTotal(),
        address: `${formData.street}, ${formData.number} - ${formData.city}/${formData.state}`,
        paymentMethod: paymentMethod,
        items: cartItems
      };

      try {
        const response = await fetch('http://localhost:3001/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        toast.dismiss(loadingToast);

        if (response.ok) {
          toast.success("Compra realizada com sucesso!", { duration: 5000 });
          navigate('/my-orders'); 
          window.location.reload(); 
        } else {
            toast.error("Erro ao finalizar pedido.");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Erro de conexão.");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-white pb-10">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {}
        <div className="space-y-6">
          
          <div className="bg-card p-6 rounded-xl border border-white/10">
            <h3 className="flex items-center gap-2 text-xl font-bold mb-4 text-primary">
              <MapPin /> Endereço de Entrega
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input name="cep" onChange={handleChange} placeholder="CEP" className="bg-background p-3 rounded border border-white/10 w-full" />
              <input name="city" onChange={handleChange} placeholder="Cidade" className="bg-background p-3 rounded border border-white/10 w-full" />
              <input name="street" onChange={handleChange} placeholder="Rua / Avenida" className="col-span-2 bg-background p-3 rounded border border-white/10 w-full" />
              <input name="number" onChange={handleChange} placeholder="Número" className="bg-background p-3 rounded border border-white/10 w-full" />
              <input name="state" onChange={handleChange} placeholder="Estado (UF)" className="bg-background p-3 rounded border border-white/10 w-full" />
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border border-white/10">
            <h3 className="flex items-center gap-2 text-xl font-bold mb-6 text-primary">
              <CreditCard /> Forma de Pagamento
            </h3>

            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setPaymentMethod('credit')}
                className={`flex-1 p-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${paymentMethod === 'credit' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 hover:bg-white/5'}`}
              >
                <CreditCard size={20} /> Cartão de Crédito
              </button>
              <button 
                onClick={() => setPaymentMethod('pix')}
                className={`flex-1 p-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${paymentMethod === 'pix' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 hover:bg-white/5'}`}
              >
                <QrCode size={20} /> PIX
              </button>
            </div>

            {paymentMethod === 'credit' && (
              <div className="space-y-4 animate-fadeIn">
                <input 
                  name="cardNumber" 
                  value={formData.cardNumber}
                  onChange={handleCardNumber}
                  placeholder="0000 0000 0000 0000" 
                  maxLength="19"
                  className="w-full bg-background p-3 rounded border border-white/10 font-mono text-lg" 
                />
                <input name="cardName" onChange={handleChange} placeholder="Nome impresso no cartão" className="w-full bg-background p-3 rounded border border-white/10" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="cardExpiry" onChange={handleChange} placeholder="MM/AA" maxLength="5" className="w-full bg-background p-3 rounded border border-white/10" />
                  <input name="cardCvv" onChange={handleChange} placeholder="CVV" maxLength="3" className="w-full bg-background p-3 rounded border border-white/10" />
                </div>
              </div>
            )}

            {paymentMethod === 'pix' && (
              <div className="text-center animate-fadeIn p-4">
                <p className="text-gray-400 mb-4">Escaneie o QR Code para pagar:</p>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PagamentoCorteReal-${getCartTotal()}`} 
                  alt="QR Code Pix" 
                  className="mx-auto border-4 border-white rounded-lg mb-4"
                />
                <p className="text-xs text-gray-500">Aprovação imediata</p>
              </div>
            )}
          </div>

        </div>

        <div className="h-fit sticky top-4">
          <div className="bg-card p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold mb-6">Resumo da Compra</h3>
            
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{item.quantity}x {item.name}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="border-t border-white/10 my-4"></div>
            
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total a Pagar</span>
              <span className="text-primary">R$ {getCartTotal().toFixed(2).replace('.', ',')}</span>
            </div>

            <button 
              onClick={handleFinalize}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Processando...' : (
                <>
                  <CheckCircle size={20} /> Confirmar Pagamento
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-4">
              <Truck size={14} /> Entrega garantida por CorteReal
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;