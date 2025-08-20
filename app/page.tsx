export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="h1">Bem-vindo 👋</h1>
      <p className="small">
        Check the available products in the catalog and place your order.
      </p>
      <div className="flex gap-2">
        <a href="/order" className="btn">Order</a>
      </div>
    </div>
  );
}
