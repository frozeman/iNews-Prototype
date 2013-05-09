Meteor.methods({
    search: function (searchValue) {
        this.unblock(); // this method won't block others
        var Future = Npm.require('fibers/future'),
            Fiber = Npm.require('fibers'),
            future = new Future(); // defer method execution

        var send = null,
            clusterNames = searchValue.split(' '),
            clusters = [],
            missingClusters = [];


        // -> LOOK FOR the topics in the CLUSTERS
        Q.allResolved(_.map(clusterNames, function(clusterName){

            // FIND MATCHING CLUSTERS
            return Search.hasCluster(clusterName)

            // -> if not CREATE A REMOTE SEARCH and CLUSTER NEW RESULTS
            .fail(function(clusterName){
                clusterName = clusterName.valueOf();
                if(clusterName) {
                    missingClusters.push(clusterName);

                    Fiber(function() {
                        new Analysis.CreateNewCluster(clusterName);
                    }).run();
                }
                // return failed promise to Search.getArticleIds()
                return clusterName;
            });

        }))
        // GET ARTICLES from already FOUND CLUSTERS
        .then(Search.getArticleIds)
        .done(function(results) {
            send = [results,missingClusters];
            future = (future.resolver())();
        });


        // return the method, when finished with async stuff
        Future.wait(future);
        return send;
    }
});
