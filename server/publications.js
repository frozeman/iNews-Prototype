/*
* Publications and Acces rules
*/

// publish only searched articles
Meteor.publish("currentNews", function (articleIds) {

    var onlyArticlesFrom = moment().subtract('days',10).unix(); // 10 days to now()

    // GET TOP NEWS
    if(_.contains(articleIds, 'topNews'))
        return News.find({$and: [{'metaData.pubDate': {$gt: onlyArticlesFrom}}, {$or: [{'clusterData.importance': {$gt: 800}},{_id: {$in: articleIds}}]}]}, {reactive: false});

    // GET SPECIFIC ARTICLES from CLUSTERS by ID
    else if(_.isArray(articleIds))
        return News.find({$and: [{'metaData.pubDate': {$gt: onlyArticlesFrom}},{'_id': {$in: articleIds}}]}, {reactive: false});

    // GET ARTICLES by SEARCHING the TITLE
    else if(_.isString(articleIds))
        return News.find({$and: [{'metaData.pubDate': {$gt: onlyArticlesFrom}},{'title': {$regex : '.*(?:'+articleIds.split(' ').join('|')+').*', $options: 'i'}}]}, {reactive: false});
});

// publish current clusters
Meteor.publish("currentClusters", function () {
    return Clusters.find({});
});

// publish Queues
Meteor.publish("queue", function () {
    return Queue.find({});
});

// Clusters.allow({
//   update: function () {
//     return true;
//   }
// });



// News.allow({
//   insert: function (userId, party) {
//     return false;
//   }
// });
// // client: this will fail
// var party = { ... };
// Parties.insert(party);