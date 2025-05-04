const Group = require('../models/Group'); // Import model Group

// Tạo nhóm học
exports.createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;
        const group = new Group({ name, members });
        await group.save();
        res.status(201).json({ success: true, message: 'Group created!', group });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách nhóm học
exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json({ success: true, groups });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách nhóm học theo userId
exports.getGroupsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const groups = await Group.find({ members: userId }); // Lọc nhóm học theo userId
        res.status(200).json({ success: true, groups });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa nhóm học
exports.deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findByIdAndDelete(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found!' });
        }
        res.status(200).json({ success: true, message: `Group ${groupId} deleted!` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Thêm thành viên vào nhóm
exports.addMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { members } = req.body;

        // Kiểm tra nếu `members` không tồn tại hoặc không phải là một mảng
        if (!Array.isArray(members)) {
            return res.status(400).json({ success: false, message: 'Members must be an array!' });
        }

        // Tìm nhóm học theo groupId
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found!' });
        }

        // Lọc các thành viên chưa có trong nhóm
        const newMembers = members.filter((member) => !group.members.includes(member));

        // Thêm các thành viên mới vào nhóm
        group.members.push(...newMembers);
        await group.save();

        res.status(200).json({
            success: true,
            message: `Added ${newMembers.length} new member(s) to group ${groupId}!`,
            group,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa thành viên khỏi nhóm
exports.removeMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { members } = req.body; // Nhận danh sách thành viên cần xóa

        // Kiểm tra nếu `members` không tồn tại hoặc không phải là một mảng
        if (!Array.isArray(members)) {
            return res.status(400).json({ success: false, message: 'Members must be an array!' });
        }

        // Tìm nhóm học theo groupId
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found!' });
        }

        // Lọc danh sách thành viên để loại bỏ các thành viên cần xóa
        group.members = group.members.filter((member) => !members.includes(member));
        await group.save();

        res.status(200).json({
            success: true,
            message: `Removed ${members.length} member(s) from group ${groupId}!`,
            group,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy thông tin chi tiết của nhóm học
exports.getGroupDetails = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found!' });
        }
        res.status(200).json({ success: true, group });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};