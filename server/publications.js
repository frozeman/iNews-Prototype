/*
* Publications and Acces rules
*/

// publish only searched articles
Meteor.publish("currentNews", function (articleIds) {

    var limitTo = 50,
        topNewsImportance = 500,
        onlyArticlesFrom = moment().subtract('days',10).unix(), // 10 days to now()
        searchValueRegex = (_.isString(articleIds[0])) ? {'title': {$regex : '.*(?:'+articleIds[0].split(' ').join('|')+').*', $options: 'i'}} : {};


    // GET TOP NEWS
    if(_.contains(articleIds, 'topNews'))
        return News.find({$and: [{'metaData.pubDate': {$gt: onlyArticlesFrom}}, {'clusterData.importance': {$gt: topNewsImportance}}]}, {limit: limitTo});

    // GET SPECIFIC ARTICLES from CLUSTERS by ID (use the first value as search array)
    else if(_.isArray(articleIds))
        return News.find({$and: [{'metaData.pubDate': {$gt: onlyArticlesFrom}}, {$or: [searchValueRegex, {'_id': {$in: articleIds}}]}]}, {limit: limitTo});

    // GET ARTICLES by SEARCHING the TITLE
    // else if(_.isString(articleIds))
        // return News.find({$and: [{'metaData.pubDate': {$gt: onlyArticlesFrom}},{'title': {$regex : '.*(?:'+articleIds.split(' ').join('|')+').*', $options: 'i'}}]}, {limit: limitTo});
});

// publish current clusters
// Meteor.publish("currentClusters", function () {
//     return Clusters.find({});
// });

// publish Queues
// Meteor.publish("queue", function () {
//     return Queue.find({});
// });


// ALLOW
News.allow({
    update: function (userId, article, key, query) {
        return (query.$inc && query.$inc['clusterData.importance']) ? true : false;
    }
});



// Clusters.allow({
//   update: function () {
//     return true;
//   }
// });




// // client: this will fail
// var party = { ... };
// Parties.insert(party);