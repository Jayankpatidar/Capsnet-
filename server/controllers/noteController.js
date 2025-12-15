import Note from "../model/Note.js";
// Create a new note
export const createNote = async (req, res) => {
 try {
 const userId = req.userId;
 const { title, content } = req.body;

 if (!title || !content) {
 return res.json({ success: false, message: 'Title and content are required' });
 }

 const note = await Note.create({
 user_id: userId,
 title,
 content
 });

 res.json({ success: true, note });
 } catch (error) {
 console.log(error.message);
 res.json({ success: false, message: error.message });
 }
};

// Get user's notes
export const getUserNotes = async (req, res) => {
 try {
 const userId = req.userId;

 const notes = await Note.find({ user_id: userId }).sort({ created_at: -1 });

 res.json({ success: true, notes });
 } catch (error) {
 console.log(error.message);
 res.json({ success: false, message: error.message });
 }
};

// Delete a note
export const deleteNote = async (req, res) => {
 try {
 const userId = req.userId;
 const { note_id } = req.params;

 const note = await Note.findOneAndDelete({
 _id: note_id,
 user_id: userId
 });

 if (!note) {
 return res.json({ success: false, message: 'Note not found' });
 }

 res.json({ success: true, message: 'Note deleted successfully' });
 } catch (error) {
 console.log(error.message);
 res.json({ success: false, message: error.message });
 }
};
