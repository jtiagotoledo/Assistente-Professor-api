const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  const inputPath = req.file.path;
  const tempOutputPath = path.join(req.file.destination, 'resized-' + req.file.filename);
  const finalOutputPath = path.join('uploads', 'resized-' + req.file.filename);

  try {
    await sharp(inputPath)
      .resize({ width: 400 })
      .jpeg({ quality: 70 })
      .toFile(tempOutputPath);

    fs.unlinkSync(inputPath); // remove original temporária

    fs.renameSync(tempOutputPath, finalOutputPath);

    req.file.filename = 'resized-' + req.file.filename;
    req.file.path = finalOutputPath;

    next();
  } catch (err) {
    console.error('❌ Erro ao redimensionar imagem:', err);
    return res.status(500).json({ erro: 'Erro ao processar imagem' });
  }
};

module.exports = resizeImage;
