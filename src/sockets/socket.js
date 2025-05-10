// import { handleSocketMessage } from '../controllers/messageController.js';

// export default function setupSocket(io) {
//   io.on('connection', (socket) => {
//     console.log(`Socket ${socket.id} connected`);

//     socket.on('join-room', (groupId) => {
//       socket.join(groupId);
//       console.log(`Socket ${socket.id} joined group ${groupId}`);
//     });

//     handleSocketMessage(io, socket);

//     socket.on('disconnect', () => {
//       console.log(`Socket ${socket.id} disconnected`);
//     });
//   });
// }
export const initSocket = (io) => {
  io.on('connection', (socket) => {
    // eslint-disable-next-line no-console
    console.log('Socket connected:', socket.id)

    socket.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log('Socket disconnected:', socket.id)
    })

    // Thêm các event khác ở đây
    socket.on('send_message', (data) => {
      // eslint-disable-next-line no-console
      console.log('Message:', data)
      io.emit('receive_message', data) // gửi tới tất cả
    })
  })
}