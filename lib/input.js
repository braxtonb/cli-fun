// Prompt user for input

const inquirer = require('inquirer');
const Preferences = require('preferences');
const ACTIVITIES = require('./constants').ACTIVITIES;
const Commands = require('./commands');

const prefs = new Preferences('clifun');

const questions = [
  {
    type: 'list',
    name: 'activity',
    message: 'Which would you like to do?',
    choices: () => Object.values(ACTIVITIES),
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
    when: ({ activity }) => activity === ACTIVITIES.PLAY_GAMES,
  },
  {
    type: 'list',
    name: 'youtube',
    message: 'Which video would you like to watch?',
    choices: [
      {
        name: 'Lebron James ULTIMATE Mixtape Highlight',
        value: 'yZUUItxjpz4',
        short: 'Lebron James',
      },
      {
        name: "Dave Chapelle: For What It's Worth",
        value: 'Prs10jnq3YU',
        short: 'Dave Chapelle',
      },
      {
        name: "Gordon Ramsay's Top 5 Chicken Recipes",
        value: 'mcHddbql5pw',
        short: 'Gordon Ramsay',
      },
      {
        name: 'Some Random Video',
        value: 'dQw4w9WgXcQ',
        short: 'Some Random Video',
      },
    ],
    when: ({ activity }) => activity === ACTIVITIES.WATCH_YOUTUBE,
  },
  {
    type: 'input',
    name: 'twitchClientID',
    message:
      "Please enter your twitch client ID. (If you don't have one go to https://dev.twitch.tv/ and create an app!)",
    when: ({ activity }) =>
      activity === ACTIVITIES.WATCH_TWITCH &&
      (!prefs.twitch || !prefs.twitch.clientID),
  },
  {
    type: 'input',
    name: 'twitch',
    message: 'Which stream would you like to watch? (ex. Lirik)',
    when: ({ activity }) => activity === ACTIVITIES.WATCH_TWITCH,
  },
  {
    type: 'list',
    name: 'cli',
    message: 'Select the CLI you would like to use',
    choices: ['Terminal', 'Hyper'],
    when: ({ activity }) =>
      activity !== ACTIVITIES.WATCH_TWITCH &&
      activity !== ACTIVITIES.WATCH_YOUTUBE,
  },
];

/**
 * Prompts the user to select an activity
 * Invokes command based on activity selected
 */
const promptUser = () =>
  inquirer.prompt(questions).then(answers => {
    const { activity, cli, game, youtube, twitch, twitchClientID } = answers;

    switch (activity) {
      case ACTIVITIES.PLAY_GAMES:
        Commands.playGames(cli, game);
        break;
      case ACTIVITIES.WATCH_STAR_WARS:
        Commands.watchStarWars(cli);
        break;
      case ACTIVITIES.WATCH_YOUTUBE:
        Commands.watchYoutube(youtube);
        break;
      case ACTIVITIES.WATCH_TWITCH:
        if (!prefs.twitch || !prefs.twitch.clientID) {
          prefs.twitch = { clientID: twitchClientID };
        }
        Commands.watchTwitch(twitch, prefs.twitch.clientID);
        break;
      default:
        Commands.showNotification('"Mr. Robot is a great TV Show"');
    }
  });

module.exports = promptUser;
