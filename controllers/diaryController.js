import DiaryEntry from "../models/DiaryEntry.js";
import mongoose from "mongoose";
export const getAllEntries = async (req, res) => {
    try {
        const { search, tag, location } = req.query;
        let filter = {};
        if (search) {
            filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } }
            ];
        }
        if (tag) {
            filter.tags = tag;
        }
        if (location) {
            filter.location = location;
        }
        const entries = await DiaryEntry.find(filter).sort({ createdAt: -1 });
        res.status(200).json(entries);
    } catch (error) {
        res.status(404).json({ message: "Unable to fetch diary entries" });
    }
};
    /**
    * @route GET /api/diary/:id
    * @desc Fetch a single diary entry by ID
    * @access Public (Authentication will be added in Part 2)
    */
export const getEntryById = async (req, res) => {
    try {
        const entry = await DiaryEntry.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: "Diary entry not found" });
        }
        res.status(200).json(entry);
    } catch (error) {
        res.status(404).json({ message: "Unable to retrieve diary entry" });
    }
};


/**
 * @route POST /api/diary
 * @desc Create a new diary entry
 * @access Public (Authentication will be added in Part 2)
 */
export const createEntry = async (req, res) => {
    try {
        const { user, title, content, reflection, location, tags } = req.body;
        if (!title || !content || !location || !user) {
            return res.status(400).json({ message: "Title, user, content, and location are required." });
        }
        const newDiaryEntry = new DiaryEntry({
            user,
            title,
            content,
            reflection,
            location,
            tags: tags || []
        });
        await newDiaryEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        console.error("Error creating diary entry:", error);
        res.status(400).json({ message: "Unable to create diary entry" });
    }
};

/**
 * @route PUT /api/diary/:id
 * @desc Update an existing diary entry
 * @access Public (Authentication will be added in Part 2)
 */
export const updateEntry = async (req, res) => {
    try {
        const { title, content, location, tags } = req.body;
        const updatedData = { title, content, location, tags };

        const entry = await DiaryEntry.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!entry) {
            return res.status(404).json({ message: "Diary entry not found" });
        }

        res.status(200).json(entry);
    } catch (error) {
        res.status(404).json({ message: "Unable to update diary entry" });
    }
};

/**
 * @route DELETE /api/diary/:id
 * @desc Delete a diary entry
 * @access Public (Authentication will be added in Part 2)
 */
export const deleteEntry = async (req, res) => {
    try {
        const entry = await DiaryEntry.findByIdAndDelete(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: "Diary entry not found" });
        }
        res.status(200).json({ message: "Diary entry deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: "Unable to delete diary entry" });
    }
};
