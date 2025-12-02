import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Package, CheckCircle, Truck, MapPin } from 'lucide-react'; 

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/my-orders/${user.id}`)
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error(err));
    }
  }, []);

  if (!user) return <div className="text-white text-center mt-20">Faça login para ver seus pedidos.</div>;

  const getStatusColor = (status) => {
      const s = status ? status.toLowerCase() : '';
      if(s === 'entregue') return 'text-green-400';
      if(s === 'enviado') return 'text-blue-400';
      if(s === 'pendente') return 'text-yellow-400';
      return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Package /> Meus Pedidos
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-10 bg-card rounded-xl border border-white/5">
             <p className="text-gray-400">Você ainda não fez nenhuma compra.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-card border border-white/10 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/5">
                  <div>
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Pedido #{order.id}</span>
                    <p className="text-sm text-gray-300 mt-1">
                      {new Date(order.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  {}
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border bg-opacity-10 border-opacity-20 ${
                      order.status === 'Entregue' ? 'bg-green-500 text-green-400 border-green-500' :
                      order.status === 'Enviado' ? 'bg-blue-500 text-blue-400 border-blue-500' :
                      'bg-yellow-500 text-yellow-400 border-yellow-500'
                  }`}>
                    {order.status === 'Entregue' ? <CheckCircle size={14}/> : <Truck size={14}/>} 
                    {order.status || 'Processando'}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-white/10 bg-gray-800" 
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-white">{item.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">Quantidade: {item.quantity}</p>
                        <p className="text-sm text-primary font-bold mt-1">R$ {parseFloat(item.price).toFixed(2).replace('.', ',')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-black/20 p-4 flex justify-between items-center">
                  {}
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    Status: <span className={`font-bold uppercase ${getStatusColor(order.status)}`}>{order.status || 'Análise'}</span>
                  </span>
                  
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Total do Pedido</span>
                    <span className="font-bold text-xl text-white">R$ {parseFloat(order.total).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;