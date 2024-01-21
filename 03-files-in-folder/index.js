const fs = require('fs');
const path = require('path');

function infoAboutFile(file) {
  const fileName = path.parse(path.join(__dirname, 'secret-folder', file.name));
  const extFile = path
    .extname(path.join(__dirname, 'secret-folder', file.name))
    .split('');
  let sizeOfFile;

  fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
    // console.log(stats.size / 1000 + 'kb');
    sizeOfFile = stats.size / 1000 + 'kb';

    console.log(
      `${fileName.name} - ${extFile
        .splice(1, extFile.length)
        .join('')} - ${sizeOfFile}`,
    );
  });
}

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.isDirectory()) {
        // Не очень понятно из задания, нужно ли тут сделать логику для вывода внутренних файлов из вложенной папки.
        // В Discord сказали, что нет.
      } else {
        if (file.name === '.DS_Store') return;
        infoAboutFile(file);
      }
    });
  },
);
