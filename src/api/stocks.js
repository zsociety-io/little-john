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
  const endpoint = `portfolio/${pubkey}`;
  const portfolioData = await callApiGet(endpoint);

  return myStockData;
}


export const getCashBalance = async (pubkey) => {
  const endpoint = `portfolio/${pubkey}/cash/`;
  const cashData = await callApiGet(endpoint);
  return cashData;
}

export const getPortfolioAsset = async (pubkey, tokenAddress, selectedTime) => {
  const endpoint = `portfolio/${pubkey}/asset/${tokenAddress}?period=${selectedTime}`;
  const assetData = await callApiGet(endpoint);
  const chart = Array.isArray(assetData?.chart) ? [...assetData.chart] : [];

  if (chart.length === 0) {
    return {
      xMin: 0,
      xMax: 0,
      yMin: 0,
      yMax: 0,
      data: [],
    };
  }
  chart.sort((a, b) => a.x - b.x);

  const xs = chart.map(p => p.x);
  const ys = chart.map(p => p.y);

  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);

  let yMin = Math.min(...ys);
  let yMax = Math.max(...ys);

  if (yMin === yMax) {
    const delta = yMin === 0 ? 1 : Math.abs(yMin * 0.05);
    yMin = yMin - delta;
    yMax = yMax + delta;
  } else {
    const padding = (yMax - yMin) * 0.1;
    yMin = yMin - padding;
    yMax = yMax + padding;
  }

  //const currentValue = formatCurrency(assetData.portfolioData.value);

  return {
    xMin,
    xMax,
    yMin,
    yMax,
    portfolioData: {
      currentValue: formatCurrency(assetData?.portfolioData?.value),
      balance: assetData?.portfolioData?.balance.toFixed(2),
    },
    data: chart,
    assetData
  };
};

//Données globales du portfolio
export const getPortfolioData = async (pubkey, selectedTime, chartOnly, initialBalance) => {
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
          image: asset.asset_icon,
          balance: asset.balance,
          companyName: asset.asset_name,
          stockName: asset.asset_ticker,
          description: asset.asset_description,
          tokenAddress: asset.token_address,
          currentPrice: formatCurrency(current_price),
          currentValue,
          percentage: `${Math.abs(variation)}%`,
          data,
          status,
          staking: {
            staked: '$0',
            unstaked: currentValue,
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
    currentPrice: formatCurrency(current_price),
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
        description: asset.asset_description,
        tokenAddress: asset.token_address,
        image: asset.asset_icon,
        companyName: asset.asset_name,
        stockName: asset.asset_ticker,
        currentPrice: currentValue,
        percentage: `${Math.abs(variation)}%`,
        percentageFloat: Number(variation),
        data,
        status
      }
    });

  const allEtfs = assets
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
        tokenAddress: asset.token_address,
        currentPrice: currentValue,
        percentage: `${Math.abs(variation)}%`,
        percentageFloat: Number(variation),
        data,
        status: status,
      }
    });


  return [allStocks, allEtfs];
}

export const getDiscoverStocks = async () => {
  const [allStocks, allEtfs] = await getAllStocks();
  const allAssets = [...allEtfs, ...allStocks];

  const topAssets = allAssets
    .filter(asset => typeof asset.percentageFloat === 'number')
    .sort((a, b) => b.percentageFloat - a.percentageFloat)
    .slice(0, 5);

  return [allAssets, topAssets];
};


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