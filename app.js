const Twit = require("twit");
const fs = require('fs/promises');
require("dotenv").config();
const elasticbulk = require('elasticbulk');

const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
});

T.get('search/tweets', { q: '#EURO2020', count: 100 }, function(err, data, response) {
  fs.writeFile('twitter.json', JSON.stringify(data)).then((_) => console.log('Data saved'));
});

/* var stream = T.stream("statuses/filter", { 
  track: "#EURO2020",
});

stream.on("tweet", function (tweet) {
  console.log(tweet);
}); */
