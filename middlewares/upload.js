const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Автоматическое создание папки
const uploadDir = path.join(__dirname, '../uploads/models');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.glb', '.gltf', '.obj', '.fbx'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только .glb, .gltf, .obj, .fbx'), false);
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});