import multer from 'multer';

// Memory storage to process buffers directly with pdf-parse and OCR
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'text/plain',
    'text/markdown',
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.endsWith('.pdf') || file.originalname.endsWith('.txt')) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Please upload a PDF, PNG, JPG, WEBP, or TXT file.'), false);
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Max 10MB file limit
  },
});

export default uploadMiddleware;
