/*
* Create clusters and retrieve news from sources
*
* All fields with TEMPORARY are not ready yet
*
* TODO
* - really analyse articles
* - get more images for articles, and save also articles without images
*/

(function(){

    Analysis = (function(){

        // PRIVATE
        var Calais = Npm.require('calais').Calais,
            Fiber = Npm.require('fibers');


        /*
        * Looks for new articles, stores them in the database and clusters them using OpenCalais
        */
        var FindNewClusters = function(clusterName) {
            var _this = this;
            this.clusterName = _.trim(clusterName);

            /*
            * Constructor
            */
            this.findNewClusters = function(){

                console.log('-----------------------------');
                console.log('Started to get a news cluster for: "' + this.clusterName + '"');

                var getNews = new GetNews(this.clusterName);

                // search for news
                return getNews.get()
                        .then(this.addArticlesToClusters)
                        .then(function(promise){
                            var deferred = Q.defer();

                            console.log('Succesfully created clusters');
                            console.log('----------------------------')

                            deferred.resolve(promise.valueOf());
                            return deferred.promise;

                        }, function(promise){
                            var deferred = Q.defer();

                            console.log('Couldn\'t create Clusters for "'+ _this.clusterName + '"');

                            deferred.reject(promise.valueOf());
                            return deferred.promise;
                        });

            };
            /*
            * Add article to clusters, with the help of the calais results
            */
            this.addArticlesToClusters = function(articlesAndResultsPromise) {
                var deferred = Q.defer(),
                    clusters = [],
                    usedClusterNames = [],
                    articlesAndResults = articlesAndResultsPromise.valueOf();

                console.log('Add "'+articlesAndResults.length+'" articles to clusters');

                // goe through all articles and cluster them
                Q.allResolved(_.map(articlesAndResults, function(articleAndResults){
                    var deferred = Q.defer(),
                        articleId = articleAndResults.article._id;


                    // go trough each result and add or create new cluster
                    Q.allResolved(_.map(articleAndResults.results, function(result){
                        var deferred = Q.defer();

                        if(result.name && !_.contains(usedClusterNames, result.name)) {

                            // console.log('----------------');
                            // console.log(result);

                            // add to the used list, to prevent double entries in clusters
                            usedClusterNames.push(result.name);

                            if(( result._typeGroup === 'socialTag') && //result._typeGroup === 'entities' ||
                               result._type !== 'URL') {

                                // console.log('----------------');

                                // ADD to NEW or existing CLUSTER
                                Search.hasCluster(result.name, articleId, result)
                                .then(_this.addToCluster, _this.createCluster)
                                .then(function(clusterPromise){
                                    cluster = clusterPromise.valueOf();
                                    clusters.push(cluster);
                                }, function(clusterPromise){
                                    clusterPromise = clusterPromise.valueOf();
                                    console.log('Couldn\'t create Cluster for "'+clusterPromise+'"');
                                })
                                .done();

                            }

                            deferred.resolve(clusters);

                        } else
                            deferred.reject();

                        return deferred.promise;

                    })).done(function(promises){
                       deferred.resolve(clusters);
                    });


                    return deferred.promise;

                })).done(function(promises){
                   deferred.resolve(clusters);
                });


                return deferred.promise;
            };
            /*
            * Create a cluster with data from calais
            */
            this.createCluster = function(clusterPromise) {
                var deferred = Q.defer(),
                    cluster = clusterPromise.valueOf();

                Fiber(function(){
                    if(!_.isEmpty(cluster.name)) {
                        var dictionary = _.map(cluster.name.split(' '),function(name){
                            return {name: name, score: 1};
                        });

                        var clusterDocument = {
                            name: cluster.name,
                            dictionary: dictionary,
                            articles: [
                                {id: cluster.articleId, score: 1}
                            ]
                        };

                        // -> SAVE CLUSTER to the DB (only if cluster doesn't exist)
                        if(Clusters.find({name: cluster.name}).count() === 0) {
                            var clusterId = Clusters.insert(clusterDocument);

                            console.log('Created cluster "'+cluster.name+'" with ID "'+clusterId+'"');

                            // add cluster to the Queue for periodical updating
                            Queue.insert({
                                updateClusterWithId: clusterId,
                                timestamp: moment().unix()
                            });
                        }


                        // returns the cluster document
                        deferred.resolve(clusterDocument);

                    } else {
                        deferred.reject(cluster.name);
                    }

                }).run();


                return deferred.promise;
            };
            /*
            * Add article and words to cluster
            */
            this.addToCluster = function(clusterPromise) {
                var deferred = Q.defer(),
                    returnedClusterIds = [],
                    clustersAndResults = clusterPromise.valueOf();

                // console.log('Found: ');
                // console.log(clusters.clusters);

                // add the calais result and articles to all found clusters
                Q.allResolved(_.map(clustersAndResults.clusters, function(cluster){
                    var deferred = Q.defer();

                    Fiber(function(){
                        // get the newest version of the current cluster
                        fetchedCluster = Clusters.findOne({_id: cluster._id});

                        // console.log('# # #');
                        // console.log(clustersAndResults.articleId);
                        // console.log(fetchedCluster.articles)
                        // console.log(_.find(fetchedCluster.articles, function(article){ return (article.id === clustersAndResults.articleId); }));

                        // add/update the article to the cluster
                        if(_.find(fetchedCluster.articles, function(article){ return (article.id === clustersAndResults.articleId); })) {
                            // increase the articles score in the cluster
                            console.log('Increase "'+clustersAndResults.articleId+'" in cluster "'+cluster.name+'"');
                            Clusters.update({
                                    $and: [{_id: cluster._id}, {'articles.id': clustersAndResults.articleId}]
                                },
                                {
                                    $inc: {'articles.$.score': 1}
                                });

                            // TODO
                            // -> add article id to cluster and add new dictionaries from instances
                            // add to cluster or create new one use also "relevance" and "instances"
                            // socialTags are like categories


                        } else {
                            // add article to the cluster
                            console.log('Add "'+clustersAndResults.articleId+'" to cluster "'+cluster.name+'"');
                            Clusters.update({
                                    _id: cluster._id
                                },
                                {
                                    $push: {'articles': {id: clustersAndResults.articleId, score: 1}}
                                });
                        }
                        // returns the cluster document ids
                        returnedClusterIds.push(cluster._id);

                        deferred.resolve();


                    }).run();


                    return deferred.promise;

                })).done(function(){
                    // returns the cluster document ids
                    deferred.resolve(returnedClusterIds);
                });


                return deferred.promise;
            };


            // RUN CONSTRUCTOR
            return this.findNewClusters();
        };


        /*
        * Looks for new articles, stores them in the database and clusters them using OpenCalais
        */
        var UpdateCluster = function(clusterId) {
            this.clusterId = clusterId;

            /*
            * Constructor
            */
            this.updateCluster = function(){

                console.log('-----------------------------');
                console.log('Started to update cluster with ID "'+this.clusterId+'"');

                var cluster = Clusters.findOne({_id: this.clusterId});
                if(!_.isEmpty(cluster)) {

                    // search for news
                    return new FindNewClusters(cluster.name);
                } else {
                    var deferred = Q.defer();
                    deferred.reject();
                    return deferred.promise;
                }
             
            };

            return this.updateCluster();
        };

        /*
        * Fetches Data from NewsCreed
        */
        var GetNews = function(query) {
            var _this = this;
            this.key                     = 'c4bcc3f7c9bf9ec159f51da0a86ca658'; // NewsCreed Test Key, max 10 000 queries per day
            this.apiUrl                  = 'http://api.newscred.com';
            this.query                   = _.trim(query),
            this.numberOfArticlesToFetch = 50;

            /*
            * Start fetching news
            */
            this.get = function(){

                // console.log('Get News for "'+this.query+'"');

                // search for news
                return this.fetchNews(this.query)
                    .then(this.checkForDuplicates)
                    .then(this.normalizeNews)
                    .then(this.getImages)
                    .then(this.startToAnalyzeArticles)
                    .then(this.saveArticles, function(results){
                        console.log('Couldn\'t fetch news for "'+ _this.query + '"');
                        // console.log(results);
                        return results;
                    });

            };
            this.getTimestamp = function(dateString){
                return moment(dateString,'YYYY-MM-DD HH:mm:ss').unix();
            };
            /*
            * get news from sources
            */
            this.fetchNews = function(query) {
                var deferred = Q.defer(),
                    parameter = {
                        access_key: this.key,
                        format: 'json',
                        query: query,
                        pagesize: this.numberOfArticlesToFetch,
                        get_topics: 'False'
                    };

                // quit if query is empty
                if(!_.isEmpty(this.query)) {

                    console.log('Fetch new content for "'+query+'" from '+this.apiUrl);
                    try {
                        var result = Meteor.http.get(this.apiUrl + '/articles', {params: parameter, timeout: 10000});

                        if (result.statusCode === 200) {
                            // console.log('Got some new content');
                            // console.log(result.data);
                            deferred.resolve(result.data);

                        } else {
                            console.log('Error: Couldn\'t connect to ' + this.apiUrl + '/articles');
                            // put it in the que for a later try
                            deferred.reject(result.error);
                        }

                    } catch(error) {
                        deferred.reject(error);
                    }

                } else {
                    console.log('Couldn\'t fetch news, query is "'+this.query+'"!');
                    deferred.reject();
                }


                return deferred.promise;
            };
            /*
            * Check if articles and title already exits
            */
            this.checkForDuplicates = function(articlesPromise){
                var deferred = Q.defer(),
                    filteredArticles = [],
                    articles = articlesPromise.valueOf();

                console.log('check for duplicates');

                // if articles were found
                if(articles.num_found > 0) {
                    Fiber(function() {

                        // CHECK IF ARTICLE TITLE AND TIME ALREADY EXISTS IN THE DATABASE
                        filteredArticles = _.filter(articles.article_set, function(article){

                            if(article.published_at) {
                                var articletimestamp = _this.getTimestamp(article.published_at);
                                // console.log(article.title);
                                // console.log(article.published_at);
                                // console.log(articletimestamp);
                                return (News.find({$and: [{title: article.title},{'metaData.pubDate': articletimestamp}]}).fetch().length === 0) ? true : false;

                            } else
                                return false;

                        });

                        // remove duplicates
                        filteredArticles = _.uniq(filteredArticles,true,function(item,key,filteredArticles){
                            return item.published_at;
                        });

                        // console.log(filteredArticles.length);

                        if(articles.length !== 0)
                            deferred.resolve(filteredArticles);
                        else
                            deferred.reject(filteredArticles);

                    }).run();
                } else
                    deferred.reject(filteredArticles);

                return deferred.promise;
            };
            /*
            * Normalize the news so they fit in the iNews Database
            */
            this.normalizeNews = function(articlesPromise){
                var deferred = Q.defer(),
                    articles = articlesPromise.valueOf(),
                    normalizedArticles = [];

                console.log('start to normalize');

                _.each(articles,function(article){
                    // console.log('*****');
                    // console.log(article);

                    // get author
                    var author = (article.author_set && article.author_set.length > 0) ? {
                        name: _.str.capitalize(article.author_set[0].first_name) + ' ' + _.str.capitalize(article.author_set[0].last_name),
                        url: null
                    } : null;

                    // get images
                    var images = (article.thumbnail) ? [
                        article.thumbnail.original_image
                    ] : [];

                    normalizedArticles.push({
                        _id: article.guid,
                        title: article.title,
                        abstract: article.description || '',
                        content: '',
                        metaData: {
                            pubDate: _this.getTimestamp(article.published_at),
                            author: author,
                            source: {
                                id: article.source.name,
                                url: article.link
                            }
                        },
                        // clusterData: {
                        //     topics: [],
                        //     subTopic: null,
                        //     side: null, // 'con' 'pro'
                        //     opinionated: 0, // 1-10
                        //     importance: 0 // 0-n (votes for this article)
                        // },
                        media: {
                            images: images,
                            videos: []
                        }
                    });
                });

                // _.each(normalizedArticles,function(article){
                //     console.log(article.media.images);
                // });


                if(normalizedArticles.length !== 0)
                    deferred.resolve(normalizedArticles);
                else
                    deferred.reject(normalizedArticles);

                return deferred.promise;
            };
            /*
            * Get the images for the articles
            */
            this.getImages = function(articlesPromise){
                var deferred = Q.defer(),
                    articles = articlesPromise.valueOf(),
                    articlesWithImages = articles;

                Q.allResolved(_.map(articles, function(article,key){
                    var deferred = Q.defer();

                    Fiber(function(){
                        var parameter = {
                                access_key: _this.key,
                                format: 'json'
                            };


                        console.log('Get images for "'+article.title+'"');
                        try {
                            var result = Meteor.http.get(_this.apiUrl + '/article/' + article._id + '/images', {params: parameter, timeout: 1000});

                            if (result.statusCode === 200) {
                                // console.log(result.data);

                                if(result.data.image_set && result.data.num_found > 0)


                                var images = {key: key, images: _.map(result.data.image_set, function(image){
                                    return image.urls.large;
                                })};


                                deferred.resolve(images);

                            } else {
                                console.log('Error: Couldn\'t connect to ' + this.apiUrl + '/article/' + article._id + '/images');
                                // put it in the que for a later try
                                deferred.reject(result.error);
                            }
                        } catch(error) {
                            deferred.reject(error);
                        }

                    }).run();

                    return deferred.promise;

                })).done(function(promises){
                    var images = promises.valueOf();
                    // put the images in the articles
                    _.each(images,function(image){
                        articlesWithImages[image.key] = image.images;
                    });

                    // TEMPORARY
                    // remove all articles without images
                    articlesWithImages = _.filter(articlesWithImages,function(article){
                        return (!_.isEmpty(article.media.images));
                    });

                    deferred.resolve(articlesWithImages);
                });


                return deferred.promise;
            };
            /*
            * Analyse articles by sending them to Calais
            */
            this.startToAnalyzeArticles = function(articlesPromise){
                var deferred = Q.defer(),
                    articlesAndResults = [],
                    articles = articlesPromise.valueOf();

                var calais = new Calais('q7k7j6nw9s3cedq2f3jt4bw3',{
                        'outputFormat': 'object',
                        'contentType': 'TEXT/RAW',
                        'calculateRelevanceScore': 'true',
                        'enableMetadataType': 'GenericRelations,SocialTags',
                        'docRDFaccessible': 'true',
                        'allowDistribution': 'true',
                        'allowSearch': 'true'
                    });

                // console.log('save news and create cluster');
                // console.log('Got the following articles:')
                // console.log('- - -')
                // console.log(articles);


                Q.allResolved(_.map(articles, function(article){
                    var deferred = Q.defer();

                    var content = (!_.isEmpty(article.content)) ? article.content : article.abstract;
                        // submittId = _.uniqueId();

                    // console.log(article._id);
                    // console.log(article.title);
                    // console.log(article.media.images);

                    if(content) {
                        calais.set('content', content);

                        // send a request to calais
                        calais.fetch(function(result) {
                            _this.analyzeArticles(article, result)
                                .then(function(articlePromise){
                                    articlesAndResults.push(articlePromise.valueOf());
                                    deferred.resolve();
                                }, function(){
                                    // don't add articles without content, because they can't get clustered
                                    // articlesAndResults.push(articlePromise.valueOf());
                                    deferred.reject();
                                });
                        });

                    } else {
                        // don't add articles without content, because they can't get clustered
                        // articlesAndResults.push({article: article, results: null});
                        deferred.reject();
                    }

                    return deferred.promise;

                })).done(function(promises){
                   deferred.resolve(articlesAndResults);
                });

                return deferred.promise;
            };
            /*
            * Analyse articles
            * DUMMY ANALYSIS
            * in the future all tyhe values will be analysed by seperate libraries
            */
            this.analyzeArticles = function(article, results){
                var deferred = Q.defer();

                // TEMPORARY SIMPLIFIED
                console.log('Analyze article "'+article.title+'"');
                // console.log(results);

                // check if calais returned results
                if(_.isArray(results)) {

                    // find the most relevant subtopic
                    // var mostRelevant = _.max(results, function(result){ return (result.relevance) ? result.relevance : false; });
                    var mostRelevant = _.sortBy(results, function(result){
                            return (result._typeGroup === 'socialTag' && result.importance) ? result.importance : 0;
                        }); // relevance
                    mostRelevant = _.find(mostRelevant, function(result){
                            return (result && result.name && result.name.indexOf('http') === -1);
                        });
                    mostRelevant = (mostRelevant && mostRelevant.name) ? _.capitalize(mostRelevant.name.toLowerCase()) : '';

                    // set the side (TODO analyze)
                    var conOrPro = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
                    conOrPro = (conOrPro == 1) ? 'pro' : 'con';

                    // opinionated
                    var opinionated = Math.floor(Math.random() * (10 - 1 + 1)) + 1;

                    // importance
                    var importance = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;

                    // TODO
                    // add topics (clusters)?
                    // analyse importance by relevance and importance?

                    article.clusterData = {
                        // topics: ['turkey','syria','war','middle east'], // should have clusters?
                        subTopic: mostRelevant,
                        side: conOrPro,
                        opinionated: opinionated, // 1-10
                        importance: importance // 0-n (votes for this article)
                    };

                    deferred.resolve({article: article, results: results});

                } else
                    deferred.reject({article: article, results: null});

                return deferred.promise;
            };
            /*
            * Save articles
            */
            this.saveArticles = function(articlesAndResultsPromise){
                var deferred = Q.defer(),
                    articlesAndResults = articlesAndResultsPromise.valueOf();

                console.log('Save "'+articlesAndResults.length+'" articles');
                // console.log(articlesAndResults);

                // goe through each article and save them to the DB
                Q.allResolved(_.map(articlesAndResults, function(articleAndResults){
                    var deferred = Q.defer(),
                        article = articleAndResults.article;

                    // console.log(article);

                    Fiber(function(){
                        if(News.find({_id: article._id}).count() === 0) {
                            News.insert(article);
                            console.log('Saved article "'+article.title+'"');
                        }

                        deferred.resolve();
                    }).run();


                    return deferred.promise;

                })).done(function(){
                   deferred.resolve(articlesAndResults);
                });

                return deferred.promise;
            };
        };

        // PUBLIC
        return {
            FindNewClusters: FindNewClusters,
            UpdateCluster: UpdateCluster
        };
    }());


}).call(this);