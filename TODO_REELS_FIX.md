# Reel Upload and Display Fix

## Problem
Reels were being created but not displaying in the frontend because the upload folder for reels didn't exist.

## Changes Made
1. Created the `server/uploads/reels/` folder
2. Updated `server/config/multer.js` to include a separate `uploadReel` multer instance that saves to `uploads/reels/`
3. Updated `server/routes/reelRoutes.js` to use `uploadReel.single("video")` for the `/add` route

## How It Works Now
- When a user creates a reel in CreateReel.jsx, the video is uploaded via FormData
- The backend saves the video file to `server/uploads/reels/` with a timestamp filename
- The reel document is created in MongoDB with `video_url` pointing to `/uploads/reels/filename`
- The frontend fetches reels and displays them using the `video_url`

## Testing
1. Restart the server if needed (though changes should be hot-reloaded)
2. Go to Create Reel page
3. Upload a video and create a reel
4. Navigate to Reels page - the new reel should appear

## Files Modified
- server/uploads/reels/ (created)
- server/config/multer.js (added uploadReel)
- server/routes/reelRoutes.js (updated to use uploadReel)

## Next Steps
- Test the reel creation and viewing
- If issues persist, check browser console for errors
- Ensure the video file is accessible at the URL
