

(function(){

    Search = (function(){

        // PRIVATE
        // var Q = Npm.require('q');

        // PUBLIC
        return {
            /*
            * Checks for clusters which contain the 'clusterName' (topic) in their 'dictionary' field.
            */
            hasCluster: function(clusterName){
                var deferred = Q.defer();

                if(clusterName) {
                    cluster = Cluster.find({'dictionary.name': new RegExp('.*' + clusterName + '.*','i')});

                    if(cluster.count() > 0)
                        deferred.resolve(cluster.fetch());
                    else
                        deferred.reject(clusterName);

                } else
                    deferred.reject(clusterName);


                return deferred.promise;
            },
            /*
            * Gets article ids which share all given clusters
            */
            getArticleIds: function(clusterPromises) {
                var deferred = Q.defer(),
                    articleIds = [],
                    clustersArticlesIds = _.map(clusterPromises,function(clusterPromise, index){
                        if(clusterPromise.valueOf() && clusterPromise.valueOf()[0])
                            return _.pluck(clusterPromise.valueOf()[0].articles, 'id');
                        else
                            return false;
                    });

                // find the articles which are in all clusters
                if(clustersArticlesIds.length > 0) {
                    articleIds = _.intersection.apply(_, _.compact(clustersArticlesIds));
                }

                // return article ids, even if they are empty
                deferred.resolve(articleIds);

                return deferred.promise;
            }
            // calais: new Calais('q7k7j6nw9s3cedq2f3jt4bw3')

        };
    }());


}).call(this);