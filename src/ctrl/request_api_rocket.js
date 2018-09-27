import axios from 'axios';

var axiosInstance = axios.create({
    baseURL: 'https://ten-lua.herokuapp.com/api/v1',
    timeout: 5000
});

export default axiosInstance ;