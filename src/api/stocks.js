import { callApiGet, formatCurrency } from "./index"



import {
  discoverListedStock,
  myStockData,
  topStockData,
  //myWishlistStockData,
  topMoversData,
  financialTransactionData,
  fundingActivityData,
  spotMarketStats,
  //newsData,
  //similarStocksData,
  //mainChartData,

} from './constant';



function generateStockData(upTrend, options) {
  options = options || {};
  const points = options.points || 13;
  const volatility = options.volatility || 3;
  const spikeProb = options.spikeProb || 0.1;
  const spikeScale = options.spikeScale || 12;
  const yMin = options.yMin || 6;
  const yMax = options.yMax || 18;

  function randBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  // split the band in half for start/end
  const mid = (yMin + yMax) / 2;
  const [startMin, startMax] = upTrend ? [yMin, mid] : [mid, yMax];
  const [endMin, endMax] = upTrend ? [mid, yMax] : [yMin, mid];

  let prevY = randBetween(startMin, startMax);
  const yEnd = randBetween(endMin, endMax);
  const trendStep = (yEnd - prevY) / (points - 1);

  // build raw series with clamp
  const raw = [];
  for (let i = 0; i < points; i++) {
    const x = i - 2;
    if (i === 0) {
      raw.push({ x, y: prevY });
      continue;
    }
    const noise = (Math.random() - 0.5) * volatility * 2;
    const spike = Math.random() < spikeProb
      ? (Math.random() - 0.5) * spikeScale * 2
      : 0;

    let y = prevY + trendStep + noise + spike;
    // clamp
    if (y < yMin) y = yMin;
    else if (y > yMax) y = yMax;

    raw.push({ x, y });
    prevY = y;
  }

  // normalize to fill [yMin, yMax]
  const ys = raw.map(p => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = (yMax - yMin) / ((maxY - minY) || 1);

  return raw.map(p => ({
    x: p.x,
    y: parseFloat(((p.y - minY) * scale + yMin).toFixed(2))
  }));
}


// Portfolio page -------------------------------------
// stocks du user
export const getHoldingsData = async (pubkey) => {
  pubkey = "AZoY3GD8fJTiA6yNnf6t8MgJ7d5x6vEC8natVssjGn3i"
  const endpoint = `portfolio/${pubkey}`;
  const portfolioData = await callApiGet(endpoint);

  return myStockData;
}


export const getCashBalance = async (pubkey) => {
  pubkey = "AZoY3GD8fJTiA6yNnf6t8MgJ7d5x6vEC8natVssjGn3i"
  const endpoint = `portfolio/${pubkey}/cash/`;
  const cashData = await callApiGet(endpoint);
  return cashData;
}


//Données globales du portfolio
export const getPortfolioData = async (pubkey, selectedTime, chartOnly, initialBalance) => {
  pubkey = "AZoY3GD8fJTiA6yNnf6t8MgJ7d5x6vEC8natVssjGn3i"
  const endpoint = `portfolio/${pubkey}${chartOnly ? '/chart' : ''}?period=${selectedTime}`;
  const portfolioData = await callApiGet(endpoint);
  const current_price = chartOnly ? initialBalance : portfolioData.totalBalance;
  const open_price = portfolioData.history[0].y;

  const performance = current_price - open_price;
  const variation = ((current_price - open_price) / open_price * 100).toFixed(2);
  const status = current_price > open_price;
  const percentageStr = isFinite(variation) ? `${Math.abs(variation)}%` : "100%";
  let positions = null;

  if (!chartOnly) {
    positions = Object.entries(portfolioData.assets).map(
      ([tokenAddress, asset], i) => {
        asset.asset_icon = asset.asset_icon.replace("https://littlejohn.fi", "http://10.0.2.2:3000")

        const currentValue = formatCurrency(asset.value);
        const { open_price, current_price } = asset;
        const variation = ((current_price - open_price) / open_price * 100).toFixed(2);
        const status = current_price - open_price > 0;

        const data = generateStockData(status, {
          volatility: 4,
          spikeProb: 0.15,
          spikeScale: 15,
          yMin: 6,
          yMax: 18
        });

        return {
          id: i,
          tokenAddress,
          image: asset.asset_icon,
          companyName: asset.asset_name,
          stockName: asset.asset_ticker,
          currentValue,
          percentage: `${Math.abs(variation)}%`,
          data,
          status,
          staking: {
            staked: '$125.78',
            unstaked: '$54.20',
            apy: '12.5%',
            availableBalance: '$1,250.00',
            lockPeriod: '30 days',
            minStakeAmount: '$10.00',
            maxStakeAmount: '$10,000.00',
            stakingFees: '$2.50',
          },
        };
      }
    );
  }

  const data = {
    id: 2,
    image: null,
    currentPrice: current_price,
    currentValue: formatCurrency(portfolioData.totalBalance),
    cashBalance: formatCurrency(portfolioData.cashBalance),
    equityBalance: formatCurrency(portfolioData.totalBalance - portfolioData.cashBalance),
    pnl: formatCurrency(portfolioData.pnl),
    performance: formatCurrency(performance),
    percentage: percentageStr,
    data: portfolioData.history,
    status,
    positions: chartOnly ? null : positions
  };

  return data;
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

{
  /*
    export const getWishlistData = async (pubkey) => {
    // await callApiGet(`users/${pubkey}/wishlist`);
    return myWishlistStockData;
  */
}

// Home page -----------------------------------
export const getAllStocks = async () => {
  const assets = await callApiGet(`static/assets`);
  const allStocks = assets
    .filter(asset => !asset.asset_categories.includes("ETF"))
    .map((asset, i) => {
      const currentValue = formatCurrency(asset.current_price);
      const { open_price, current_price } = asset;
      const variation = ((current_price - open_price) / open_price * 100).toFixed(2);
      const status = current_price - open_price > 0;

      const data = generateStockData(status, {
        volatility: 4,
        spikeProb: 0.15,
        spikeScale: 15,
        yMin: 6,
        yMax: 18
      });
      return {
        id: i,

        image: asset.asset_icon,
        companyName: asset.asset_name,
        stockName: asset.asset_ticker,
        currentValue,
        percentage: `${Math.abs(variation)}%`,
        data,
        status
      }
    });

  const topStocks = assets
    .filter(asset => asset.asset_categories.includes("ETF"))
    .map((asset, i) => {
      const currentValue = formatCurrency(asset.current_price);
      const { open_price, current_price } = asset;
      const variation = ((current_price - open_price) / open_price * 100).toFixed(2);
      const status = current_price - open_price > 0;

      const data = generateStockData(status, {
        volatility: 4,
        spikeProb: 0.15,
        spikeScale: 15,
        yMin: 6,
        yMax: 18
      });

      return {
        id: i,
        image: asset.asset_icon,
        companyName: asset.asset_name,
        stockName: asset.asset_ticker,
        currentValue,
        percentage: `${Math.abs(variation)}%`,
        data,
        status: status,
      }
    });


  return [allStocks, topStocks];

  [{
    id: 1,
    image: images.adobeIcon,
    companyName: 'Adobe',
    stockName: 'ADBE',
    currentValue: '$285.75',
    percentage: '4.58%',
    data: [
      { x: -2, y: 15 },
      { x: -1, y: 10 },
      { x: 0, y: 12 },
      { x: 1, y: 7 },
      { x: 2, y: 6 },
      { x: 3, y: 8 },
      { x: 4, y: 10 },
      { x: 5, y: 8 },
      { x: 6, y: 12 },
      { x: 7, y: 14 },
      { x: 8, y: 12 },
      { x: 9, y: 13.5 },
      { x: 10, y: 18 },
    ],
    status: false,
  }];
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