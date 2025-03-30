const isDev = import.meta.env.DEV;
const API_URL = isDev ? '' : 'https://color-dorm-378d8e0e1e23.herokuapp.com';

export { API_URL }; 