import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Package, Plus, Edit, Users, CheckCircle, Box, Trash2, ChevronDown, ChevronUp, MapPin, CreditCard, Truck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', category: 'Camisetas', stock: '', image: '', is_active: 1 });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.is_admin !== 1) {
      navigate('/');
    } else {
      fetchOrders();
      fetchProducts();
    }
  }, []);

  const fetchOrders = () => {
    fetch('http://localhost:3001/admin/orders')
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  const fetchProducts = () => {
    fetch('http://localhost:3001/admin/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  const updateStatus = async (id, newStatus) => {
    const loading = toast.loading("Atualizando...");
    await fetch(`http://localhost:3001/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    toast.dismiss(loading);
    toast.success("Status atualizado!");
    fetchOrders(); 
  };

  const toggleDetails = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditProductId(product.id);
    setProductForm({ ...product, image: product.image_url });
    setActiveTab('products_form');
  };

  const handleNewProductClick = () => {
      setIsEditing(false);
      setProductForm({ name: '', price: '', category: 'Camisetas', stock: '', image: '', is_active: 1 });
      setActiveTab('products_form');
  }

  const executeDelete = async () => {
      const loading = toast.loading("Excluindo...");
      try {
          const response = await fetch(`http://localhost:3001/products/${editProductId}`, {
              method: 'DELETE'
          });
          
          toast.dismiss(loading);
          
          if (response.ok) {
              toast.success("Produto excluído permanentemente!");
              fetchProducts();
              setActiveTab('products_list');
          } else if (response.status === 409) {
              toast.error("Bloqueado: Este produto tem vendas registradas.", { duration: 4000 });
              toast("Use o botão 'Ocultar' para tirá-lo da loja.", { icon: '💡', duration: 5000 });
          } else {
              toast.error("Erro ao excluir.");
          }
      } catch (error) {
          toast.dismiss(loading);
          toast.error("Erro no servidor.");
      }
  };

  const handleDeleteProduct = () => {
      toast((t) => (
          <div className="flex flex-col gap-2">
              <p className="font-bold">Tem certeza? Isso apaga para sempre!</p>
              <div className="flex gap-2 justify-end">
                  <button 
                      onClick={() => { toast.dismiss(t.id); executeDelete(); }}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 font-bold"
                  >
                      Sim, Excluir
                  </button>
                  <button 
                      onClick={() => toast.dismiss(t.id)}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-500 font-bold"
                  >
                      Cancelar
                  </button>
              </div>
          </div>
      ), { 
          duration: 6000, 
          icon: '⚠️', 
          style: { border: '1px solid #EF4444', background: '#1E293B', color: '#fff' } 
      });
  };

  const handleToggleStatus = async () => {
      const newStatus = productForm.is_active ? 0 : 1;
      const actionName = newStatus ? "Reativando" : "Ocultando";

      const loading = toast.loading(`${actionName} produto...`);
      
      try {
          await fetch(`http://localhost:3001/products/${editProductId}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ is_active: newStatus })
          });
          
          toast.dismiss(loading);
          toast.success(newStatus ? "Produto visível na loja!" : "Produto ocultado!");
          
          setProductForm({ ...productForm, is_active: newStatus });
          fetchProducts();
      } catch (error) {
          toast.dismiss(loading);
          toast.error("Erro ao alterar status.");
      }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing ? `http://localhost:3001/products/${editProductId}` : 'http://localhost:3001/products';
    const method = isEditing ? 'PUT' : 'POST';
    
    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
    });
    toast.success(isEditing ? "Produto atualizado!" : "Produto cadastrado!");
    fetchProducts();
    setActiveTab('products_list');
  };

  const getStatusColor = (status) => {
      const s = status ? status.toLowerCase() : '';
      if(s === 'entregue') return 'bg-green-500 text-black';
      if(s === 'enviado') return 'bg-blue-500 text-white';
      return 'bg-yellow-500 text-black';
  };

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold flex items-center gap-2">
                <Users className="text-secondary" /> Painel Admin
            </h2>
            <div className="flex gap-2 bg-card p-1 rounded-lg border border-white/10">
                <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${activeTab === 'orders' ? 'bg-primary text-black' : 'hover:bg-white/5'}`}>
                    <Package size={18}/> Pedidos
                </button>
                <button onClick={() => setActiveTab('products_list')} className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${activeTab.startsWith('products') ? 'bg-primary text-black' : 'hover:bg-white/5'}`}>
                    <Edit size={18}/> Produtos
                </button>
            </div>
        </div>

        {activeTab === 'orders' && (
            <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-card border border-white/10 rounded-xl overflow-hidden shadow-lg transition-all">
                <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => toggleDetails(order.id)}>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`p-3 rounded-full ${getStatusColor(order.status)} bg-opacity-20`}>
                        <Package size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">Pedido #{order.id}</span>
                            <span className="text-sm text-gray-400">• {new Date(order.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p className="text-gray-300">{order.user_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                        <span className="block text-xs text-gray-400 uppercase">Valor Total</span>
                        <span className="font-bold text-xl text-primary">R$ {parseFloat(order.total).toFixed(2).replace('.', ',')}</span>
                    </div>
                    {expandedOrderId === order.id ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
                  </div>
                </div>

                {expandedOrderId === order.id && (
                    <div className="p-6 bg-black/20 border-t border-white/10 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div className="space-y-4">
                                <h4 className="text-primary font-bold flex items-center gap-2"><Users size={16}/> Dados do Cliente</h4>
                                <div className="text-sm text-gray-300 space-y-1">
                                    <p><strong className="text-white">Nome:</strong> {order.user_name}</p>
                                    <p><strong className="text-white">Email:</strong> {order.user_email}</p>
                                    <p><strong className="text-white">CPF:</strong> {order.user_cpf || 'Não informado'}</p>
                                </div>
                                <h4 className="text-primary font-bold flex items-center gap-2 mt-6"><MapPin size={16}/> Endereço de Entrega</h4>
                                <p className="text-sm text-gray-300 bg-white/5 p-3 rounded border border-white/10">
                                    {order.address || 'Endereço não registrado'}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-primary font-bold flex items-center gap-2"><CreditCard size={16}/> Pagamento</h4>
                                <div className="text-sm text-gray-300">
                                    <p className="capitalize"><strong className="text-white">Método:</strong> {order.payment_method === 'pix' ? 'PIX' : 'Cartão de Crédito'}</p>
                                    <p><strong className="text-white">Status Atual:</strong> {order.status}</p>
                                </div>
                                <h4 className="text-primary font-bold flex items-center gap-2 mt-6"><Truck size={16}/> Atualizar Status</h4>
                                <div className="flex gap-2">
                                    <button onClick={() => updateStatus(order.id, 'Enviado')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors border ${order.status === 'Enviado' ? 'bg-blue-500 text-white border-blue-500' : 'border-white/20 hover:bg-white/10'}`}>Enviado</button>
                                    <button onClick={() => updateStatus(order.id, 'Entregue')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors border ${order.status === 'Entregue' ? 'bg-green-500 text-black border-green-500' : 'border-white/20 hover:bg-white/10'}`}>Entregue</button>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-primary font-bold flex items-center gap-2 mb-4"><Package size={16}/> Produtos</h4>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 items-center bg-white/5 p-2 rounded-lg">
                                            <img src={item.image} className="w-12 h-12 rounded object-cover flex-shrink-0"/>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-gray-400">{item.quantity}x R$ {item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'products_list' && (
            <div className="bg-card border border-white/10 rounded-xl overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Gerenciar Estoque</h3>
                    <button onClick={handleNewProductClick} className="bg-primary hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                        <Plus size={18}/> Novo Produto
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(product => (
                        <div key={product.id} className={`flex items-center gap-4 bg-background p-4 rounded-lg border hover:border-primary/50 transition-colors group ${product.is_active === 0 ? 'opacity-50 border-red-500/30' : 'border-white/5'}`}>
                            <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0"/>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="font-bold truncate flex items-center gap-2">
                                    {product.name}
                                    {product.is_active === 0 && <span className="text-[10px] bg-red-500 text-white px-1 rounded">OCULTO</span>}
                                </h4>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-primary font-bold">R$ {product.price}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>Estoque: {product.stock}</span>
                                </div>
                            </div>
                            <button onClick={() => handleEditClick(product)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 group-hover:text-primary transition-colors">
                                <Edit size={18}/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'products_form' && (
            <div className="max-w-2xl mx-auto bg-card border border-white/10 rounded-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {isEditing ? <Edit className="text-primary" /> : <Plus className="text-primary" />} 
                        {isEditing ? 'Editar Produto' : 'Novo Produto'}
                    </h3>
                    <button onClick={() => setActiveTab('products_list')} className="text-sm text-gray-400 hover:text-white underline">Voltar</button>
                </div>
                
                <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div><label className="block text-sm text-gray-400 mb-1">Nome</label><input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg p-3 outline-none focus:border-primary" placeholder="Ex: Calça Jeans Skinny" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm text-gray-400 mb-1">Preço</label><input required type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg p-3 outline-none focus:border-primary" placeholder="99.90" /></div>
                        <div><label className="block text-sm text-gray-400 mb-1">Estoque</label><input required type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg p-3 outline-none focus:border-primary" placeholder="10" /></div>
                    </div>
                    <div><label className="block text-sm text-gray-400 mb-1">Categoria</label><select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg p-3 outline-none focus:border-primary"><option value="Camisetas">Camisetas</option><option value="Jaquetas">Jaquetas</option><option value="Acessórios">Acessórios</option><option value="Calçados">Calçados</option></select></div>
                    <div><label className="block text-sm text-gray-400 mb-1">URL Imagem</label><input required value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg p-3 outline-none focus:border-primary" placeholder="https://exemplo.com/foto.jpg" /></div>
                    
                    <div className="flex gap-4 pt-4">
                        <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors">
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
                        </button>
                        
                        {isEditing && (
                            <>
                                <button 
                                    type="button" 
                                    onClick={handleToggleStatus}
                                    className={`px-6 font-bold py-3 rounded-lg transition-colors border flex items-center justify-center gap-2
                                        ${productForm.is_active 
                                            ? 'bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-500 border-yellow-500/50' 
                                            : 'bg-blue-500/20 hover:bg-blue-500/40 text-blue-500 border-blue-500/50'}`}
                                >
                                    {productForm.is_active ? <><EyeOff size={20}/> Ocultar</> : <><Eye size={20}/> Reativar</>}
                                </button>

                                <button 
                                    type="button" 
                                    onClick={handleDeleteProduct}
                                    className="px-6 bg-red-500/20 hover:bg-red-500/40 text-red-500 font-bold py-3 rounded-lg transition-colors border border-red-500/50 flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={20} /> Excluir
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        )}

      </div>
    </div>
  );
};

export default Admin;