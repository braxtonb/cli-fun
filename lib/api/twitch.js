const fetch = require('node-fetch');
const TWITCH = require('../config').TWITCH;

// verify twitch login name
const verifyTwitchLoginName = (twitchLoginName, clientID) => {
  const URL = `${TWITCH.rootURL}/users/?login=${twitchLoginName}`;

  const options = {
    headers: {
      ...TWITCH.headers,
      'Client-ID': clientID,
    },
  };

  return fetch(URL, options)
    .then(res => res.json())
    .then(json => {
      if (json._total < 1) {
        return false;
      }
      const user = json.users[0];

      return {
        loginName: user.display_name,
        userId: user._id,
      };
    });
};

// list of 100 followed channels sorted by last broadcast
const getFollowedChannels = (userId, clientID) => {
  const URL = `${TWITCH.rootURL}/users/${userId}/follows/channels?limit=${
    TWITCH.followedLimit
  }&sortby=last_broadcast`;

  const options = {
    headers: {
      ...TWITCH.headers,
      'Client-ID': clientID,
    },
  };

  return fetch(URL, options)
    .then(res => res.json())
    .then(json => {
      if (json._total < 0) {
        return [TWITCH.defaultChoice];
      }

      return json.follows;
    });
};

const createLiveFollowedChannelsURL = channels => {
  const channelIds = channels.map(c => c.channel._id).join(',');
  return `${TWITCH.rootURL}/streams/?channel=${channelIds}`;
};

// list of followed channels that are live
const getLiveFollowedChannels = (liveURL, clientID) => {
  const options = {
    headers: {
      ...TWITCH.headers,
      'Client-ID': clientID,
    },
  };

  return fetch(liveURL, options)
    .then(res => res.json())
    .then(liveJson => {
      if (liveJson._total < 1) {
        return [TWITCH.defaultChoice];
      }

      let liveChannels = liveJson.streams.map(s => ({
        name: `[${s.viewers}] ${s.channel.display_name} - ${s.channel.game}`,
        value: s.channel.url.split('/').slice(-1)[0],
        short: s.channel.display_name,
      }));
      liveChannels.unshift(TWITCH.defaultChoice);
      return liveChannels;
    });
};

module.exports = {
  createLiveFollowedChannelsURL,
  getFollowedChannels,
  getLiveFollowedChannels,
  verifyTwitchLoginName,
};
