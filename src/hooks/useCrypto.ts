import { useState, useEffect, useCallback, useMemo } from 'react';
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

  const loadCryptoPrices = useCallback(async () => {
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
  }, []);

  const loadPriceHistory = useCallback(async (coinId: string) => {
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
  }, []);

  const handleWebSocketUpdate = useCallback((update: WebSocketPriceUpdate) => {
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
  }, []);

  const handleWebSocketConnectionChange = useCallback((connected: boolean) => {
    console.log('WebSocket connection status:', connected);
    setWsConnected(connected);
  }, []);

  useEffect(() => {
    loadCryptoPrices();
    
    // Initialize WebSocket connection
    const ws = new CryptoWebSocket(handleWebSocketUpdate, handleWebSocketConnectionChange);
    ws.connect();
    
    // Fallback: refresh every 120 seconds in case WebSocket fails
    const interval = setInterval(loadCryptoPrices, 120000);
    
    return () => {
      clearInterval(interval);
      ws.disconnect();
      setWsConnected(false);
    };
  }, [loadCryptoPrices, handleWebSocketUpdate, handleWebSocketConnectionChange]);

  useEffect(() => {
    if (selectedCrypto) {
      loadPriceHistory(selectedCrypto);
    }
  }, [selectedCrypto, loadPriceHistory]);

  const setSelectedCryptoCallback = useCallback((cryptoId: string) => {
    setSelectedCrypto(cryptoId);
  }, []);

  const refreshDataCallback = useCallback(() => {
    loadCryptoPrices();
  }, [loadCryptoPrices]);

  return useMemo(() => ({
    cryptos,
    selectedCrypto,
    setSelectedCrypto: setSelectedCryptoCallback,
    priceHistory,
    loading,
    chartLoading,
    error,
    wsConnected,
    refreshData: refreshDataCallback
  }), [
    cryptos,
    selectedCrypto,
    setSelectedCryptoCallback,
    priceHistory,
    loading,
    chartLoading,
    error,
    wsConnected,
    refreshDataCallback
  ]);
};