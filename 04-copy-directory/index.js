const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) throw err;
});

function copyFiles(file) {
  fs.copyFile(
    path.join(__dirname, 'files', file),
    path.join(__dirname, 'files-copy', file),
    (err) => {
      if (err) throw err;
    },
  );
}

function createFolder(files) {
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) throw err;

    files.forEach((file) => {
      copyFiles(file);
    });
  });
}

fs.readdir(path.join(__dirname, 'files'), (err, files) => {
  if (err) throw err;

  fs.rm(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) throw err;

    createFolder(files);
  });
});
