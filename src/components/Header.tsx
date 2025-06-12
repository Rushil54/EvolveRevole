import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Scan, Store, Brain } from 'lucide-react';
import { useStore } from '../store/useStore';

interface HeaderProps {
  onScanClick: () => void;
  onCartClick: () => void;
  onRecommendationClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onScanClick, onCartClick, onRecommendationClick }) => {
  const { cart } = useStore();
  
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Store size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">QuickMart</h1>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* AI Recommendations Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRecommendationClick}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Brain size={18} />
              <span className="hidden sm:inline text-sm">AI Assist</span>
            </motion.button>

            {/* Scan Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onScanClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Scan size={18} />
              <span className="hidden sm:inline text-sm">Scan</span>
            </motion.button>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              className="relative bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};