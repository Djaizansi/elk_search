const Twit = require("twit");
const fs = require('fs/promises');
require("dotenv").config();
const elasticbulk = require('elasticbulk');
const twitter = [];

// Search for Tweets within the past seven days
// https://developer.twitter.com/en/docs/twitter-api/tweets/search/quick-start/recent-search

const needle = require('needle');
const { response } = require("express");

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token = process.env.BEARER_TOKEN;

const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

async function getRequest(nextToken = null) {

    // Edit query parameters below
    // specify a search query, and any additional fields that are required
    // by default, only the Tweet ID and text fields are returned
    const params = {
        'query': '(#covid19 OR #COVID19 OR #covid-19) lang:fr -is:retweet -has:links',
        'max_results': 100
    }
    if(nextToken !== null){
      params.next_token = nextToken;
    }

    const res = await needle('get', endpointUrl, params, {
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body) {
        return res.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}

const getNextToken = async (token) => {
  const data = await getRequest(token);
  return data;
}

(async () => {

    try {
        // Make request
        const response = await getRequest();
        let token = await getNextToken(response.meta.next_token);
        let i = 0;
        let newData = "";
        do {
          token = await getNextToken(token.meta.next_token);
          newData += JSON.stringify(token.data);
          i = i+1;
        }while(i < 2);
        
        console.log(newData);
    } catch (e) {
        console.log(e);
        process.exit(-1);
    }
    process.exit();
})();

/* const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
});

const getAllData = (_) => {
  T.get('search/tweets', { q: '#covid19 OR #COVID19 OR #covid-19',lang: "fr", tweet_mode: "extended" }, function getData(err, data, response) {
    data.statuses.forEach((item) => {
      twitter.push({
        "id": item.id,
        "tweet" : item.retweeted_status !== undefined ? item.retweeted_status.full_text : item.text,
        "created_at": item.created_at,
        "user": item.user.screen_name
      });
    });
    console.log(twitter);
  });
}

getAllData(); */

/* T.get('search/tweets', { q: '#covid19 OR #COVID19 OR #covid-19',lang: "fr" }, function(err, data, response) {
  console.log(data); */
  
  /* data.statuses.forEach((item) => {
    twitter.push({
      "tweet" : item.text,
      "created_at": item.created_at,
      "user": item.user.screen_name
    });
  });
  console.log(twitter.length);
  elasticbulk.import(twitter,{
    index: 'logs_server_elk_esgi',
    type: 'TP',
    host: 'http://localhost:9200',
  }); */
  //fs.writeFile('twitter.json', JSON.stringify(data)).then((_) => console.log('Data saved'));
/* }); */