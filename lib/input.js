// Prompt user for input

const fetch = require('node-fetch');
const inquirer = require('inquirer');
const Preferences = require('preferences');
const CONFIG = require('./config');
const TWITCH_API = require('./api/twitch');
const YOUTUBE_API = require('./api/youtube');
const Commands = require('./commands');

const prefs = new Preferences('clifun');
const { ACTIVITIES, TWITCH, YOUTUBE } = CONFIG;

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
    type: 'confirm',
    name: 'twitchUseClientId',
    message: 'Use existing client ID?',
    default: true,
    when: ({ activity }) =>
      activity === ACTIVITIES.WATCH_TWITCH &&
      prefs.twitch &&
      prefs.twitch.clientID,
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
    type: 'confirm',
    name: 'twitchUseLoginName',
    message: `Are you ${prefs.twitch ? prefs.twitch.loginName : ''}?`,
    default: true,
    when: ({ activity }) =>
      activity === ACTIVITIES.WATCH_TWITCH &&
      prefs.twitch &&
      prefs.twitch.loginName,
  },
  {
    type: 'input',
    name: 'twitchLoginName',
    message: "What's your twitch login name?",
    when: ({ activity, twitchUseLoginName, twitchClientID }) =>
      activity === ACTIVITIES.WATCH_TWITCH &&
      (!twitchUseLoginName || !prefs.twitch || !prefs.twitch.loginName),
    validate: (twitchLoginName, { twitchClientID }) => {
      const updatedClientID = twitchClientID || prefs.twitch.clientID;

      return TWITCH_API.verifyTwitchLoginName(twitchLoginName, updatedClientID)
        .then(res => {
          if (!res) {
            return TWITCH.invalidLogin;
          }

          prefs.twitch = {
            ...prefs.twitch,
            ...res,
          };
          return true;
        })
        .catch(error => TWITCH.invalidLogin);
    },
  },
  {
    type: 'list',
    name: 'twitchFollow',
    message: 'Which live followed channel would you like to watch?',
    pageSize: 50,
    choices: ({ twitchClientID }) => {
      const { userId, clientID } = prefs.twitch;
      const updatedClientID = twitchClientID || clientID;

      return TWITCH_API.getFollowedChannels(userId, updatedClientID)
        .then(TWITCH_API.createLiveFollowedChannelsURL)
        .then(url => TWITCH_API.getLiveFollowedChannels(url, updatedClientID))
        .catch(error => [TWITCH.defaultChoice]);
    },
    when: ({ activity }) => activity === ACTIVITIES.WATCH_TWITCH,
  },
  {
    type: 'input',
    name: 'twitch',
    message: 'Which stream would you like to watch? (ex. Lirik)',
    when: ({ activity, twitchFollow }) =>
      activity === ACTIVITIES.WATCH_TWITCH &&
      twitchFollow === TWITCH.defaultChoice.value,
  },
  {
    type: 'confirm',
    name: 'youtubeUseAPIKey',
    message: 'Use existing youtube API key?',
    default: true,
    when: ({ activity }) =>
      activity === ACTIVITIES.WATCH_YOUTUBE &&
      prefs.youtube &&
      prefs.youtube.apiKey,
  },
  {
    type: 'input',
    name: 'youtubeAPIKey',
    message:
      "Please enter your youtube api key. (If you don't have one go to https://console.developers.google.com/apis/credentials and create an app!)",
    when: ({ activity, youtubeUseAPIKey }) =>
      activity === ACTIVITIES.WATCH_YOUTUBE &&
      (!youtubeUseAPIKey || !prefs.youtube || !prefs.youtube.apiKey),
    validate: stuff => {
      console.log('prefs', prefs);
      console.log('stuff', stuff);
      return true;
    }
  },
  {
    type: 'confirm',
    name: 'youtubeUseChannelID',
    message: `Is this your channel ID ${
      prefs.youtube ? prefs.youtube.channelID : ''
    }?`,
    default: true,
    when: ({ activity }) =>
      activity === ACTIVITIES.WATCH_YOUTUBE &&
      prefs.youtube &&
      prefs.youtube.channelID,
  },
  {
    type: 'input',
    name: 'youtubeChannelID',
    message: "What's your youtube channel ID?",
    when: ({ activity, youtubeUseChannelID }) =>
      activity === ACTIVITIES.WATCH_YOUTUBE &&
      (!youtubeUseChannelID || !prefs.youtube || !prefs.youtube.channelID),
    validate: (youtubeChannelID, { youtubeAPIKey }) => {
      const updatedAPIKey = youtubeAPIKey || prefs.youtube.apiKey;

      return YOUTUBE_API.verifyYoutubeChannelID(youtubeChannelID, updatedAPIKey)
        .then(res => {
          if (!res) {
            return YOUTUBE.invalidChannelID;
          }
          return true;
        })
        .catch(error => {
          return YOUTUBE.invalidChannelID;
        });
    },
  },
  {
    type: 'list',
    name: 'youtubeChannelSubscription',
    message: "Which channel's videos do you want to watch?",
    pageSize: 50,
    choices: ({ youtubeAPIKey, youtubeChannelID }) => {
      const { channelID, apiKey } = prefs.youtube;
      const updatedAPIKey = youtubeAPIKey || apiKey;
      const updatedChannelID = youtubeChannelID || channelID;

      return YOUTUBE_API.getSubscriptionList(
        updatedChannelID,
        updatedAPIKey,
      ).catch(error => [YOUTUBE_API.defaultChannelChoice]);
    },
    when: ({ activity }) => activity === ACTIVITIES.WATCH_YOUTUBE,
  },
  {
    type: 'list',
    name: 'youtube',
    message: 'Which video do you want to watch?',
    pageSize: 25,
    choices: ({ youtubeAPIKey, youtubeChannelSubscription }) => {
      const { apiKey } = prefs.youtube;
      const updatedAPIKey = youtubeAPIKey || apiKey;

      return YOUTUBE_API.getChannelVideos(
        youtubeChannelSubscription,
        updatedAPIKey,
      ).catch(error => {
        console.log('error', error);
        return [YOUTUBE.defaultVideoChoice];
      });
    },
    when: ({ activity }) => activity === ACTIVITIES.WATCH_YOUTUBE,
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
      twitch,
      twitchUseClientId,
      twitchClientID,
      twitchFollow,
      youtubeUseAPIKey,
      youtubeAPIKey,
      youtubeUseChannelID,
      youtubeChannelID,
      youtube,
    } = answers;

    switch (activity) {
      case ACTIVITIES.PLAY_GAMES:
        Commands.playGames(cli, game);
        break;
      case ACTIVITIES.WATCH_STAR_WARS:
        Commands.watchStarWars(cli);
        break;
      case ACTIVITIES.WATCH_YOUTUBE:
        // prettier-ignore
        if (!youtubeUseAPIKey || !youtubeUseChannelID || !prefs.youtube || !prefs.youtube.apiKey) {
          let updatedFields = {};
          updatedFields.apiKey = youtubeAPIKey || prefs.youtube.apiKey;
          updatedFields.channelID = youtubeChannelID || prefs.youtube.channelID;
          prefs.youtube = { ...prefs.youtube, ...updatedFields };
        }
        Commands.watchYoutube(youtube);
        break;
      case ACTIVITIES.WATCH_TWITCH:
        if (!twitchUseClientId || !prefs.twitch || !prefs.twitch.clientID) {
          prefs.twitch = { ...prefs.twitch, clientID: twitchClientID };
        }

        const streamName =
          twitchFollow === TWITCH.defaultChoice.value ? twitch : twitchFollow;

        Commands.watchTwitch(streamName, prefs.twitch.clientID);
        break;
      default:
        Commands.showNotification('"Mr. Robot is a great TV Show"');
    }
  });

module.exports = promptUser;
