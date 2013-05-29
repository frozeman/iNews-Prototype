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
    var articles = Session.get('articles');
    articles = _.filter(articles,function(article){ return (article.clusterData.side === type); });

    return (_.isArray(Session.get('articles')) && !_.isEmpty(Session.get('articles')));
};

// get the articles
Template.grid.tiles = function(type) {

    console.log('Reload grid Data for "'+type+'"');

    var articles = Session.get('articles');
    articles = _.filter(articles,function(article){ return (article.clusterData.side === type); });

    return (_.isArray(articles)) ? articles : [];
};
