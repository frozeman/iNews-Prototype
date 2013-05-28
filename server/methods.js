// DICTIONARY
var removeWords = [',',"'",'"','<','>','/','|',':','?','(',')','{','}','[',']','\\','/','+','-','_','*','^','#','@','!','~',
                   'the','they','but','what','who','when','where','and','for','is','by','at','to','with','some','or','she','he','it','was','were','will','send','gain','find',
                   'das','der','die','es','uns','was','wo','wie','wann','welcher','und','noch','für','ist','schon','von','zum','bis','einige','oder','wird','werden','sein','kann','möchte','findet'];

Meteor.methods({
    search: function (searchValues) {
        this.unblock(); // this method won't block others
        var Future = Npm.require('fibers/future'),
            Fiber = Npm.require('fibers'),
            future = new Future(); // defer method execution

        var send = [],
            clusters = [],
            missingClusters = [];

        searchValues = _.trim(_.clean(searchValues));
        var clusterNames = searchValues.split(' ');

        // remove duplicate words
        clusterNames = _.uniq(clusterNames);

        // remove words which are in the "removeWords" dictionary
        clusterNames = _.filter(clusterNames,function(clusterName) {
            return (!_.contains(removeWords, clusterName.toLowerCase()));
        });

        // save them back to the searchValues string
        searchValues = _.capitalize(clusterNames.join(' '));


        // -> LOOK FOR the topics in the CLUSTERS
        Q.allResolved(_.map(clusterNames, function(clusterName){

            // FIND MATCHING CLUSTERS
            return Search.hasCluster(clusterName)

            // -> if not CREATE A REMOTE SEARCH and CLUSTER NEW RESULTS
            .fail(function(clusterName){
                clusterName = clusterName.valueOf();
                clusterName = clusterName.name;

                if(clusterName) {
                    missingClusters.push(clusterName);

                    Fiber(function() {

                        if(Queue.find({getCluster: clusterName}).count() === 0) {
                            Queue.insert({
                                getCluster: clusterName,
                                timestamp: moment().unix()
                            });

                            runQueue(false);
                        }

                    }).run();
                }
                // return failed promise to Search.getArticleIds()
                return clusterName;
            });

        }))
        // GET ARTICLES from already FOUND CLUSTERS
        .then(Search.getArticleIds)
        .done(function(results) {
            send = [results,missingClusters, searchValues];
            future = (future.resolver())();
        });


        // return the method, when finished with async stuff
        Future.wait(future);
        return send;
    }
});
