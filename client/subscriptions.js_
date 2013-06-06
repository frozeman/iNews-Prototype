Deps.autorun(function (who) {
    var articleIds = Session.get('getArticlesFor') || [];


    // set the home button to active, if on topNews
    if(_.contains(articleIds,'topNews'))
        Session.set('activateHomeButton',true);
    else
        Session.set('activateHomeButton',false);


    // change subscription only when, article ids changed
    if(!_.isEmpty(articleIds)) {

        console.log('Subscriptions ('+articleIds.length+'): '+ articleIds);

        // change subscription
        Meteor.subscribe("currentNews", articleIds, {onReady: function(error){
            // var sortBy = {'clusterData.importance': -1, 'metaData.pubDate': -1};

            // // get current articles
            // var articles = News.find({}, {sort: sortBy, reactive: false}).fetch();

            // if(!_.isEmpty(articles)) {

            //     // -> calculate the size for all given articles
            //     var highestImportance = _.max(articles, function(article){ return article.clusterData.importance; });
            //     highestImportance = highestImportance.clusterData.importance;
            //     var lowestImportance  = _.min(articles, function(article){ return article.clusterData.importance; });
            //     lowestImportance = lowestImportance.clusterData.importance;

            //     // get partly importance, and set size (small/middle/large)
            //     var partlyImportance = (highestImportance - lowestImportance) / 3;

            //     articles = _.map(articles,function(article){
            //         if(article.clusterData.importance < (partlyImportance + lowestImportance))
            //             article.size = ' small';
            //         else if(article.clusterData.importance < (partlyImportance * 2 + lowestImportance))
            //             article.size = ' medium';
            //         else
            //             article.size = ' large';

            //         return article;
            //     });
            // }

            // // redraw grid.html
            // Session.set('articles',articles);

            // hide loading circle
            Session.set('showLoadingIcon',false);

        }});

    }
});

Deps.autorun(function (who) {
    var articleId = Session.get('showCurrentArticle') || [];

    // change subscription only when, article ids changed
    if(!_.isEmpty(articleId)) {

        console.log('Subscribe to Article: '+ articleId);

        // change subscription
        Meteor.subscribe("currentArticle", articleId);

    }
});

Meteor.subscribe("currentClusters");
Meteor.subscribe("queue");