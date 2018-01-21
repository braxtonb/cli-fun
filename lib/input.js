// Prompt user for input

const inquirer = require('inquirer');
const ACTIVITIES = require('./constants').ACTIVITIES;
const Commands = require('./commands');

const questions = [
  {
    type: 'list',
    name: 'activity',
    message: 'Which would you like to do?',
    choices: ['Play Games', 'Watch Star Wars'],
  },
  {
    type: 'list',
    name: 'game',
    message: 'Which game would you like to play?',
    choices: [
      'tetris',
      'pong',
      '5x5',
      'blackbox',
      'solitaire',
      'gomoku',
      'life',
      'snake',
    ],
    when: ({ activity }) => activity === 'Play Games',
  },
  {
    type: 'list',
    name: 'cli',
    message: 'Select the CLI you would like to use',
    choices: ['Terminal', 'Hyper'],
  },
];

const promptUser = () =>
  inquirer.prompt(questions).then(answers => {
    const { activity, cli, game } = answers;

    switch (answers.activity) {
      case ACTIVITIES.PLAY_GAMES:
        Commands.playGames(cli, game);
        break;
      case ACTIVITIES.WATCH_STAR_WARS:
        Commands.watchStarWars(cli);
        break;
      default:
        Commands.showNotification('"Mr. Robot is a great TV Show"');
    }
  });

module.exports = promptUser;
