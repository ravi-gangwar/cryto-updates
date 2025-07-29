import React, { useMemo } from "react";
import { RefreshCw, TrendingUp, AlertCircle } from "lucide-react";
import { CryptoCard } from "./components/CryptoCard";
import { PriceChart } from "./components/PriceChart";
import { Calculator } from "./components/Calculator";
import { ComparisonTable } from "./components/ComparisonTable";
import { ThemeToggle } from "./components/ThemeToggle";
import { useCrypto } from "./hooks/useCrypto";
import { useTheme } from "./hooks/useTheme";

function App() {
  const {
    cryptos,
    selectedCrypto,
    setSelectedCrypto,
    priceHistory,
    loading,
    chartLoading,
    error,
    wsConnected,
    refreshData,
  } = useCrypto();

  const { isDark, toggleTheme } = useTheme();

  const selectedCryptoData = cryptos.find(
    (crypto) => crypto.id === selectedCrypto
  );

  const memoizedCryptoCards = useMemo(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {cryptos.map((crypto) => (
          <CryptoCard
            key={crypto.id}
            crypto={crypto}
            onClick={() => setSelectedCrypto(crypto.id)}
            isSelected={selectedCrypto === crypto.id}
          />
        ))}
      </div>
    ),
    [cryptos, selectedCrypto, setSelectedCrypto]
  );

  if (error) {
    return (
      <div
        className={`min-h-screen ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        } flex items-center justify-center`}
      >
        <div className="text-center p-8">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2
            className={`text-2xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Oops! Something went wrong
          </h2>
          <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {error}
          </p>
          <button
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* Header */}
      <header
        className={`${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white"
        } shadow-lg border-b`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-blue-600" size={32} />
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Crypto Dashboard
                </h1>
                <div className="flex items-center space-x-2">
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Real-time cryptocurrency tracking & analysis
                  </p>
                  <div
                    className={`flex items-center space-x-1 text-xs ${
                      wsConnected ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        wsConnected
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span>{wsConnected ? "Live" : "Offline"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              <button
                onClick={refreshData}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <RefreshCw
                  className={`${loading ? "animate-spin" : ""}`}
                  size={16}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Crypto Cards */}
            {memoizedCryptoCards}

            {/* Chart */}
            <div className="mb-8">
              <PriceChart
                data={priceHistory}
                coinName={selectedCryptoData?.name || ""}
                loading={chartLoading}
              />
            </div>

            {/* Calculator and Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Calculator cryptos={cryptos} />
              <ComparisonTable cryptos={cryptos} />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white"
        } border-t mt-12`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Built with React, TypeScript, and Tailwind CSS • Data from
              CoinGecko API & Binance WebSocket
            </p>
            <p
              className={`text-xs mt-2 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {wsConnected
                ? "Live updates via WebSocket"
                : "Updates every 60 seconds"}{" "}
              • Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
