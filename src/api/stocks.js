import { callApiGet } from "./index"

import { 
  discoverListedStock, 
  myStockData, 
  topStockData,
  //myWishlistStockData,
  portfolioData,
  topMoversData,
  financialTransactionData,
  fundingActivityData,
  spotMarketStats,
  //newsData,
  //similarStocksData,
  //mainChartData,

} from './constant';

// Portfolio page -------------------------------------
// stocks du user
export const getHoldingsData = async (pubkey) => {
  // await callApiGet();
  return myStockData;
}
//Données globales du portfolio
export const getPortfolioData = async (pubkey) => {
  // await callApiGet(`users/${pubkey}/portfolio`);
  return portfolioData;
}

//Historique des transactions
export const getTransactionHistory = async (pubkey) => {
  // await callApiGet(`users/${pubkey}/transactions`);
  return financialTransactionData;
}

//Activités de financement (dépôts/retraits)
export const getFundingActivity = async (pubkey) => {
  // await callApiGet(`users/${pubkey}/funding`);
  return fundingActivityData;
}

{/* export const getWishlistData = async (pubkey) => {
  // await callApiGet(`users/${pubkey}/wishlist`);
  return myWishlistStockData;
*/}

// Home page -----------------------------------
export const getAllStocks = async () => {
  // await callApiGet('stocks/all');
  return discoverListedStock;
}


export const getETFsData = async () => {
  // await callApiGet('stocks/etfs');
  return topStockData;
}

// Discover page --------------------------------
// Top movers/trending stocks
export const getTopMovers = async () => {
  // await callApiGet('stocks/top-movers');
  return topMoversData;
}

//Recherche de stocks
export const searchStocks = async (query) => {
  // await callApiGet(`stocks/search?q=${query}`);
  return discoverListedStock.filter(stock => 
    stock.companyName.toLowerCase().includes(query.toLowerCase()) ||
    stock.stockName.toLowerCase().includes(query.toLowerCase())
  );
}


//Stock detail - --------------------------------
// Données d'un stock spécifique
export const getStockDetails = async (stockSymbol) => {
  // await callApiGet(`stocks/${stockSymbol}`);
  return discoverListedStock.find(stock => stock.stockName === stockSymbol);
}

//Données de performance d'un stock
export const getStockPerformance = async (stockSymbol, period = '1D') => {
  // await callApiGet(`stocks/${stockSymbol}/performance?period=${period}`);
  const stock = discoverListedStock.find(s => s.stockName === stockSymbol);
  return stock?.data || [];
}

export const getStockMarketStats = async (stockSymbol) => {
  // await callApiGet(`stocks/${stockSymbol}/market-stats`);
  return spotMarketStats;
}