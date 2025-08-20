'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Order = {
  id: number;
  customer_name: string;
  text: string;
  created_at: string;
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [phone, setPhone] = useState('351XXXXXXXXX');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const message = useMemo(() => {
    if (!orders.length) return 'Sem pedidos.';
    const lines = orders.map(o => `• ${o.customer_name}: ${o.text}`);
    return `Pedidos acumulados:\n\n${lines.join('\n')}`;
  }, [orders]);

  const waUrl = useMemo(() => {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }, [phone, message]);

  return (
    <div className="space-y-4">
      <h1 className="h1">Admin — Pedidos</h1>
      <div className="card space-y-2">
        <label className="label">WhatsApp do vendedor (código do país + número)</label>
        <input className="input" value={phone} onChange={e => setPhone(e.target.value)} />
        <div className="small">Exemplo PT: 351912345678</div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="h2">Lista de pedidos</div>
          <button onClick={load} className="btn">Recarregar</button>
        </div>
        {loading ? (
          <p className="small">A carregar…</p>
        ) : (
          <ul>
            {orders.map(o => (
              <li key={o.id} className="list-item">
                <div className="font-medium">{o.customer_name}</div>
                <div className="small">{new Date(o.created_at).toLocaleString()}</div>
                <div className="mt-1">{o.text}</div>
              </li>
            ))}
            {!orders.length && <p className="small">Ainda não há pedidos.</p>}
          </ul>
        )}
      </div>

      <a href={waUrl} target="_blank" className="btn btn-success inline-block">Enviar ao Vendedor no WhatsApp</a>
      <p className="small">Isto abre o WhatsApp com a mensagem pronta para enviar.</p>
    </div>
  );
}
