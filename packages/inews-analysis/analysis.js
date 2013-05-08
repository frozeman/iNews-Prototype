

(function(){

    Analysis = (function(){

        // PRIVATE
        var Calais = Npm.require('calais').Calais;


        /*
        * Looks for new articles, stores them in the database and clusters them using OpenCalais
        */
        function createNewCluster (clusterName) {
            this.clusterName = _.trim(clusterName);
            this.key         = 'c4bcc3f7c9bf9ec159f51da0a86ca658'; // NewsCreed Test Key, max 10 000 queries per day
            this.apiUrl      = 'http://api.newscred.com/articles/';

            this.create = function(clusterName){

                console.log('-----------------------------');
                console.log('Started to get a news cluster');

                // search for news
                this.getNews();


                // parse news


                // cluster news with opencalais
            };
            this.getNews = function() {
                var deferred = Q.defer(),
                    parameter = {
                        access_key: this.key,
                        format: 'json',
                        query: this.clusterName,
                        get_topics: 'False'
                    };

                console.log('Fetch new content for "'+this.clusterName+'" from '+this.apiUrl);

                console.log(Meteor.http.get(this.apiUrl, {params: parameter, timeout: 5000}));

                var result = Meteor.http.get(this.apiUrl, {params: parameter, timeout: 5000});
                console.log('Http request send');
                console.log(result);

                if (result.statusCode === 200) {
                    // var respJson = JSON.parse(result.content);
                    console.log('Got some new content');
                    console.log(data);

                    deferred.resolve();

                } else {
                    console.log('Didn\'t work');
                    deferred.reject(result.error);
                }

                return deferred.promise;
            };
        }

        // PUBLIC
        return {
            createNewCluster: createNewCluster
            // calais: new Calais('q7k7j6nw9s3cedq2f3jt4bw3')

        };
    }());


}).call(this);