export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="h1">Bem-vindo 👋</h1>
      <p className="small">
        Vê o catálogo disponível e faz o teu pedido. Este MVP guarda os pedidos e gera uma mensagem estruturada para enviar ao vendedor no WhatsApp.
      </p>
      <div className="flex gap-2">
        <a href="/catalog" className="btn btn-primary">Ver Catálogo</a>
        <a href="/order" className="btn">Fazer Pedido</a>
      </div>
    </div>
  );
}
