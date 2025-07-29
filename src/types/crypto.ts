export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

export interface PriceHistory {
  prices: [number, number][];
}

export interface ApiError {
  message: string;
  status?: number;
}