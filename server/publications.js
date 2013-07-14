/*
* Publications and Acces rules
*/

// publish only searched articles
Meteor.publish("currentNews", function (articleIds) {

    var limitTo = 50,
        topNewsImportance = 500,
        onlyArticlesFrom = moment().subtract('days',5).unix(), // 10 days to now()
        searchValueRegex = (_.isString(articleIds[0])) ? {'title': {$regex : '.*(?:'+articleIds[0].split(' ').join('|')+').*', $options: 'i'}} : {};

    if(articleIds === 'none')
        return this.stop();
    // GET TOP NEWS
    else if(_.contains(articleIds, 'topNews'))
        return News.find({$and: [{'metaData.pubDate': {$gt: onlyArticlesFrom}}, {'clusterData.importance': {$gt: topNewsImportance}}]}, {limit: limitTo});

    // GET SPECIFIC ARTICLES from CLUSTERS by ID (use the first value as search array)
    else if(_.isArray(articleIds))
        return News.find({$and: [{'metaData.pubDate': {$gt: onlyArticlesFrom}}, {$or: [searchValueRegex, {'_id': {$in: articleIds}}]}]}, {limit: limitTo});

});

// publish the current article
Meteor.publish("currentArticle", function (articleId) {

    // GET SPECIFIC ARTICLE by ID
    return News.find({'_id': articleId});

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