// SETTINGS
Template.grid.preserve(['#mainGrid','.containerLeft', '.containerRight']);


// RENDERED
Template.grid.rendered = function() {
    var $mainGrid = $(this.firstNode);

    // console.log('Grid rendered');

    if(Session.equals('showMessageBox', true))
        $mainGrid.addClass('slideDown');

    // hide loading circle
    // Session.set('showLoadingIcon',false);
};


// HELPERS

// get the articles
Template.grid.tiles = function(type) {

    // console.log('Reload grid Data for "'+type+'"');

    var sortBy = {'clusterData.importance': -1, 'metaData.pubDate': -1},
        articles = News.find({'clusterData.side': type}, {sort: sortBy});


    // get current articles
    if(Session.equals('subscriptionReady', true)) {
        Session.set('showLoadingIcon', false);
        return articles;
    }
};


Template.grid.articlesMissing = function(){
    return Session.equals('showArticlesMissingText', true);
};


// AUTORUN
Deps.autorun(function(c){
    var articles = News.find({}).fetch();

// console.log(articles)

    // SET the TILE SIZE
    if(articles.length > 0) {

        // -> calculate the size for all given articles
        CURRENTLYHIGHESTIMPORTANCE = _.max(articles, function(article){ return article.clusterData.importance; });
        CURRENTLYHIGHESTIMPORTANCE = CURRENTLYHIGHESTIMPORTANCE.clusterData.importance;
        CURRENTLYLOWESTIMPORTANCE  = _.min(articles, function(article){ return article.clusterData.importance; });
        CURRENTLYLOWESTIMPORTANCE = CURRENTLYLOWESTIMPORTANCE.clusterData.importance;

        Session.set('CURRENTLYHIGHESTIMPORTANCE', CURRENTLYHIGHESTIMPORTANCE);
        Session.set('CURRENTLYLOWESTIMPORTANCE', CURRENTLYLOWESTIMPORTANCE);

        // get partly importance, and set size (small/middle/large)
        Session.set('PARTLYIMPORTANCE', (CURRENTLYHIGHESTIMPORTANCE - CURRENTLYLOWESTIMPORTANCE) / 3);

    }
});
