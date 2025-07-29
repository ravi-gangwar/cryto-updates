import React, { useState } from "react";
import { Calculator as CalculatorIcon } from "lucide-react";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
}

interface CalculatorProps {
  cryptos: Crypto[];
}

export const Calculator: React.FC<CalculatorProps> = ({ cryptos }) => {
  const [amount, setAmount] = useState("");
  const [fromCrypto, setFromCrypto] = useState("");
  const [toCrypto, setToCrypto] = useState("");

  const fromCryptoData = cryptos.find((crypto) => crypto.id === fromCrypto);
  const toCryptoData = cryptos.find((crypto) => crypto.id === toCrypto);

  const calculateConversion = () => {
    if (!amount || !fromCryptoData || !toCryptoData) return null;

    const fromPrice = fromCryptoData.current_price;
    const toPrice = toCryptoData.current_price;
    const convertedAmount = (parseFloat(amount) * fromPrice) / toPrice;

    return convertedAmount.toFixed(6);
  };

  const result = calculateConversion();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <CalculatorIcon className="text-blue-600" size={24} />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Crypto Calculator
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From
          </label>
          <select
            value={fromCrypto}
            onChange={(e) => setFromCrypto(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select cryptocurrency</option>
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To
          </label>
          <select
            value={toCrypto}
            onChange={(e) => setToCrypto(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select cryptocurrency</option>
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {result && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              Conversion Result:
            </p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {amount} {fromCryptoData?.symbol.toUpperCase()} = {result}{" "}
              {toCryptoData?.symbol.toUpperCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
