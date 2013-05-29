// vars
var messageBoxTimeout;

Meteor.Router.beforeRouting = function() {
    // clear websites title
    changeWebsitesTitle();
};
Meteor.Router.add({
    '/news/*': function(path) { //{as: 'news', to:
        var newsPath = decodeNewsPath(path);

        // only START a SEARCH when the topics changed
        if(RELOAD || (!this.init && NEWSPATH !== newsPath)) { // !this.init fix for HTML push state poly fill
            RELOAD = false;

            console.log('Route to: '+newsPath);

            // show loading circle
            Session.set('showLoadingIcon',true);
            NEWSPATH = newsPath;
            $('#search').val(NEWSPATH);

            console.log('SEARCH STARTED: '+newsPath);


            // -> START SEARCH
            /*
            * Searches in clusters for matches and returns article ids.
            * Then it fetches those articles, PLUS articles matching the search string
            */
            Meteor.call('search', newsPath, function(error, result) {
                var articleIds          = _.compact(result[0]),
                    missingArticleIds   = result[1],
                    changedNewsPath     = result[2];

                console.log('SEARCH ENDED: ');
                console.log(result);

                // -> SHOW MESSAGE for MISSING CLUSTERS
                if(!_.isEmpty(missingArticleIds)) {
                    var missingTopicsMessage = __('messageBox.missingClusters',{
                        topics: _.reduce(missingArticleIds,function(memo,topic){
                            topic = '&quot;' + topic + '&quot;';
                            return (memo) ? (memo + ', ' + topic) : topic;
                        },'')}
                    );
                    Session.set('messageBoxMessage',missingTopicsMessage);
                    Session.set('showMessageBox',true);

                    // hide automatically
                    clearTimeout(messageBoxTimeout);
                    messageBoxTimeout = setTimeout(function(){
                        Session.set('showMessageBox',false);
                    },8000);
                } else
                    Session.set('showMessageBox',false);

                // reSET the NEW NEWSPATH
                changeWebsitesTitle(changedNewsPath);
                NEWSPATH = changedNewsPath;
                $('#search').val(NEWSPATH);


                // -> FADE ARTICLES OUT
                fadeArticlesOut(function(){
                    if(_.isEmpty(articleIds)) {

                        // if no articles could be found, use the search term, t look in titles of articles
                        Session.set('getArticlesFor',[NEWSPATH]);

                    // -> set article ids (will reload subscriptions)
                    } else {
                        Session.set('getArticlesFor',[NEWSPATH,articleIds]);
                    }
                });


            });
        }
    },
    '/article/:id/:year/:month/:day/:title': { to: 'article', and: function(id,year,month,day,title) {
        var articles = Session.get('articles') || [];

        // IMPROVE TODO
        // var article = {
        //     id: id,
        //     year: year,
        //     month: month,
        //     day: day,
        //     timestamp: moment(year + '-' + month + '-' + day).unix(),
        //     title: title
        // };

        console.log('Route to Article');

        // add article id of the current article, when url was only an article
        if(id && !_.find(articles, function(article){ return(article._id === id); })) {
            Session.set('getArticlesFor', [id]);
        }

        // reload the article view
        Session.set('showCurrentArticle', id);
    }},


    '*': function() {

        if(RELOAD || (!this.init && NEWSPATH !== '')) { // fix for HTML push state poly fill
            RELOAD = false;

            console.log('Route to topNews');

            // show loading circle
            Session.set('showLoadingIcon',true);

            NEWSPATH = '';
            $('#search').val(NEWSPATH);

            fadeArticlesOut(function(){
                // -> set article ids (will reload subscriptions)
                Session.set('getArticlesFor',['topNews']);
            });

        }
    }
});

