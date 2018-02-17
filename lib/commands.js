// The Lieutenant

const { exec } = require('child_process');

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
const watchYoutube = videoCode =>
  exec(
    `node_modules/ytdl/bin/ytdl.js --print-url --filter-container=mp4 ${
      videoCode
    } | node_modules/open-pip-cli/index.js`,
    handleWatchError('youtube', videoCode),
  );

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

  exec(
    `node_modules/twitch-url-cli/cli.js --client-id=${clientID} ${
      streamName
    } | node_modules/open-pip-cli/index.js`,
    handleWatchError('twitch', streamName),
  );
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
const handleWatchError = (type, videoCode) => (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  if (stderr.indexOf('Running') === -1) {
    console.log('Error loading video.');
    type === 'youtube' && console.log(`Video is unavailable`);
    type === 'twitch' &&
      console.log(
        `Verify your client ID is valid. ${videoCode} may be offline`,
      );
    return;
  } else {
    console.log('stderr', stderr);
  }
};

module.exports = {
  playGames,
  showNotification,
  watchStarWars,
  watchTwitch,
  watchYoutube,
};
