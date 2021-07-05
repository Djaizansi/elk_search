const Twit = require("twit");
const fs = require('fs/promises');
require("dotenv").config();
const elasticbulk = require('elasticbulk');
const twitter = [];

const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
});

const getAllData = (_) => {
  T.get('search/tweets', { q: '#covid19 OR #COVID19 OR #covid-19',lang: "fr", tweet_mode: "extended", count:100 }, function getData(err, data, response) {
    data.statuses.forEach((item) => {
      twitter.push({
        "id": item.id,
        "tweet" : item.retweeted_status !== undefined ? item.retweeted_status.full_text : item.text,
        "created_at": item.created_at,
        "user": item.user.screen_name
      });
    });
    elasticbulk.import(twitter,{
      index: 'logs_server_elk_esgi',
      type: 'TP',
      host: 'http://localhost:9200',
    });
  });
}

getAllData();