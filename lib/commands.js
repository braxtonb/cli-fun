// The Lieutenant

const open = require('open-pip');
const ytdl = require('ytdl-core');
const fs = require('fs');
const { exec } = require('child_process');
const WelcomeMat = require('./welcomeMat');
const twitchStreams = require('./api/twitch-get-stream');
const { YOUTUBE } = require('./config');

/**
 * Invokes youtube download tool to print url of a Youtube Video
 * pipes URL into open-pip cli tool to open video in macOS native player-in-picture
 * @param {String} cli - name of the cli to use
 * @param {String} game - name of the game
 */
const playGames = (cli, game) =>
  exec(`osascript applescripts/games.scpt ${cli} ${game}`);

/**
 * Invokes youtube download tool to print url of a Youtube Video
 * pipes URL into open-pip cli tool to open video in macOS native player-in-picture
 * @param {String} videoCode - unique id of youtube video
 */
const watchYoutube = videoCode => {
  const URL = `${YOUTUBE.rootURL}/watch?v=${videoCode}`;

  ytdl
    .getInfo(URL, {})
    .then(result => open(result.formats[0].url))
    .catch(() => handleWatchError('youtube', videoCode));
};

/**
 * Invokes twitch cli tool to retrieve a single m3u8 URL of a Twitch stream
 * pipes m3u8 URL into open-pip cli tool to open stream in macOS native player-in-picture
 * @param {String} streamName
 * @param {String} clientID
 */
const watchTwitch = (streamName, clientID) => {
  if (!streamName || !clientID) {
    !streamName && console.error('Missing twitch stream name. Exiting');
    !clientID && console.error('Missing twitch client ID. Exiting');
    process.exit(1);
  }

  twitchStreams(clientID)
    .get(streamName)
    .then(streams => streams.filter(stream => stream.url.endsWith('.m3u8'))[0])
    .then(({ url }) => open(url))
    .catch(() => handleWatchError('twitch', streamName));
};

/**
 * Invokes Applescript file to launch ASCIInimation Star Wars
 * @param {String} cli - name of the cli to use
 */
const watchStarWars = cli =>
  exec(`osascript applescripts/starwars.scpt ${cli}`);

/**
 * Invokes Applescript file to display notification
 * @param {String} text - text to display in notification
 */
const showNotification = text =>
  exec(`osascript applescripts/notification.scpt ${text}`);

/**
 * Curry function to handle error potentially thrown by watchTwitch or watchYoutube functions
 * @param {String} type - whether error thrown by youtube or twitch
 * @param {String} videoCode - currently only the stream name used in watchTwitch method
 * @returns {Function} - error handler
 */
const handleWatchError = (type, videoCode) => {
  console.log('Error loading video.');
  type === 'youtube' && console.log(`Video is unavailable`);
  type === 'twitch' &&
    console.log(`Verify your client ID is valid. ${videoCode} may be offline`);
  return;
};

module.exports = {
  playGames,
  showNotification,
  watchStarWars,
  watchTwitch,
  watchYoutube,
};
