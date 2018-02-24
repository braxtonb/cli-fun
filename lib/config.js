// Some things never change

const config = {
  ACTIVITIES: {
    PLAY_GAMES: 'Play Games',
    WATCH_STAR_WARS: 'Watch Star Wars',
    WATCH_YOUTUBE: 'Watch Youtube',
    WATCH_TWITCH: 'Watch Twitch',
  },
  TWITCH: {
    rootURL: 'https://api.twitch.tv/kraken',
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': 'doo4fkagdtbl2pwt8fves0nwqqrhs0',
    },
    defaultChoice: {
      name: "Other: type in the stream's name",
      value: "Other: type in the stream's name",
      short: "Other: type in the stream's name",
    },
  },
  YOUTUBE: {
    rootURL: 'https://www.youtube.com',
  },
};

module.exports = config;
