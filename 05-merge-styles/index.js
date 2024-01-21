const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (
        !file.isDirectory() &&
        path.extname(path.join(__dirname, 'styles', file.name)) === '.css'
      ) {
        fs.truncate(path.join(__dirname, 'project-dist', 'bundle.css'), () => {
          fs.readFile(
            path.join(__dirname, 'styles', file.name),
            'utf-8',
            (err, data) => {
              if (err) throw err;

              fs.appendFile(
                path.join(__dirname, 'project-dist', 'bundle.css'),
                data,
                (err) => {
                  if (err) throw err;
                },
              );
            },
          );
        });
      }
    });
  },
);
