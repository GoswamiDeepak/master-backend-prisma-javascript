import multer from 'multer';
import createHttpError from 'http-errors';
import path from 'path';

export const supportedImageMimes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/svg',
    'image/gif',
    'image/webp',
];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/temp');
    },
    filename: function (req, file, cb) {
        const fileName = `${file.fieldname}-${Date.now()}${path.extname(
            file.originalname
        )}`;
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    if (!supportedImageMimes.includes(file.mimetype)) {
        return cb(createHttpError(400, 'Only support jpg | png | gif.'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
});

// Wrapper function to handle multer errors
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return next(createHttpError(400, err.message));
    } else if (err) {
        return next(err);
    }
    next();
};

// Create different upload middlewares
export const uploadHandlers = {
    // Single file upload
    single: (fieldName) => {
        return (req, res, next) => {
            upload.single(fieldName)(req, res, (err) => {
                handleMulterError(err, req, res, next);
            });
        };
    },

    // Multiple files with same field name
    array: (fieldName, maxCount = 5) => {
        return (req, res, next) => {
            upload.array(fieldName, maxCount)(req, res, (err) => {
                handleMulterError(err, req, res, next);
            });
        };
    },

    // Multiple files with different field names
    fields: (fields) => {
        return (req, res, next) => {
            upload.fields(fields)(req, res, (err) => {
                handleMulterError(err, req, res, next);
            });
        };
    },
};
