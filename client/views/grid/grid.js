// SETTINGS
Template.grid.preserve(['#mainGrid','.containerLeft', '.containerRight']);


// RENDERED
Template.grid.rendered = function() {

    centerImages('#mainGrid');

    Meteor.defer(function(){
        resizeTiles();
    });


    // ATTACH EVENTS to TILES
    $('#mainGrid > div > .tile').each(function(){

        var $tile = $(this);
        var cornerButtonTimeOut;

        // SHOW DETAIL TILE
        // $tile.click(function(e) {

        //     // remove open detail tile first
        //     if(CURRENTDETAILTILE) {
        //         CURRENTDETAILTILE.fadeOut(400, function(){
        //             if($tile)
        //                 $tile.css('z-index','');
        //             $(this).remove();
        //         });
        //         CURRENTDETAILTILE = false;

        //     // then open the detail tile
        //     } else {
        //         var tile = $(e.target).parents('.tile')[0];
        //         if(tile) {
        //             var $tile = $(tile);
        //             var detailTile = $('<div class="tile large detail">' + $tile.html() + '</div>');
        //             $tile.append(detailTile);
        //             $tile.css('z-index',9999);

        //             // if its a top tile
        //             if($tile.position().top === 0)
        //                 detailTile.css('top',0);
        //             else
        //                 detailTile.css('bottom',0);

        //             // if its in the right side
        //             if($(e.target).parents('.containerRight')[0])
        //                 detailTile.css('right',0);
        //             else
        //                 detailTile.css('left',0);

        //             var tileSize = tileSize($(window).width());

        //             detailTile
        //                 .css({
        //                     'bottom': 0,
        //                     'width': tileSize * 4,
        //                     'height': tileSize * 4
        //                 })
        //                 .mouseleave(function(e) {
        //                     detailTile.fadeOut(400, function(){
        //                         $tile.css('z-index','');
        //                         $(this).remove();
        //                     });
        //                     CURRENTDETAILTILE = false;
        //                 })
        //                 .click(function(e){
        //                     e.stopPropagation();
        //                 });

        //             // SCROLL TO DETAIL TILE
        //             if(detailTile.offset().top < $(window).scrollTop())
        //                 $VIEWPORT.animate({scrollTop: detailTile.offset().top - tileSize / 4}, 500, 'easeOutExpo');
        //                 // scrollWindow.start(0,detailTile.offset().top - 20);

        //             CURRENTDETAILTILE = detailTile;
        //         }
        //     }
        // });

        // $tile.find('a').click(function(e){
        //     e.preventDefault();
        //     // e.stopPropagation();
        // });

        // flip back on mouseleave
        $tile.mouseleave(function(){
            if(VIEWTYPE === 'read')
                $tile.css('z-index','').removeClass('flip');
            else
                $tile.css('z-index','').addClass('flip');
        });

        // show front/back side
        $tile.find('a.cornerButton').mouseenter(function(e) {
            e.stopPropagation();

            cornerButtonTimeOut = setTimeout(function() {
                $tile.css('z-index',9999);
                $tile.toggleClass('flip');
            },HOVERTIMOUT);
        }).mouseleave(function(){
            clearTimeout(cornerButtonTimeOut);
        });

    });
};


// HELPERS
Template.grid.slideDown = function() {
    return (Session.get('showMessageBox')) ? ' slideDown' : '';
};
// Template.grid.slideRight = function() {
//     return (Session.get('showLeftsidebar')) ? ' slideRight' : '';
// };

// get the articles
Template.grid.tiles = function(type) {

    var articleIds = Session.get('articleIds') || [],
        articles;
    if(!_.isArray(articleIds)) // TEMPORARY?
        articles = News.find({'clusterData.side': type}, {sort: {'clusterData.importance': -1, 'metaData.pubDate': -1}}).fetch();
    else
        articles = News.find({$and: [{'clusterData.side': type}, {'_id': {$in: articleIds }}]}, {sort: {'clusterData.importance': -1, 'metaData.pubDate': -1}}).fetch();

    // -> calculate the size for all articles in that cluster
    // get highest importance
    var highestImportance = 0;
    _.each(articles,function(article){
        if(article.clusterData.importance > highestImportance)
            highestImportance = article.clusterData.importance;
    });

    // get part importance, and set size (small/middle/large)
    var partlyImportance = highestImportance / 3;
    _.each(articles,function(article){
        if(article.clusterData.importance < partlyImportance)
            article.size = ' small';
        else if(article.clusterData.importance < (partlyImportance * 2))
            article.size = ' medium';
        else
            article.size = ' large';
    });


    // hide loading circle
    Session.set('showLoadingIcon',false);

    return articles;
};
