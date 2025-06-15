const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const resizeImage = async (req, res, next) => {
  if (!req.file) return next(); 

  const inputPath = req.file.path;
  const outputPath = path.join(req.file.destination, 'resized-' + req.file.filename);

  console.log('inputPath,outputPath',inputPath,outputPath);
  
  try {
    await sharp(inputPath)
      .resize({ width: 400 }) 
      .jpeg({ quality: 70 })  
      .toFile(outputPath);

    // Apaga imagem original pesada
    fs.unlinkSync(inputPath);

    // Atualiza req.file para apontar para a nova imagem
    req.file.filename = 'resized-' + req.file.filename;
    req.file.path = outputPath;

    next();
  } catch (err) {
    console.error('Erro ao redimensionar imagem:', err);
    next(err);
  }
};

module.exports = resizeImage;
