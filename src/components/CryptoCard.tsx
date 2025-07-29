import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CryptoCurrency } from '../types/crypto';

interface CryptoCardProps {
  crypto: CryptoCurrency;
  onClick: () => void;
  isSelected: boolean;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, onClick, isSelected }) => {
  const isPositive = crypto.price_change_percentage_24h > 0;
  
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-transparent'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={crypto.image} 
            alt={crypto.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white">{crypto.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{crypto.symbol}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="font-semibold">
            {isPositive ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Current Price</span>
          <span className="font-bold text-xl text-gray-800 dark:text-white">
            ${crypto.current_price.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Market Cap</span>
          <span className="text-gray-700 dark:text-gray-300">
            ${(crypto.market_cap / 1e9).toFixed(2)}B
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">24h Volume</span>
          <span className="text-gray-700 dark:text-gray-300">
            ${(crypto.total_volume / 1e9).toFixed(2)}B
          </span>
        </div>
      </div>
    </div>
  );
};