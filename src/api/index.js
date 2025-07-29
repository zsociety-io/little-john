

const API_VERSION = `0`;
const API_BASE_URL = `http://10.0.2.2:3000/api/v${API_VERSION}`;


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
