import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', email: '', cpf: '', birth_date: '', password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Criando conta...');
    
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Conta criada com sucesso! Faça login.");
        navigate('/login'); 
      } else {
        toast.error("Erro ao cadastrar. Verifique os dados.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erro no servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Crie sua conta</h2>
        <p className="text-gray-400 text-center mb-8">Entre para o clube CorteReal</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome Completo</label>
            <input name="name" onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" type="text" placeholder="Seu nome" required />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input name="email" onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" type="email" placeholder="seu@email.com" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">CPF</label>
              <input name="cpf" onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" type="text" placeholder="000.000.000-00" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Data Nasc.</label>
              <input name="birth_date" onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" type="date" required />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Senha</label>
            <input name="password" onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" type="password" placeholder="******" required />
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-cyan-400 text-black font-bold py-3 rounded-lg transition-colors mt-4">
            Cadastrar
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Já tem conta? <Link to="/login" className="text-primary hover:underline">Fazer Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;