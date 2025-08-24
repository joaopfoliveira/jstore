"use client";

export default function PricingPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-gray-800">Pricing</h1>
                <p className="text-lg text-gray-600">
                    Transparent pricing for all our products and services
                </p>
            </div>

            {/* Main Products */}
            <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Product Pricing</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Regular Jersey */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-orange-200">
                        <div className="text-center">
                            <div className="text-3xl mb-3">👕</div>
                            <h3 className="text-xl font-semibold text-blue-800 mb-2">Regular Jersey</h3>
                            <div className="text-3xl font-bold text-blue-600 mb-2">€20</div>
                            <p className="text-sm text-gray-600">Current season jerseys</p>
                        </div>
                    </div>

                    {/* Retro Jersey */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-orange-200">
                        <div className="text-center">
                            <div className="text-3xl mb-3">🏆</div>
                            <h3 className="text-xl font-semibold text-orange-800 mb-2">Retro Jersey</h3>
                            <div className="text-3xl font-bold text-orange-600 mb-2">€25</div>
                            <p className="text-sm text-gray-600">Classic vintage jerseys</p>
                        </div>
                    </div>

                    {/* Kids Set */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-orange-200">
                        <div className="text-center">
                            <div className="text-3xl mb-3">👶</div>
                            <h3 className="text-xl font-semibold text-blue-800 mb-2">Kids Jersey + Shorts</h3>
                            <div className="text-3xl font-bold text-blue-600 mb-2">€25</div>
                            <p className="text-sm text-gray-600">Complete kids set</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add-ons */}
            <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add-on Services</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Printing */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-orange-200">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl">🎯</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-blue-800 mb-1">Number + Name Print</h3>
                                <p className="text-sm text-gray-600 mb-2">Custom player name and number</p>
                                <div className="text-2xl font-bold text-blue-600">+€3</div>
                            </div>
                        </div>
                    </div>

                    {/* Patches */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-orange-200">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl">🏅</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-orange-800 mb-1">Patches</h3>
                                <p className="text-sm text-gray-600 mb-2">Official league badges and patches</p>
                                <div className="text-2xl font-bold text-orange-600">+€2</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Example Calculation */}
            <div className="card p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-orange-200">
                <h2 className="text-2xl font-bold text-orange-800 mb-6 text-center">Example Orders</h2>
                
                <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold text-gray-800">Regular Jersey with Print</h4>
                                <p className="text-sm text-gray-600">Regular Jersey + Name & Number</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-600">€20 + €3</div>
                                <div className="text-xl font-bold text-orange-600">€23</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold text-gray-800">Retro Jersey Complete</h4>
                                <p className="text-sm text-gray-600">Retro Jersey + Name & Number + Patches</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-600">€25 + €3 + €2</div>
                                <div className="text-xl font-bold text-orange-600">€30</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold text-gray-800">Kids Complete Set</h4>
                                <p className="text-sm text-gray-600">Kids Jersey + Shorts + Name & Number</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-600">€25 + €3</div>
                                <div className="text-xl font-bold text-orange-600">€28</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="card p-8 text-center bg-gradient-to-r from-amber-50 to-orange-50 border-orange-200">
                <h2 className="text-2xl font-bold text-blue-800 mb-3">Questions about Pricing?</h2>
                <p className="text-gray-600 mb-6">
                    Need a custom quote or have special requirements? We're here to help!
                </p>
                <a 
                    href="/custom-order" 
                    className="btn bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md transition-all duration-200"
                >
                    Get Custom Quote
                </a>
            </div>
        </div>
    );
}
