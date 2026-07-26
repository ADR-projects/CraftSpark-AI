const express = require('express');
const router = express.Router();
const Craft = require('../models/Craft');
const auth = require('../middleware/auth');

// Get all saved crafts for the logged in user
router.get('/', auth, async (req, res) => {
    try {
        const crafts = await Craft.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(crafts);
    } catch (err) {
        console.error("Error fetching crafts:", err);
        res.status(500).json({ error: "Failed to fetch crafts" });
    }
});

// Save a new craft
router.post('/', auth, async (req, res) => {
    try {
        const { title, emoji, gradient } = req.body;
        
        const newCraft = new Craft({
            userId: req.user.id,
            title,
            emoji,
            gradient
        });
        
        const savedCraft = await newCraft.save();
        res.status(201).json(savedCraft);
    } catch (err) {
        console.error("Error saving craft:", err);
        res.status(500).json({ error: "Failed to save craft" });
    }
});

// Delete a saved craft
router.delete('/:id', auth, async (req, res) => {
    try {
        const craft = await Craft.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!craft) return res.status(404).json({ error: "Craft not found" });
        res.json({ message: "Craft deleted" });
    } catch (err) {
        console.error("Error deleting craft:", err);
        res.status(500).json({ error: "Failed to delete craft" });
    }
});

module.exports = router;
