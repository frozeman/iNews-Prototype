// SETTINGS
Template.grid.preserve(['#mainGrid','.containerLeft', '.containerRight']);


// RENDERED
Template.grid.rendered = function() {
    var $mainGrid = $(this.firstNode);

    // console.log('Grid rendered');

    if(Session.equals('showMessageBox', true))
        $mainGrid.addClass('slideDown');

    centerImages('#mainGrid');

    Meteor.defer(function(){
        resizeTiles();
    });
};


// HELPERS

// check if articles exist articles
Template.grid.checkTiles = function(type) {
    // hide loading circle
    Session.set('showLoadingIcon',false);
    return (News.find({'clusterData.side': type}).fetch().length > 0);
};

// get the articles
Template.grid.tiles = function(type) {

    console.log('Reload grid Data for "'+type+'"');

    var sortBy = {'clusterData.importance': -1, 'metaData.pubDate': -1}
    var articles = News.find({'clusterData.side': type}, {sort: sortBy}).fetch();

    if(!_.isEmpty(articles)) {

        // -> calculate the size for all given articles
        var highestImportance = _.max(articles, function(article){ return article.clusterData.importance; });
        highestImportance = highestImportance.clusterData.importance;
        var lowestImportance  = _.min(articles, function(article){ return article.clusterData.importance; });
        lowestImportance = lowestImportance.clusterData.importance;

        // get partly importance, and set size (small/middle/large)
        var partlyImportance = (highestImportance - lowestImportance) / 3;

        articles = _.map(articles,function(article){
            if(article.clusterData.importance < (partlyImportance + lowestImportance))
                article.size = ' small';
            else if(article.clusterData.importance < (partlyImportance * 2 + lowestImportance))
                article.size = ' medium';
            else
                article.size = ' large';

            return article;
        });
    }


    // hide loading circle
    Session.set('showLoadingIcon',false);

    return (articles) ? articles : [];
};
