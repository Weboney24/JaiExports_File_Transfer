const multer = require("multer");
const path = require("path");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try{
      cb(null, path.join(__dirname,"../public/uploads/"));
    }catch(err){
      console.log(err);
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
