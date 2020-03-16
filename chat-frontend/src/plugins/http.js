import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://10.236.131.152:3000'
});
