'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function OrderPage() {
  const [customer, setCustomer] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pref = params.get('pref');
    if (pref) setText(prev => prev ? prev : `${pref} — tamanho: , quantidade: `);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || !text.trim()) return;
    const { error } = await supabase.from('orders').insert([{ customer_name: customer.trim(), text: text.trim() }]);
    if (!error) {
      setCustomer('');
      setText('');
      alert('Pedido enviado!');
    } else {
      alert('Erro a enviar pedido.');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="h1">Fazer Pedido</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="label">O teu nome</label>
          <input className="input" value={customer} onChange={e => setCustomer(e.target.value)} placeholder="ex: João Silva" required />
        </div>
        <div className="space-y-1">
          <label className="label">O que queres encomendar?</label>
          <textarea className="input h-40" value={text} onChange={e => setText(e.target.value)} placeholder="ex: 2x T-shirt Nike, tamanho M" required />
        </div>
        <button type="submit" className="btn btn-primary">Enviar Pedido</button>
      </form>
    </div>
  );
}
