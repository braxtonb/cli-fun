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
    },
    defaultChoice: {
      name: "Other: type in the stream's name",
      value: "Other: type in the stream's name",
      short: "Other: type in the stream's name",
    },
    followedLimit: 100,
    invalidLogin: 'invalid login name',
  },
  YOUTUBE: {
    rootURL: 'https://www.youtube.com',
    apiURL: 'https://www.googleapis.com/youtube/v3',
    maxResults: 25,
    invalidChannelID: 'invalid channel ID',
    defaultChannelChoice: {
      name: 'Recommended: Funhaus',
      value: 'put funhaus channel id here',
      short: 'Funhaus',
    },
    defaultVideoChoice: {
      name:
        'Recommended: This company pays kids to do their math homework | Mohamad Jebara',
      value: 'wmMrZyVANUo',
      short:
        'This company pays kids to do their math homework | Mohamad Jebara',
    },
  },
};

module.exports = config;
