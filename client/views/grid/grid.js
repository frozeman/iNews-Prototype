// SETTINGS
Template.grid.preserve(['#mainGrid','.containerLeft', '.containerRight']);


// RENDERED
Template.grid.rendered = function() {
    var $mainGrid = $(this.firstNode);

    // console.log('Grid rendered');

    if(Session.equals('showMessageBox', true))
        $mainGrid.addClass('slideDown');

    centerImages('#mainGrid');

    // hide loading circle
    // Session.set('showLoadingIcon',false);
};


// HELPERS

// check if articles exist articles
Template.grid.checkTiles = function(type) {
    // var articles = Session.get('articles');
    // articles = _.filter(articles,function(article){ return (article.clusterData.side === type); });

    // return (_.isArray(Session.get('articles')) && !_.isEmpty(Session.get('articles')));

    return (News.find({'clusterData.side': type}).count() > 0);
};

// get the articles
Template.grid.tiles = function(type) {

    console.log('Reload grid Data for "'+type+'"');

    // var articles = Session.get('articles');
    // articles = _.filter(articles,function(article){ return (article.clusterData.side === type); });

    // return (_.isArray(articles)) ? articles : [];


    var sortBy = {'clusterData.importance': -1, 'metaData.pubDate': -1},
        articles = News.find({'clusterData.side': type}, {sort: sortBy});


    // SET the TILE SIZE
    if(articles.count() > 0) {

        // -> calculate the size for all given articles
        CURRENTLYHIGHESTIMPORTANCE = _.max(articles.collection.docs, function(article){ return article.clusterData.importance; });
        CURRENTLYHIGHESTIMPORTANCE = CURRENTLYHIGHESTIMPORTANCE.clusterData.importance;
        CURRENTLYLOWESTIMPORTANCE  = _.min(articles.collection.docs, function(article){ return article.clusterData.importance; });
        CURRENTLYLOWESTIMPORTANCE = CURRENTLYLOWESTIMPORTANCE.clusterData.importance;

        // get partly importance, and set size (small/middle/large)
        PARTLYIMPORTANCE = (CURRENTLYHIGHESTIMPORTANCE - CURRENTLYLOWESTIMPORTANCE) / 3;

    }


    // get current articles
    return articles;
};
