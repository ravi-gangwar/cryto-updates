import React from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { CryptoCurrency } from '../types/crypto';

interface ComparisonTableProps {
  cryptos: CryptoCurrency[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ cryptos }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="text-purple-600" size={24} />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Price Comparison</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Crypto</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Price</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">24h Change</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto, index) => {
              const isPositive = crypto.price_change_percentage_24h > 0;
              return (
                <tr key={crypto.id} className={`border-b border-gray-100 dark:border-gray-700 ${
                  index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'dark:bg-gray-800'
                }`}>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={crypto.image} 
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{crypto.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{crypto.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-4 px-2 font-semibold text-gray-800 dark:text-white">
                    ${crypto.current_price.toLocaleString()}
                  </td>
                  <td className="text-right py-4 px-2">
                    <div className={`flex items-center justify-end space-x-1 ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span className="font-semibold">
                        {isPositive ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-2 text-gray-700 dark:text-gray-300">
                    ${(crypto.market_cap / 1e9).toFixed(2)}B
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};