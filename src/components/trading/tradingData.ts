
export interface Stock {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  sector: string;
}

export interface PortfolioHolding {
  id: number;
  symbol: string;
  name: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  totalValue: number;
  gain: number;
  gainPercent: number;
}

export interface HistoricalPrice {
  date: string;
  value: number;
}

export interface Transaction {
  id: number;
  type: 'buy' | 'sell';
  symbol: string;
  name: string;
  shares: number;
  price: number;
  total: number;
  date: string;
  status: 'completed' | 'pending' | 'canceled';
}

export interface WatchlistItem {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  alerts: {
    above?: number;
    below?: number;
  };
}

export interface NewsItem {
  id: number;
  title: string;
  source: string;
  time: string;
  summary: string;
  url: string;
  relatedSymbols: string[];
}

export interface MarketIndex {
  id: number;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

// Sample portfolio performance data
export const portfolioPerformanceData: HistoricalPrice[] = [
  { date: "Jan", value: 10000 },
  { date: "Feb", value: 12000 },
  { date: "Mar", value: 11500 },
  { date: "Apr", value: 13500 },
  { date: "May", value: 14200 },
  { date: "Jun", value: 15000 },
  { date: "Jul", value: 14800 },
  { date: "Aug", value: 16000 },
  { date: "Sep", value: 15500 },
  { date: "Oct", value: 16700 },
  { date: "Nov", value: 17500 },
  { date: "Dec", value: 18200 },
];

// Sample portfolio allocation data
export const portfolioAllocationData = [
  { name: "Aksyon", value: 60 },
  { name: "Obligasyon", value: 20 },
  { name: "Kach", value: 15 },
  { name: "Lòt", value: 5 },
];

// Sample holdings data
export const holdingsData: PortfolioHolding[] = [
  {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 10,
    averageCost: 150.75,
    currentPrice: 175.34,
    totalValue: 1753.4,
    gain: 246.6,
    gainPercent: 16.31
  },
  {
    id: 2,
    symbol: "MSFT",
    name: "Microsoft Corp.",
    shares: 5,
    averageCost: 290.25,
    currentPrice: 310.65,
    totalValue: 1553.25,
    gain: 102,
    gainPercent: 7.01
  },
  {
    id: 3,
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    shares: 8,
    averageCost: 140.50,
    currentPrice: 132.80,
    totalValue: 1062.4,
    gain: -61.6,
    gainPercent: -5.48
  },
  {
    id: 4,
    symbol: "TSLA",
    name: "Tesla Inc.",
    shares: 3,
    averageCost: 280.30,
    currentPrice: 265.55,
    totalValue: 796.65,
    gain: -44.25,
    gainPercent: -5.26
  },
  {
    id: 5,
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    shares: 4,
    averageCost: 420.15,
    currentPrice: 452.80,
    totalValue: 1811.2,
    gain: 130.6,
    gainPercent: 7.77
  },
];

// Sample watchlist data
export const watchlistData: WatchlistItem[] = [
  {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.34,
    change: 2.5,
    changePercent: 1.45,
    alerts: {
      above: 180,
      below: 160
    }
  },
  {
    id: 2,
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 310.65,
    change: 1.2,
    changePercent: 0.39,
    alerts: {
      above: 320
    }
  },
  {
    id: 3,
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 138.21,
    change: -0.68,
    changePercent: -0.49,
    alerts: {
      below: 130
    }
  },
  {
    id: 4,
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 465.78,
    change: 3.45,
    changePercent: 0.75,
    alerts: {}
  },
];

// Sample market indices
export const marketIndicesData: MarketIndex[] = [
  {
    id: 1,
    name: "S&P 500",
    value: 4,783.35,
    change: 25.50,
    changePercent: 0.54
  },
  {
    id: 2,
    name: "NASDAQ",
    value: 15,145.78,
    change: 110.45,
    changePercent: 0.73
  },
  {
    id: 3,
    name: "DOW",
    value: 37,625.15,
    change: -42.80,
    changePercent: -0.11
  },
];

// Sample news data
export const marketNewsData: NewsItem[] = [
  {
    id: 1,
    title: "Fed decides to maintain current interest rates",
    source: "Financial Times",
    time: "1 èdtan pase",
    summary: "The Federal Reserve has decided to maintain the current interest rates, citing economic stability and controlled inflation.",
    url: "#",
    relatedSymbols: ["SPY", "QQQ"]
  },
  {
    id: 2,
    title: "Apple announces new product line for next quarter",
    source: "Wall Street Journal",
    time: "3 èdtan pase",
    summary: "Apple Inc. has announced a new line of products expected to launch in the next quarter, potentially boosting their market position.",
    url: "#",
    relatedSymbols: ["AAPL"]
  },
  {
    id: 3,
    title: "Tech stocks surge amid strong earnings reports",
    source: "Bloomberg",
    time: "5 èdtan pase",
    summary: "Technology stocks have seen a significant surge following stronger-than-expected earnings reports from major companies in the sector.",
    url: "#",
    relatedSymbols: ["MSFT", "GOOGL", "AMZN"]
  },
  {
    id: 4,
    title: "Oil prices fall as global demand slows",
    source: "Reuters",
    time: "1 jou pase",
    summary: "Global oil prices have seen a decline as demand slows, particularly in emerging markets facing economic challenges.",
    url: "#",
    relatedSymbols: ["XOM", "CVX"]
  },
];

// Sample transactions history
export const transactionsData: Transaction[] = [
  {
    id: 1,
    type: 'buy',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 2,
    price: 175.34,
    total: 350.68,
    date: '2023-12-15',
    status: 'completed'
  },
  {
    id: 2,
    type: 'sell',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    shares: 1,
    price: 265.55,
    total: 265.55,
    date: '2023-12-10',
    status: 'completed'
  },
  {
    id: 3,
    type: 'buy',
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    shares: 3,
    price: 452.80,
    total: 1358.40,
    date: '2023-12-05',
    status: 'completed'
  },
  {
    id: 4,
    type: 'buy',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    shares: 1,
    price: 310.65,
    total: 310.65,
    date: '2023-11-28',
    status: 'completed'
  }
];
