const fetch = require('node-fetch');
const TWITCH = require('./config').TWITCH;
const options = { headers: TWITCH.headers };

// list of 100 followed channels sorted by last broadcast
const getFollowedChannels = userId => {
  const URL = `${TWITCH.rootURL}/users/${
    userId
  }/follows/channels?limit=100&sortby=last_broadcast`;

  return fetch(URL, options)
    .then(res => res.json())
    .then(json => {
      if (json._total < 0) {
        return Promise.resolve([TWITCH.defaultChoice]);
      }

      return Promise.resolve(json.follows);
    });
};

const createLiveFollowedChannelsURL = channels => {
  const channelIds = channels.map(c => c.channel._id).join(',');
  return `${TWITCH.rootURL}/streams/?channel=${channelIds}`;
};

// list of followed channels that are live
const getLiveFollowedChannels = liveURL => {
  return fetch(liveURL, options)
    .then(res => res.json())
    .then(liveJson => {
      if (liveJson._total < 0) {
        return Promise.resolve([TWITCH.defaultChoice]);
      }

      // console.log('liveJson', JSON.stringify(liveJson, null, 2));

      // let liveChannels = _mapChannelsField(liveJson.streams, 'display_name');
      let liveChannels = liveJson.streams.map(s => ({
        name: `[${s.viewers}] ${s.channel.display_name} - ${s.channel.game}`,
        value: s.channel.url.split('/').slice(-1)[0],
        short: s.channel.display_name,
      }));
      liveChannels.unshift(TWITCH.defaultChoice);
      return Promise.resolve(liveChannels);
    });
};

const _mapChannelsField = (channels, field) =>
  channels.map(c => c.channel[field]);

module.exports = {
  createLiveFollowedChannelsURL,
  getFollowedChannels,
  getLiveFollowedChannels,
};
