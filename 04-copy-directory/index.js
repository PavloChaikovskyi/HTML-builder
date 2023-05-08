const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const filesDir = path.join(__dirname, 'files');
  const copyDir = path.join(__dirname, 'files-copy');

  // Создание папки files-copy, если она ещё не существует
  try {
    await fs.access(copyDir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(copyDir, { recursive: true });
    } else {
      throw err;
    }
  }

  // Чтение содержимого папки files
  const files = await fs.readdir(filesDir);

  // Копирование файлов из папки files в папку files-copy
  await Promise.all(files.map(async (file) => {
    const srcPath = path.join(filesDir, file);
    const destPath = path.join(copyDir, file);
    const stats = await fs.stat(srcPath);
    if (stats.isFile()) {
      await fs.copyFile(srcPath, destPath);
    } else if (stats.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyDirRecursive(srcPath, destPath);
    }
  }));
}

async function copyDirRecursive(src, dest) {
  const files = await fs.readdir(src);
  await Promise.all(files.map(async (file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stats = await fs.stat(srcPath);
    if (stats.isFile()) {
      await fs.copyFile(srcPath, destPath);
    } else if (stats.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyDirRecursive(srcPath, destPath);
    }
  }));
}

copyDir()
  .then(() => console.log('Directory copied successfully'))
  .catch((err) => console.error(err));
