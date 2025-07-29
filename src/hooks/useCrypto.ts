import { useState, useEffect } from 'react';
import { CryptoCurrency, PriceHistory } from '../types/crypto';
import { fetchCryptoPrices, fetchPriceHistory, CryptoWebSocket, WebSocketPriceUpdate } from '../services/cryptoApi';

export const useCrypto = () => {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('bitcoin');
  const [priceHistory, setPriceHistory] = useState<PriceHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const loadCryptoPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCryptoPrices();
      setCryptos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  const loadPriceHistory = async (coinId: string) => {
    try {
      setChartLoading(true);
      const data = await fetchPriceHistory(coinId);
      setPriceHistory(data);
    } catch (err) {
      console.error('Failed to load price history:', err);
      setPriceHistory(null);
    } finally {
      setChartLoading(false);
    }
  };

  const handleWebSocketUpdate = (update: WebSocketPriceUpdate) => {
    console.log('WebSocket price update:', update);
    setCryptos(prevCryptos => 
      prevCryptos.map(crypto => {
        if (crypto.id === update.symbol) {
          return {
            ...crypto,
            current_price: parseFloat(update.price),
            price_change_percentage_24h: parseFloat(update.priceChangePercent)
          };
        }
        return crypto;
      })
    );
  };

  const handleWebSocketConnectionChange = (connected: boolean) => {
    console.log('WebSocket connection status:', connected);
    setWsConnected(connected);
  };

  useEffect(() => {
    loadCryptoPrices();
    
    // Initialize WebSocket connection
    const ws = new CryptoWebSocket(handleWebSocketUpdate, handleWebSocketConnectionChange);
    ws.connect();
    
    // Fallback: refresh every 60 seconds in case WebSocket fails
    const interval = setInterval(loadCryptoPrices, 60000);
    
    return () => {
      clearInterval(interval);
      ws.disconnect();
      setWsConnected(false);
    };
  }, []);

  useEffect(() => {
    if (selectedCrypto) {
      loadPriceHistory(selectedCrypto);
    }
  }, [selectedCrypto]);

  return {
    cryptos,
    selectedCrypto,
    setSelectedCrypto,
    priceHistory,
    loading,
    chartLoading,
    error,
    wsConnected,
    refreshData: loadCryptoPrices
  };
};