// Retrieve
var MongoClient = require('mongodb').MongoClient,
    express = require('express');
var app = express(),
    collection;


// Connect to the db
MongoClient.connect("mongodb://juliankrispel@yahoo.de:jkrispel2@linus.mongohq.com:10008/app15978545", function(err, db) {
    // Return error if we couldn't connect
    if(err) { return console.dir(err); }

    // Create a mongo collection
    collection = db.collection('julians_finance');

    // Tell App to use bodyParser
    app.use(express.bodyParser());
    app.engine('html', require('ejs').renderFile);
    app.set('title', 'Finance');
    app.use(express.static(__dirname + '/public'));

    // Define Roots
    app.get('/', get);
    app.post('/', post);

    // Start express app
    app.listen(3000);
});

function get(req, res){

    queryMongo(req.query, function(data){
        if(req.xhr)
            presentJSON(data, res);
        else
            presentHTML(data, res);
    });

}

function post(req, res){

    collection.insert(req.body, function(){
        if(!req.xhr)
            queryMongo(req.query, function(data){
                presentHTML(data, res);
            });
        else
            res.send(200);
    });
}

// If the request is a XML HTTP request
function presentJSON(data, res){
    // Send json response
    res.json(203);
}

// Present View
function presentHTML(data, res){
    res.render('index.html', { data: data });
}

function queryMongo(query, callback){
    collection.find(query).toArray(function(err, results){
        callback(results);
    });
}
