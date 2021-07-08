const stopword = require('stopword');

const Twit = require("twit");
const fs = require('fs');
require("dotenv").config();
const elasticbulk = require('elasticbulk');
const twitter = [];

const wordEmpty = fs.readFileSync('wordEmpty.txt');

const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
});

const getAllData = (_) => {
  T.get('search/tweets', { q: '#Vaccin OR #Covid19 OR #VACCIN OR #COVID19 OR #vaccination #vaccins #vaccinationObligatoire OR #ObligationVaccination' ,lang: "fr", tweet_mode: "extended", count:1000 }, function getData(err, data, response) {
    data.statuses.forEach((item) => {
      const oldString = (item.retweeted_status !== undefined ? item.retweeted_status.full_text : item.full_text).split(' ');
      twitter.push({
        "tweet" : (stopword.removeStopwords(oldString, wordEmpty.toString().split('\n'))).join(' '),
        "id": item.id,
        "created_at": item.created_at,
        "user": item.user.screen_name
      });
    });
    console.log(twitter);
    elasticbulk.import(twitter,{
      index: 'logs_server_elk_esgi',
      type: 'TP',
      host: 'http://localhost:9200',
    });
  });
}

getAllData();