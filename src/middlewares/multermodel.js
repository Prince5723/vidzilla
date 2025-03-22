import multer from "multer";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // ✅ Correct storage location
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // ✅ Correct filename handling
  }
});

export const upload = multer({ storage: storage });
