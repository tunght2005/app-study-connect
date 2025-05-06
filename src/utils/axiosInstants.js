// import axios from 'axios'
// import AsyncStorage from '@react-native-async-storage/async-storage'

// const instance = axios.create({
//   baseURL: 'http://192.168.0.105:8081/api', // thay <IP> bằng địa chỉ máy chủ backend
//   timeout:  8081,
// })

// instance.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem('token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export default instance
