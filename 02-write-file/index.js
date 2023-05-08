const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'w' });

console.log('Введите текст:');

process.stdin.on('data', data => {
  const input = data.toString().trim();
  
  if (input === 'exit') {
    console.log('До свидания!');
    process.exit();
  } else {
    writeStream.write(`${input}\n`);
    console.log('Введите текст:');
  }
});

process.on('SIGINT', () => {
  console.log('До свидания!');
  process.exit();
});
