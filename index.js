const Hello = require('./lib/welcomeMat');
const Input = require('./lib/input');
const ACTIVITIES = require('./lib/constants').ACTIVITIES;
const Commands = require('./lib/commands');

const start = () => {
  Hello();

  Input.promptUser().then(answers => {
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
};

start();
