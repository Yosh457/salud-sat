const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuración del motor de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Los archivos se guardarán en la carpeta 'uploads/evidence'
        cb(null, 'uploads/evidence');
    },
    filename: (req, file, cb) => {
        // Generamos un nombre único: uuid + extensión original
        // Ej: 550e8400-e29b.jpg
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Filtro de archivos (Solo imágenes y PDFs)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de archivo no válido (Solo JPG, PNG, PDF)'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
    fileFilter: fileFilter
});

module.exports = upload;