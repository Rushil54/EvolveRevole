import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, DollarSign, ShoppingBag as ShoppingList, X, Sparkles, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product } from '../types';

interface RecommendationEngineProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RecommendationRequest {
  budget: number;
  dietary: string[];
  preferences: string[];
  occasion: string;
  servings: number;
}

export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({ isOpen, onClose }) => {
  const { products, addToCart } = useStore();
  const [step, setStep] = useState<'input' | 'loading' | 'results'>('input');
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  
  const [request, setRequest] = useState<RecommendationRequest>({
    budget: 50,
    dietary: [],
    preferences: [],
    occasion: 'daily',
    servings: 2
  });

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'Organic'
  ];

  const preferenceOptions = [
    'Quick & Easy', 'Healthy', 'Budget-Friendly', 'Gourmet', 'Local', 'Seasonal'
  ];

  const occasionOptions = [
    { value: 'daily', label: 'Daily Meals' },
    { value: 'party', label: 'Party/Event' },
    { value: 'romantic', label: 'Romantic Dinner' },
    { value: 'family', label: 'Family Gathering' },
    { value: 'snacks', label: 'Snacks & Treats' }
  ];

  const generateRecommendations = async () => {
    setStep('loading');
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // AI-like recommendation logic
    const availableProducts = products.filter(p => p.stock_quantity > 0);
    const recommended: Product[] = [];
    let currentCost = 0;
    
    // Priority scoring based on user preferences
    const scoredProducts = availableProducts.map(product => {
      let score = Math.random() * 0.3; // Base randomness
      
      // Budget efficiency score
      const priceRatio = product.price / request.budget;
      score += (1 - Math.min(priceRatio, 1)) * 0.3;
      
      // Category preferences
      if (request.dietary.includes('Organic') && product.name.toLowerCase().includes('organic')) {
        score += 0.4;
      }
      if (request.dietary.includes('Vegetarian') && ['Fruits', 'Vegetables', 'Dairy'].includes(product.category)) {
        score += 0.3;
      }
      if (request.preferences.includes('Healthy') && ['Fruits', 'Vegetables'].includes(product.category)) {
        score += 0.3;
      }
      if (request.preferences.includes('Budget-Friendly') && product.price < 5) {
        score += 0.2;
      }
      
      // Occasion-based scoring
      if (request.occasion === 'party' && ['Beverages', 'Snacks'].includes(product.category)) {
        score += 0.3;
      }
      if (request.occasion === 'daily' && ['Fruits', 'Vegetables', 'Dairy', 'Bakery'].includes(product.category)) {
        score += 0.2;
      }
      
      return { product, score };
    });
    
    // Sort by score and select within budget
    scoredProducts.sort((a, b) => b.score - a.score);
    
    for (const { product } of scoredProducts) {
      if (currentCost + product.price <= request.budget && recommended.length < 8) {
        recommended.push(product);
        currentCost += product.price;
      }
    }
    
    setRecommendations(recommended);
    setTotalCost(currentCost);
    setStep('results');
  };

  const handleDietaryToggle = (option: string) => {
    setRequest(prev => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter(d => d !== option)
        : [...prev.dietary, option]
    }));
  };

  const handlePreferenceToggle = (option: string) => {
    setRequest(prev => ({
      ...prev,
      preferences: prev.preferences.includes(option)
        ? prev.preferences.filter(p => p !== option)
        : [...prev.preferences, option]
    }));
  };

  const addAllToCart = () => {
    recommendations.forEach(product => addToCart(product));
    onClose();
  };

  const reset = () => {
    setStep('input');
    setRecommendations([]);
    setTotalCost(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-4 md:inset-8 bg-white rounded-lg shadow-xl z-50 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <Brain size={28} />
                <div>
                  <h2 className="text-xl font-bold">AI Shopping Assistant</h2>
                  <p className="text-purple-100 text-sm">Get personalized recommendations</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-purple-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {step === 'input' && (
                <div className="p-6 space-y-6">
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign size={16} className="inline mr-1" />
                      Budget: ${request.budget}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="5"
                      value={request.budget}
                      onChange={(e) => setRequest(prev => ({ ...prev, budget: Number(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$10</span>
                      <span>$200</span>
                    </div>
                  </div>

                  {/* Servings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Servings: {request.servings}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={request.servings}
                      onChange={(e) => setRequest(prev => ({ ...prev, servings: Number(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Occasion */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {occasionOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => setRequest(prev => ({ ...prev, occasion: option.value }))}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                            request.occasion === option.value
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dietary Restrictions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Preferences
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {dietaryOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => handleDietaryToggle(option)}
                          className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                            request.dietary.includes(option)
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shopping Preferences
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {preferenceOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => handlePreferenceToggle(option)}
                          className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                            request.preferences.includes(option)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 'loading' && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      AI is analyzing your preferences...
                    </h3>
                    <p className="text-gray-600">Finding the perfect products for you</p>
                  </div>
                </div>
              )}

              {step === 'results' && (
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Sparkles className="mr-2 text-purple-500" size={20} />
                        Recommended for You
                      </h3>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Cost</p>
                        <p className="text-xl font-bold text-green-600">${totalCost.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          ${(request.budget - totalCost).toFixed(2)} under budget
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendations.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-800 text-sm flex-1">
                              {product.name}
                            </h4>
                            <span className="text-green-600 font-bold text-sm">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                          >
                            Add to Cart
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 bg-gray-50 rounded-b-lg">
              {step === 'input' && (
                <button
                  onClick={generateRecommendations}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <TrendingUp size={20} />
                  <span>Get AI Recommendations</span>
                </button>
              )}
              
              {step === 'results' && (
                <div className="flex space-x-3">
                  <button
                    onClick={reset}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    New Search
                  </button>
                  <button
                    onClick={addAllToCart}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <ShoppingList size={20} />
                    <span>Add All to Cart</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};