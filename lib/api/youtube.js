const fetch = require('node-fetch');
const YOUTUBE = require('../config').YOUTUBE;

// verify youtube usernam
const verifyYoutubeChannelID = (channelID, apiKey) => {
  const URL = `${YOUTUBE.apiURL}/channels?key=${apiKey}&id=${
    channelID
  }&part=id`;

  return fetch(URL)
    .then(res => res.json())
    .then(json => json.pageInfo.totalResults > 0);
};

// get list of subscribers
const getSubscriptionList = (channelID, apiKey) => {
  const URL = `${
    YOUTUBE.apiURL
  }/subscriptions?part=snippet%2CcontentDetails&channelId=${channelID}&key=${
    apiKey
  }`;

  return fetch(URL)
    .then(res => res.json())
    .then(
      json =>
        json.pageInfo.totalResults < 1
          ? [YOUTUBE.defaultChannelChoice]
          : createSubscriptionList(json.items),
    );
};

const createSubscriptionList = channels =>
  channels.map(ch => ({
    name: ch.snippet.title,
    value: ch.snippet.resourceId.channelId,
    short: ch.snippet.title,
  }));

// get list of videos
const getChannelVideos = (channelID, apiKey) => {
  const URL = `${YOUTUBE.apiURL}/search?order=date&part=snippet&channelId=${
    channelID
  }&maxResults=${YOUTUBE.maxResults}&key=${apiKey}`;

  return fetch(URL)
    .then(res => res.json())
    .then(
      json =>
        json.pageInfo.totalResults < 1
          ? [YOUTUBE.defaultVideoChoice]
          : createVideoList(json.items),
    );
};

const createVideoList = videos =>
  videos.map(v => ({
    name: v.snippet.title,
    value: v.id.videoId,
    short: v.snippet.title,
  }));

module.exports = {
  getChannelVideos,
  getSubscriptionList,
  verifyYoutubeChannelID,
};
