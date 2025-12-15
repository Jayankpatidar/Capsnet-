import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const reelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/reels/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const storyStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/stories/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

export const upload = multer({ storage });
export const uploadReel = multer({ storage: reelStorage });
export const uploadStory = multer({ storage: storyStorage });
