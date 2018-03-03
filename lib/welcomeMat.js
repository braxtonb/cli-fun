// Hello :)

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const hello = () => {
  clear();
  console.log(
    chalk.green(
      figlet.textSync('Smile :)', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );
};

const youtube = () => {
  console.log(
    chalk.red(
      figlet.textSync('Youtube', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );
};

const twitch = () => {
  console.log(
    chalk.magenta(
      figlet.textSync('Twitch', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );
};

module.exports = {
  hello,
  twitch,
  youtube,
};
