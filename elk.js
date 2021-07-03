//require the Elasticsearch librray
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    //we are using docker-compose on windows with toolbox, if it's not the case for you, please put 'localhost' instead of ip adress
    hosts: ['http://localhost:9200']
});

client.ping({
    requestTimeout: 30000,
}, function(error) {
    if (error) {
        console.error('Elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});

client.indices.create({
    index: 'logs_server_elk_esgi'
}, function(error, response, status) {
    if (error) {
        console.log(error);
    } else {
        console.log("created a new index", response);
    }
});

const datas = require('./twitter.json');
var bulk = [];
datas.forEach((data) => {
    bulk.push({index:{
        _index:"thirdgroupe",
        _type:"datas_list",
        }
    });
    bulk.push(data);
})
//perform bulk indexing of the data passed
client.bulk({body:bulk}, function( err, response  ){
    if( err ){
        console.log("Failed Bulk operation".red, err)
    } else {
        console.log("Successfully imported %s".green, datas.length);
    }
});