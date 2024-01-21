const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({ input, output });
process.on('exit', () => {
  console.clear();
  console.log('Text has been saved');
});

function writeFile(question = 'Write something: ') {
  rl.question(question, (answer) => {
    if (answer === 'exit') {
      rl.close();
      return;
    }

    fs.access(path.join(__dirname, 'text.txt'), fs.F_OK, (err) => {
      if (err) {
        fs.writeFile(path.join(__dirname, 'text.txt'), answer, (err) => {
          if (err) throw err;
        });
      } else {
        const newLine = '\n' + answer;
        fs.appendFile(path.join(__dirname, 'text.txt'), newLine, (err) => {
          if (err) throw err;
        });
      }

      writeFile('Write something again please: ');
    });
  });
}

writeFile();
