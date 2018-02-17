// Prompt user for input

const fetch = require('node-fetch');
const inquirer = require('inquirer');
const Preferences = require('preferences');
const CONFIG = require('./config');
const API = require('./api');
const Commands = require('./commands');

const prefs = new Preferences('clifun');
const { ACTIVITIES, TWITCH } = CONFIG;
const {
  createLiveFollowedChannelsURL,
  getFollowedChannels,
  getLiveFollowedChannels,
} = API;

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
    type: 'confirm',
    name: 'twitchUseLoginName',
    message: `Are you ${prefs.twitch.loginName}?`,
    default: true,
    when: () => prefs.twitch && prefs.twitch.loginName,
  },
  {
    type: 'input',
    name: 'twitchLoginName',
    message: "What's your twitch login name?",
    when: ({ activity, twitchUseLoginName }) =>
      activity === ACTIVITIES.WATCH_TWITCH &&
      (!twitchUseLoginName || !prefs.twitch || !prefs.twitch.loginName),
    validate: twitchLoginName => {
      const URL = `${TWITCH.rootURL}/users/?login=${twitchLoginName}`;
      const options = { headers: TWITCH.headers };

      return fetch(URL, options)
        .then(res => res.json())
        .then(json => {
          if (json._total < 1) {
            return Promise.resolve('login name not found');
          }
          const user = json.users[0];
          prefs.twitch = {
            ...prefs.twitch,
            loginName: user.display_name,
            userId: user._id,
          };
          return Promise.resolve(true);
        })
        .catch(error => Promise.resolve('error validating login name'));
    },
  },
  {
    type: 'confirm',
    name: 'twitchUseClientId',
    message: 'Use existing client ID?',
    default: true,
  },
  {
    type: 'input',
    name: 'twitchClientID',
    message:
      "Please enter your twitch client ID. (If you don't have one go to https://dev.twitch.tv/ and create an app!)",
    when: ({ activity, twitchUseClientId }) =>
      activity === ACTIVITIES.WATCH_TWITCH &&
      (!twitchUseClientId || !prefs.twitch || !prefs.twitch.clientID),
  },
  {
    type: 'list',
    name: 'twitchFollow',
    message: 'Which live followed channel would you like to watch?',
    pageSize: 50,
    choices: () =>
      getFollowedChannels(prefs.twitch.userId)
        .then(createLiveFollowedChannelsURL)
        .then(getLiveFollowedChannels)
        .catch(error => Promise.resolve([TWITCH.defaultChoice])),
  },
  {
    type: 'input',
    name: 'twitch',
    message: 'Which stream would you like to watch? (ex. Lirik)',
    when: ({ activity, twitchFollow }) =>
      activity === ACTIVITIES.WATCH_TWITCH &&
      twitchFollow === TWITCH.defaultChoice,
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
    const {
      activity,
      cli,
      game,
      youtube,
      twitch,
      twitchClientID,
      twitchFollow,
      twitchUseClientId,
    } = answers;

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
        if (!twitchUseClientId || !prefs.twitch || !prefs.twitch.clientID) {
          prefs.twitch = { ...prefs.twitch, clientID: twitchClientID };
        }

        const streamName =
          twitchFollow === TWITCH.defaultChoice ? twitch : twitchFollow;

        Commands.watchTwitch(streamName, prefs.twitch.clientID);
        break;
      default:
        Commands.showNotification('"Mr. Robot is a great TV Show"');
    }
  });

module.exports = promptUser;
