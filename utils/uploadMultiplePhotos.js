const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Please upload only images', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadMultipleImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

exports.resizeMultipleImages = async (req, res, next) => {
    if (!req.file.imageCover || !req.file.images) next();

    //Cover Image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer).
        resize(2000, 1333).
        toFormat('jpeg').
        jpeg({ quality: 90 }).
        toFile(`public/images/${req.body.imageCover}`);

    //Images
    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, index) => {
            const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;

            await sharp(file.buffer).
                resize(2000, 1333).
                toFormat('jpeg').
                jpeg({ quality: 90 }).
                toFile(`public/images/${filename}`);

            req.body.images.push(filename);
        })
    );

    next();
};