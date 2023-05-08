const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist', 'bundle.css');

// Функция для чтения файла стилей
const readStyleFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf8');
};

// Функция для проверки расширения файла
const isCssFile = (file) => {
  return path.extname(file) === '.css';
};

// Чтение содержимого папки styles
fs.readdir(stylesPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // Фильтрация файлов с нужным расширением
  const cssFiles = files.filter(isCssFile);

  // Чтение содержимого файлов стилей и запись в массив
  const styles = cssFiles.map((file) => {
    const filePath = path.join(stylesPath, file);
    return readStyleFile(filePath);
  });

  // Запись массива стилей в файл bundle.css
  fs.writeFileSync(distPath, styles.join('\n'));
  console.log('Bundle created successfully!');
});
