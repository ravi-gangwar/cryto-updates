import axios from 'axios';
import { CryptoCurrency, PriceHistory } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';
const WS_URL = 'wss://stream.binance.com:9443/stream';

// Popular cryptocurrencies to display
export const POPULAR_CRYPTOS = [
  'bitcoin',
  'ethereum', 
  'cardano',
  'solana',
  'dogecoin'
];

// Binance symbol mapping (CoinGecko ID to Binance symbol)
const BINANCE_SYMBOL_MAP: Record<string, string> = {
  'bitcoin': 'btcusdt',
  'ethereum': 'ethusdt',
  'cardano': 'adausdt',
  'solana': 'solusdt',
  'dogecoin': 'dogeusdt'
};

// Reverse mapping for finding CoinGecko ID from Binance symbol
const REVERSE_BINANCE_MAP: Record<string, string> = Object.entries(BINANCE_SYMBOL_MAP).reduce(
  (acc, [coingeckoId, binanceSymbol]) => {
    acc[binanceSymbol] = coingeckoId;
    return acc;
  },
  {} as Record<string, string>
);

export interface WebSocketPriceUpdate {
  symbol: string;
  price: string;
  priceChangePercent: string;
}

export class CryptoWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private onPriceUpdate: (update: WebSocketPriceUpdate) => void;
  private onConnectionChange: (connected: boolean) => void;
  private pingInterval: number | null = null;
  private lastUpdateTime: Record<string, number> = {};
  private updateThrottle = 2000; // Throttle updates to every 2 seconds per symbol

  constructor(
    onPriceUpdate: (update: WebSocketPriceUpdate) => void,
    onConnectionChange: (connected: boolean) => void
  ) {
    this.onPriceUpdate = onPriceUpdate;
    this.onConnectionChange = onConnectionChange;
  }

  connect() {
    try {
      const symbols = Object.values(BINANCE_SYMBOL_MAP);
      const streams = symbols.map(symbol => `${symbol}@ticker`).join('/');
      const wsUrl = `${WS_URL}?streams=${streams}`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.reconnectAttempts = 0;
        this.onConnectionChange(true);
        
        // Start ping interval to keep connection alive
        this.pingInterval = window.setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ method: 'ping' }));
          }
        }, 30000); // Ping every 30 seconds
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          if (data.stream && data.data) {
            const tickerData = data.data;
            const symbol = tickerData.s.toLowerCase();
            const coinGeckoId = REVERSE_BINANCE_MAP[symbol];
            
            console.log('Processing ticker data:', {
              symbol,
              coinGeckoId,
              price: tickerData.c,
              priceChange: tickerData.P
            });
            
            if (coinGeckoId) {
              // Throttle updates to prevent excessive re-renders
              const now = Date.now();
              const lastUpdate = this.lastUpdateTime[coinGeckoId] || 0;
              
              if (now - lastUpdate >= this.updateThrottle) {
                this.lastUpdateTime[coinGeckoId] = now;
                this.onPriceUpdate({
                  symbol: coinGeckoId,
                  price: parseFloat(tickerData.c).toString(),
                  priceChangePercent: parseFloat(tickerData.P).toFixed(2)
                });
              }
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.onConnectionChange(false);
        this.handleReconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onConnectionChange(false);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.onConnectionChange(false);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
export const fetchCryptoPrices = async (): Promise<CryptoCurrency[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: POPULAR_CRYPTOS.join(','),
        order: 'market_cap_desc',
        per_page: 5,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw new Error('Failed to fetch cryptocurrency prices');
  }
};

export const getCryptoIdFromBinanceSymbol = (binanceSymbol: string): string | null => {
  return REVERSE_BINANCE_MAP[binanceSymbol] || null;
};
export const fetchPriceHistory = async (coinId: string): Promise<PriceHistory> => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: 7,
        interval: 'daily'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw new Error('Failed to fetch price history');
  }
};