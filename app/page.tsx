export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl mb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-6xl mb-6">⚽</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            JStore Football Jerseys
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover high-quality football jerseys from top clubs around the world. 
            Premium designs, custom printing, and fast delivery.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/catalog" className="btn bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-3 font-semibold shadow-lg">
              🛍️ Browse Catalog
            </a>
            <a href="/order" className="btn bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 text-lg px-8 py-3">
              🛒 View Cart
            </a>
            <a href="/track" className="btn bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 text-lg px-8 py-3">
              🔍 Track Order
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-500">Why Choose JStore?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-xl bg-white border border-gray-300 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Premium Quality</h3>
            <p className="text-gray-800">
              High-quality jerseys made with premium materials. 
              Durable construction that lasts season after season.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white border border-gray-300 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Custom Printing</h3>
            <p className="text-gray-800">
              Personalize your jersey with any name and number. 
              Professional heat-pressed printing that won't fade or peel.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white border border-gray-300 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Fast Delivery</h3>
            <p className="text-gray-800">
              Quick processing and reliable shipping. 
              Track your order from confirmation to delivery.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-500">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">1️⃣</span>
            </div>
            <h3 className="font-semibold mb-2 text-gray-700">Browse</h3>
            <p className="text-sm text-gray-600">Explore our extensive catalog of football jerseys</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">2️⃣</span>
            </div>
            <h3 className="font-semibold mb-2 text-gray-700">Customize</h3>
            <p className="text-sm text-gray-600">Choose size, add custom name and number</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">3️⃣</span>
            </div>
            <h3 className="font-semibold mb-2 text-gray-700">Order</h3>
            <p className="text-sm text-gray-600">Add to cart and place your secure order</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">4️⃣</span>
            </div>
            <h3 className="font-semibold mb-2 text-gray-700">Receive</h3>
            <p className="text-sm text-gray-600">Get your jersey delivered and track your order</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Your Jersey?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of football fans who trust JStore for their jersey needs.
          </p>
          <a href="/catalog" className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 font-semibold">
            🏪 Start Shopping Now
          </a>
        </div>
      </section>
    </div>
  );
}
