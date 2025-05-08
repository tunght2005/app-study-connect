import Group from '../models/groupModel'

// Tạo nhóm mới
const createGroup = async (req, res) => {
  try {
    const { name, members = [] } = req.body

    // Lấy thông tin người dùng hiện tại từ token
    const createdBy = req.user.id

    // Đảm bảo người tạo nhóm (nhóm trưởng) có trong danh sách thành viên
    if (!members.includes(createdBy)) {
      members.push(createdBy)
    }

    // Tạo nhóm mới
    const group = new Group({
      name,
      members,
      createdBy // Người tạo nhóm
    })

    await group.save()

    res.status(201).json({ message: 'Tạo nhóm thành công', group })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}

// Lấy danh sách tất cả các nhóm
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('members', 'username email')
      .populate('createdBy', 'username email') // Lấy thông tin nhóm trưởng

    const result = groups.map(group => ({
      ...group._doc,
      members: group.members.map(member => ({
        ...member._doc,
        isLeader: member._id.toString() === group.createdBy._id.toString()
      }))
    }))

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}

// Lấy thông tin chi tiết một nhóm
const getGroupById = async (req, res) => {
  // console.log('run')

  try {
    const group = await Group.findOne({createdBy: req.params.id})
      // .populate('members', 'username email')
      // .populate('createdBy', 'username email') // Lấy thông tin nhóm trưởng
    // console.log('run')
    if (!group) {
      return res.status(404).json({ message: 'Nhóm không tồn tại' })
    }
    // console.log(group)
    // Phân biệt nhóm trưởng và các thành viên
    const members = group.members.map(member => ({
      ...member._doc,
      role: member._id.toString() === group.createdBy._id.toString() ? 'admin' : 'member'
    }))

    res.status(200).json({
      ...group._doc,
      members
    })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}

// Cập nhật thông tin nhóm
const updateGroup = async (req, res) => {
  try {
    const { name, members } = req.body

    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { name, members },
      { new: true }
    ).populate('members adminId createdBy', 'username email')

    if (!group) {
      return res.status(404).json({ message: 'Nhóm không tồn tại' })
    }

    res.status(200).json({ message: 'Cập nhật nhóm thành công', group })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}

// Cập nhật trạng thái nhóm
const updateGroupStatus = async (req, res) => {
  try {
    const { status } = req.body

    // Kiểm tra trạng thái hợp lệ
    if (!['online', 'offline'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' })
    }

    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!group) {
      return res.status(404).json({ message: 'Nhóm không tồn tại' })
    }

    res.status(200).json({ message: 'Cập nhật trạng thái nhóm thành công', group })
  } catch (error) {
    res.status (500).json({ message: 'Lỗi server', error })
  }
}

// Xóa nhóm
const deleteGroup = async (req, res) => {
  try {
    const userId = req.user.id // Lấy userId từ middleware xác thực (token)

    const group = await Group.findById(req.params.id)

    if (!group) {
      return res.status(404).json({ message: 'Nhóm không tồn tại' })
    }

    if (userId !== group.createdBy.toString()) {
      return res.status(403).json({ message: 'Chỉ nhóm trưởng mới có quyền xóa nhóm' });
    }

    await Group.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Xóa nhóm thành công' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}


const addMemberToGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.body

    // Lấy thông tin nhóm
    const group = await Group.findById(groupId).populate('members', 'friends')
    if (!group) {
      return res.status(404).json({ message: 'Nhóm không tồn tại' })
    }

    // Kiểm tra nếu người mời (người thực hiện request) là thành viên của nhóm
    const inviterId = req.user.id
    if (!group.members.some(member => member._id.toString() === inviterId)) {
      return res.status(403).json({ message: 'Chỉ thành viên trong nhóm mới có quyền mời người khác' })
    }

    // Kiểm tra nếu thành viên được mời đã có trong nhóm
    if (group.members.some(member => member._id.toString() === memberId)) {
      return res.status(400).json({ message: 'Thành viên đã có trong nhóm' })
    }

    // Kiểm tra nếu thành viên được mời có mối quan hệ bạn bè với ít nhất một thành viên trong nhóm
    const isFriendWithAnyMember = group.members.some(member =>
      member.friends && member.friends.includes(memberId)
    );

    if (!isFriendWithAnyMember) {
      return res.status(400).json({ message: 'Thành viên được mời không có mối quan hệ bạn bè với bất kỳ thành viên nào trong nhóm' });
    }

    // Thêm thành viên vào nhóm
    group.members = [...new Set([...group.members.map(m => m._id.toString()), memberId])] // Loại bỏ trùng lặp
    await group.save()

    res.status(200).json({ message: 'Thêm thành viên thành công', group });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};


const removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.body

    // Lấy thông tin nhóm
    const group = await Group.findById(groupId)
    if (!group) {
      return res.status(404).json({ message: 'Nhóm không tồn tại' })
    }

    // Kiểm tra nếu người dùng hiện tại là nhóm trưởng
    if (req.user.id !== group.createdBy.toString()) {
      return res.status(403).json({ message: 'Chỉ nhóm trưởng mới có quyền xóa thành viên' })
    }

    // Kiểm tra nếu thành viên có trong nhóm
    if (!group.members.includes(memberId)) {
      return res.status(400).json({ message: 'Thành viên không có trong nhóm' })
    }

    // Không cho phép xóa nhóm trưởng khỏi nhóm
    if (memberId === group.createdBy.toString()) {
      return res.status(400).json({ message: 'Không thể xóa nhóm trưởng khỏi nhóm' })
    }

    // Xóa thành viên khỏi nhóm
    group.members = group.members.filter(member => member.toString() !== memberId)
    await group.save()

    res.status(200).json({ message: 'Xóa thành viên thành công', group })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}
export const joinGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId; // Lấy từ URL
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Nhóm không tồn tại' });
    }

    if (group.members.includes(userId)) {
      return res.status(200).json({
        message: 'Bạn đã là thành viên của nhóm. Chuyển hướng đến chat.',
        group
      });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({ message: 'Tham gia nhóm thành công', group });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

export default {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  updateGroupStatus,
  addMemberToGroup,
  removeMemberFromGroup,
  joinGroup
}