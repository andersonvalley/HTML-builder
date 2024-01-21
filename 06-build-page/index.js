const fs = require('fs');
const path = require('path');
const fsPromise = require('fs/promises');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
});

async function createBuildHtml() {
  try {
    const template = await fsPromise.readFile(
      path.join(__dirname, 'template.html'),
    );
    const components = await fsPromise.readdir(
      path.join(__dirname, 'components'),
      { withFileTypes: true },
    );

    let html = template.toString();
    let currentComponent = '';
    for (const component of components) {
      if (component.isFile() && path.extname(component.name) === '.html') {
        currentComponent = await fsPromise.readFile(
          path.join(__dirname, 'components', `${component.name}`),
        );
        html = html.replace(
          `{{${component.name.slice(0, -5)}}}`,
          currentComponent.toString(),
        );
      }
    }

    fsPromise.writeFile(__dirname + '/project-dist/index.html', html);
  } catch (err) {
    console.log(err);
  }
}

createBuildHtml();

function bundleStyles() {
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
          fs.truncate(path.join(__dirname, 'project-dist', 'style.css'), () => {
            fs.readFile(
              path.join(__dirname, 'styles', file.name),
              'utf-8',
              (err, data) => {
                if (err) throw err;

                fs.appendFile(
                  path.join(__dirname, 'project-dist', 'style.css'),
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
}

bundleStyles();

async function copyAssets(src, dist) {
  await fs.mkdir(dist, { recursive: true }, (err) => {
    if (err) throw err;
  });
  const files = await fsPromise.readdir(src, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isFile()) {
      fs.copyFile(
        path.join(src, file.name),
        path.join(dist, file.name),
        (err) => {
          if (err) throw err;
        },
      );
    } else {
      copyAssets(path.join(src, file.name), path.join(dist, file.name));
    }
  });
}

copyAssets(
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'project-dist', 'assets'),
);
