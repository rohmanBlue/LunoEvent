import axios from 'axios';
const apiCall = axios.create({
  baseURL: 'https://starfish-app-xrxoq.ondigitalocean.app/',
});

export default apiCall;
