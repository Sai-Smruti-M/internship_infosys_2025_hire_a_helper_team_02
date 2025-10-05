const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const bcrypt = require('bcrypt');

// ✅ Multer in-memory storage (no disk saving)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Convert image buffer to Base64 string for frontend
    let profile_image = '';
    if (user.profile_image && user.profile_image.data) {
      profile_image = `data:${user.profile_image.contentType};base64,${user.profile_image.data.toString('base64')}`;
    }

    res.json({ ...user.toObject(), profile_image });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE user info
router.put('/:id', async (req, res) => {
  const { email_id } = req.body;

  try {
    if (email_id) {
      const existingUser = await User.findOne({ email_id, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email is already taken' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

    // Convert image buffer to Base64 for frontend
    let profile_image = '';
    if (updatedUser.profile_image && updatedUser.profile_image.data) {
      profile_image = `data:${updatedUser.profile_image.contentType};base64,${updatedUser.profile_image.data.toString('base64')}`;
    }

    res.json({ success: true, user: { ...updatedUser.toObject(), profile_image } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// UPLOAD profile picture
router.post('/:id', upload.single('profile_picture'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profile_image: { data: req.file.buffer, contentType: req.file.mimetype } },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const profile_image = `data:${user.profile_image.contentType};base64,${user.profile_image.data.toString('base64')}`;

    res.json({ success: true, user, profile_image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// REMOVE profile picture
router.delete('/remove-profile-picture/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profile_image: null },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'Profile picture removed', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to remove profile picture' });
  }
});

// CHANGE PASSWORD
router.post('/change-password/:id', async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Both current and new passwords are required' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
