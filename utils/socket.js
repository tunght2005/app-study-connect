import { io } from 'socket.io-client';

const socket = io('http://192.168.0.105:8017', {
  transports: ['websocket'],
  autoConnect: false, // thủ công kết nối khi cần
});

export default socket;
