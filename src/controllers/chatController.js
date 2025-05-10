import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import path from 'path';

const areFriends = async (userId, friendId) => {
  try {
    const user = await User.findById(userId);
    return user?.friends.includes(friendId) || false;
  } catch (error) {
    return false;
  }
};

export const sendMessageToFriend = async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;
    if (!await areFriends(sender, recipient)) {
      return res.status(403).json({ success: false, message: 'You are not friends' });
    }
    const message = await Message.create({ sender, recipient, content });
    res.status(201).json({ success: true, message: 'Sent', data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFriendMessages = async (req, res) => {
  try {
    const { friendId } = req.params;
    const { userId } = req.query;
    if (!await areFriends(userId, friendId)) {
      return res.status(403).json({ success: false, message: 'Not friends' });
    }
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: friendId },
        { sender: friendId, recipient: userId },
      ],
    }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sendMessageToGroup = async (req, res) => {
  try {
    const { sender, groupId, content } = req.body;
    const message = await Message.create({ sender, groupId, content });
    res.status(201).json({ success: true, message: 'Sent to group', data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await Message.find({ groupId })
      .populate('sender', 'username name') // Prioritize username, include name
      .sort({ timestamp: -1 });

    // Filter out messages with invalid or missing sender
    const validMessages = messages.filter((msg) => msg.sender !== null && msg.sender.username);

    res.status(200).json({ success: true, messages: validMessages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteFriendMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;
    const message = await Message.findById(messageId);
    if (!message || (message.sender.toString() !== userId && message.recipient.toString() !== userId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteGroupMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;
    const message = await Message.findById(messageId);
    if (!message || message.sender.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadGroupImageMessage = async (req, res) => {
  try {
    const { sender, groupId } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const imageUrl = `/uploads/${file.filename}`;
    const message = await Message.create({ sender, groupId, imageUrl });

    res.status(201).json({ success: true, message: 'Image sent', data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

