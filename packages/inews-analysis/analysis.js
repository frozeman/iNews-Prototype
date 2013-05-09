

(function(){

    Analysis = (function(){

        // PRIVATE
        var Calais = Npm.require('calais').Calais;


        /*
        * Looks for new articles, stores them in the database and clusters them using OpenCalais
        */
        function CreateNewCluster (clusterName) {
            this.clusterName = _.trim(clusterName);

            /*
            * Constructor
            */
            this.createNewCluster = (function(clusterName){

                console.log('-----------------------------');
                console.log('Started to get a news cluster');


                // search for news
                return new GetNews(clusterName)
                            .then(this.clusterNews)
                            .done();


            })(this.clusterName);
            /*
            * Send articles to OpenCalais and use the properies to create new clusters and sort them in existing ones.
            */
            this.clusterNews = function(articlesPromise) {
                var deferred = Q.defer(),
                    normalizedArticles = articlesPromise.valueOf();

                // Send to open calaise
                // calais: new Calais('q7k7j6nw9s3cedq2f3jt4bw3')

                // use the returned data to create new clusters and fit into existing ones

                return deferred.promise;
            };
        }


        /*
        * Looks for new articles, stores them in the database and clusters them using OpenCalais
        */
        function UpdateClusters (clusterNames) {
            this.clusterNames = clusterNames;

            /*
            * Constructor
            */
            this.updateClusters = (function(clusterNames){

                console.log('-----------------------------');
                console.log('Started to update clusters');


                // get all cluster names and their dictionaries

                // fetch news results -> new GetNews(this.clusterName)

                // fit them in the database


                // search for news
                // return new GetNews(this.clusterName)
                //             .then(this.clusterNews)
                //             .done();


            })(this.clusterNames);
        }

        /*
        * Fetches Data from NewsCreed
        */
        function GetNews(query) {
            this.key         = 'c4bcc3f7c9bf9ec159f51da0a86ca658'; // NewsCreed Test Key, max 10 000 queries per day
            this.apiUrl      = 'http://api.newscred.com/articles';

            /*
            * Constructor
            */
            this.getNews = (function(query){

                // search for news
                return this.fetchNews()
                    .then(this.checkForDuplicates)
                    .then(this.normalizeNews)
                    .done();

            })(query);
            this.fetchNews = function(query) {
                var deferred = Q.defer(),
                    parameter = {
                        access_key: this.key,
                        format: 'json',
                        query: query,
                        get_topics: 'False'
                    };

                console.log('Fetch new content for "'+query+'" from '+this.apiUrl);

                var result = Meteor.http.get(this.apiUrl, {params: parameter, timeout: 10000});
                console.log('Http request send');

                if (result.statusCode === 200) {
                    // var respJson = JSON.parse(result.content);
                    console.log('Got some new content');
                    console.log(result.data);

                    deferred.resolve(result.data);

                } else {
                    console.log('Didn\'t work');
                    // put it in the que for a later try
                    deferred.reject(result.error);
                }

                return deferred.promise;
            };
            /*
            * Check if articles and title already exits
            */
            this.checkNews = function(articlesPromise){
                var deferred = Q.defer(),
                    articles = articlesPromise.valueOf();

                // CHECK IF ARTICLE TITLE AND TIME ALREADY EXISTS IN THE DATABASE

                return deferred.promise;
            };
            /*
            * Normalize the news so they fir the iNews Database
            */
            this.normalizeNews = function(articlesPromise){
                var deferred = Q.defer(),
                    articles = articlesPromise.valueOf();

                // change the news to the inews db format

                return deferred.promise;
            };
        }

        // PUBLIC
        return {
            createNewCluster: CreateNewCluster,
            updateClusters: UpdateClusters
        };
    }());


}).call(this);