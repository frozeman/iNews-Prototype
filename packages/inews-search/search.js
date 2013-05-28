

(function(){

    Search = (function(){

        // PRIVATE
        var Fiber = Npm.require('fibers');

        // PUBLIC
        return {
            /*
            * Checks for clusters which contain the 'clusterName' (topic) in their 'dictionary' field.
            *
            * @param string clusterName     the words to look for in clusters
            * @param string articleId       the id of an article which to pass trough
            */
            hasCluster: function(clusterName, articleId, calaisResult){
                var deferred = Q.defer(),
                    clusters = [],
                    clusterNames = clusterName.split(' ');

                if(clusterName) {
                    console.log('looking for cluster of "'+ clusterName +'"');

                    Fiber(function(){
                        clusters = _.map(clusterNames, function(clusterName, key, list){
                            return Clusters.find({'dictionary.name': new RegExp('.*' + clusterName + '.*','i')}).fetch();
                        });
                        clusters = _.flatten(clusters);

                        if(_.isArray(clusters) && clusters.length > 0) {
                            console.log('Found "'+clusters.length+'" clusters');
                            deferred.resolve({name: clusterName, clusters: clusters, articleId: articleId, result: calaisResult});
                        } else {
                            console.log('Couldn\'t find any clusters for "'+clusterName+'"');
                            deferred.reject({name: clusterName, articleId: articleId, result: calaisResult});
                        }
                        
                    }).run();

                } else
                    deferred.reject({name: clusterName, articleId: articleId, result: calaisResult});


                return deferred.promise;
            },
            /*
            * Gets article ids which are in all given clusters
            */
            getArticleIds: function(clusterPromises) {
                var deferred = Q.defer(),
                    articleIds = [],
                    clustersAndResults = clusterPromises.valueOf();

                var clustersArticlesIds = _.map(clustersAndResults,function(clusterAndResults, index){
                    clusterAndResults = clusterAndResults.valueOf();

                    if(clusterAndResults.clusters)
                        return _.flatten(_.map(clusterAndResults.clusters,function(cluster, index){
                            return _.pluck(cluster.articles, 'id');
                        }));
                    else
                        return false;

                });
                // clustersArticlesIds = _.flatten(clustersArticlesIds);


                // find the articles which are in all clusters
                if(clustersArticlesIds.length > 0) {
                    articleIds = _.intersection.apply(_, _.compact(clustersArticlesIds));
                }

                console.log('Found "'+articleIds.length+'" article IDs in clusters');

                // return article ids, even if they are empty
                deferred.resolve(articleIds);

                return deferred.promise;
            }
            // calais: new Calais('q7k7j6nw9s3cedq2f3jt4bw3')

        };
    }());


}).call(this);