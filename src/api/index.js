

const API_VERSION = `0`;
const API_BASE_URL = `https://littlejohn.fi/api/v${API_VERSION}`;
// const API_BASE_URL = `http://10.0.2.2:3000/api/v${API_VERSION}`;


export const callApiGet = async (endpoint) => {
  const endpoint_url = `${API_BASE_URL}/${endpoint}`;
  const res = await (await fetch(endpoint_url)).json();
  return res;
}


export function formatCurrency(input) {
  const number = parseFloat(input);
  if (isNaN(number)) return '$0.00';

  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}


export function formatShares(amount) {
  if (amount === 0) return "0";
  if (amount < 0.01) return amount.toPrecision(2); // or more digits if needed
  return amount.toFixed(2);
}