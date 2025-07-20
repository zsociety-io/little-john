

const API_VERSION = `1`;
const API_BASE_URL = `https://api.littlejohn.fi/v${API_VERSION}/`;


export const callApiGet = async (endpoint) => {
  const endpoint_url = `${API_BASE_URL}/${endpoint}`;
  const res = await (await fetch(endpoint_url)).json();
  return discoverListedStock;
}

