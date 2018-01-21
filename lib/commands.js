// The Lieutenant

const { exec } = require('child_process');

const playGames = (cli, game) =>
  exec(`osascript applescripts/games.scpt ${cli} ${game}`);

const watchStarWars = cli => {
  exec(`osascript applescripts/starwars.scpt ${cli}`);
};

const showNotification = text =>
  exec(`osascript applescripts/notification.scpt ${text}`);

module.exports = {
  playGames,
  watchStarWars,
  showNotification,
};
