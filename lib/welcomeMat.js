// Hello :)

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const hello = () => {
  clear();
  console.log(
    chalk.red(
      figlet.textSync('Smile :)', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );
};

module.exports = hello;
