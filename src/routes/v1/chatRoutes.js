// chatRoutes.js
import express from 'express';
import multer from 'multer';
import {
  sendMessageToFriend,
  getFriendMessages,
  sendMessageToGroup,
  getGroupMessages,
  deleteFriendMessage,
  deleteGroupMessage,
  uploadGroupImageMessage,
} from '../../controllers/chatController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ----- FRIEND CHAT -----
router.post('/friend', sendMessageToFriend);
router.get('/friend/:friendId', getFriendMessages);
router.delete('/friend/:messageId', deleteFriendMessage);

// ----- GROUP CHAT -----
router.post('/group', sendMessageToGroup);
router.get('/group/:groupId', getGroupMessages);
router.delete('/group/:messageId', deleteGroupMessage);
router.post('/group/image', upload.single('image'), uploadGroupImageMessage);

export default router;