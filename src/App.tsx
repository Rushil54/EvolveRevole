import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { Scanner } from './components/Scanner';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Success } from './components/Success';
import { RecommendationEngine } from './components/RecommendationEngine';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';

type AppState = 'shopping' | 'checkout' | 'success';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('shopping');
  const [showScanner, setShowScanner] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const { addToCart, setProducts } = useStore();

  useEffect(() => {
    // Set up real-time subscriptions for product updates
    const channel = supabase
      .channel('products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Product update:', payload);
          // Reload products on any change
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadProducts = async () => {
    // This will be implemented when database is set up
    // For now, we'll use mock data
    const mockProducts = [
      {
        id: '1',
        name: 'Organic Bananas',
        price: 2.99,
        barcode: '1234567890123',
        category: 'Fruits',
        stock_quantity: 50,
        image_url: 'https://images.pexels.com/photos/2238309/pexels-photo-2238309.jpeg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Whole Grain Bread',
        price: 3.49,
        barcode: '2345678901234',
        category: 'Bakery',
        stock_quantity: 25,
        image_url: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Greek Yogurt',
        price: 4.99,
        barcode: '3456789012345',
        category: 'Dairy',
        stock_quantity: 30,
        image_url: 'https://images.pexels.com/photos/793759/pexels-photo-793759.jpeg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Fresh Apples',
        price: 3.99,
        barcode: '4567890123456',
        category: 'Fruits',
        stock_quantity: 40,
        image_url: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Premium Coffee',
        price: 12.99,
        barcode: '5678901234567',
        category: 'Beverages',
        stock_quantity: 15,
        image_url: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Organic Spinach',
        price: 2.49,
        barcode: '6789012345678',
        category: 'Vegetables',
        stock_quantity: 20,
        image_url: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '7',
        name: 'Organic Chicken Breast',
        price: 8.99,
        barcode: '7890123456789',
        category: 'Meat',
        stock_quantity: 12,
        image_url: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '8',
        name: 'Artisan Pasta',
        price: 4.49,
        barcode: '8901234567890',
        category: 'Pantry',
        stock_quantity: 35,
        image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '9',
        name: 'Fresh Salmon Fillet',
        price: 15.99,
        barcode: '9012345678901',
        category: 'Seafood',
        stock_quantity: 8,
        image_url: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '10',
        name: 'Organic Quinoa',
        price: 6.99,
        barcode: '0123456789012',
        category: 'Grains',
        stock_quantity: 22,
        image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    setProducts(mockProducts);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleScan = (code: string, product?: any) => {
    if (product) {
      addToCart(product);
      setShowScanner(false);
      // Show a success message or animation
    }
  };

  const handleCheckout = () => {
    setShowCart(false);
    setCurrentState('checkout');
  };

  const handleCheckoutComplete = () => {
    setCurrentState('success');
  };

  const handleNewOrder = () => {
    setCurrentState('shopping');
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case 'checkout':
        return (
          <Checkout
            onBack={() => {
              setCurrentState('shopping');
              setShowCart(true);
            }}
            onComplete={handleCheckoutComplete}
          />
        );
      case 'success':
        return <Success onNewOrder={handleNewOrder} />;
      default:
        return (
          <div className="min-h-screen bg-gray-50">
            <Header
              onScanClick={() => setShowScanner(true)}
              onCartClick={() => setShowCart(true)}
              onRecommendationClick={() => setShowRecommendations(true)}
            />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <ProductGrid />
            </main>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentState()}

      {/* Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <Scanner
            onClose={() => setShowScanner(false)}
            onScan={handleScan}
          />
        )}
      </AnimatePresence>

      {/* AI Recommendations Modal */}
      <RecommendationEngine
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
      />

      {/* Cart Sidebar */}
      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default App;