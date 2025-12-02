import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Entrando...');
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      toast.dismiss(loadingToast);

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(`Bem-vindo, ${data.user.name}!`); 
        navigate('/');
        window.location.reload();
      } else {
        toast.error(data.error || "Erro ao entrar"); 
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Acesse sua conta</h2>
        <p className="text-gray-400 text-center mb-8">Bem-vindo ao CorteReal</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input name="email" onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" type="email" placeholder="seu@email.com" required />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Senha</label>
            <input name="password" onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" type="password" placeholder="******" required />
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-cyan-400 text-black font-bold py-3 rounded-lg transition-colors mt-4">
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Não tem conta? <Link to="/register" className="text-primary hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;