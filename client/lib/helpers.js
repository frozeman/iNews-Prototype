// GLOBAL VARS

// VARS
ISMOBILE = (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) ? true : false;
HOVERTIMOUT = (ISMOBILE) ? 0 : 300;
RESIZETIMEOUTID = null;
RESIZETIMOUT = (ISMOBILE) ? 1 : 200;
GRIDANIMATE = (ISMOBILE) ? false : true;
$VIEWPORT = $('body, html'),

NEWSPATH = '',
LASTARTICLE = {},
RELOAD = true; //need to be TRUE on start, so it loads the topNews at start
CURRENTDETAILTILE = false;

SMALLTILESIZE = 0,
MEDIUMTILESIZE = 0,
LARGETILESIZE = 0,

CURRENTLYHIGHESTIMPORTANCE = 0,
CURRENTLYLOWESTIMPORTANCE = 0,
PARTLYIMPORTANCE = 0;



// GLOBAL HELPER FUNCTIONS

logRenders = function() {
    _.each(Template, function (template, name) {
      var oldRender = template.rendered;
      var counter = 0;

      template.rendered = function () {
        // console.log(name, "render count: ", ++counter);
        oldRender && oldRender.apply(this, arguments);
      };
    });
}

matrixToArray = function(matrix) {
    if(matrix !== 'none')
        return matrix.substr(7, matrix.length - 8).split(', ');
    else
        return [];
};

// Stop the window scrolling if the user scrolls.
// $VIEWPORT.bind('scroll mousedown DOMMouseScroll mousewheel keyup', function(e){
//     if ( e.which > 0 || e.which < 0 || e.type === 'mousedown' || e.type === 'mousewheel')
//         $VIEWPORT.stop();
// });


lockViewport = function() {
    $VIEWPORT.css('overflow','hidden');
};
unlockViewport = function() {
    $VIEWPORT.css('overflow','');
};


changeWebsitesTitle = function(title) {
    title = (title) ? 'iNews | ' + title : 'iNews';
    title = _.stripTags(title);
    $('head > title').text(title);
};

encodeNewsPath = function(newsPath,add) {
    var addNewsPath = (_.isString(NEWSPATH)) ? NEWSPATH.replace(/ +/g,'/') + '/' : '',
        generatedNewsPath = '',
        changedNewsPath = newsPath.replace(/ +/g,'/');

    if(add)
        generatedNewsPath = '/news/' + addNewsPath + changedNewsPath;
    else if(!_.isEmpty(newsPath))
        generatedNewsPath = '/news/' + changedNewsPath;
    else
        generatedNewsPath = '/news';

    // remove duplicates from the given newsPath
    generatedNewsPath = _.uniq(generatedNewsPath.replace(/\/+/g,'/').split('/')).join('/');

    return generatedNewsPath;
};
decodeNewsPath = function(newsPath) {
    return _.trim(newsPath.replace('/news/','').replace(/\/+/g,' '));
};

encodeArticlePath = function(article) {
    var title = _.slugify(article.title);
    var time = moment.unix(article.metaData.pubDate);
    return '/article/' + article._id + '/' + time.format('YYYY') + '/' + time.format('MM') + '/' + time.format('DD') + '/' + title;
};

// debulked onresize handler
// function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,100)};return c};

// loadingIcon = {
//     show: function(){
//         $('body > .loadingIcon').removeClass('hidden');
//     },
//     hide: function(){
//         $('body > .loadingIcon').addClass('hidden');
//     }
// };

// messageBox = {
//     show: function(){
//         $('header.main, body > .loadingIcon').addClass('slideDown');
//     },
//     hide: function(){
//         $('header.main, body > .loadingIcon').removeClass('slideDown');
//     }
// };

// CENTER IMAGES
centerImages = function(container) {
    $(container + ' .image img').each(function() {
        var img = $(this);
        if(img.parents('.image')) {
            img.parents('.image').css('background-image','url("' + img.attr('src') + '")');
            img.css('display','none');
        }
    });
};

// Calculate the smallest Tile
tileSize = function(containerWidth) {
    var dividerWidth = ($('#mainGrid').width() <= 480) ? 30 : 60;
    containerWidth = $('#mainGrid').width() - dividerWidth; // DEACTIVATE ??
    var division = 1;
    if(containerWidth > 768) division = 2;
    if(containerWidth > 1600) division = 4;
    // division = (containerWidth > 1200) ? 3 : division;
    var containerSize = Math.floor(containerWidth / 2);
    while(containerSize%16 !== 0) {
        containerSize--;
    }

    return containerSize / (division * 4);
};

setTileSize = function() {
    SMALLTILESIZE = tileSize(); //$mainGrid.width() - 60);
    MEDIUMTILESIZE = SMALLTILESIZE * 2;
    LARGETILESIZE = SMALLTILESIZE * 4;
};

resizeTiles = function() {

    // var
    $mainGrid = $('#mainGrid');

    // set grid size
    $mainGrid.find('.tile.large').css({'width':LARGETILESIZE,'height':LARGETILESIZE}).removeClass('hidden');
    $mainGrid.find('.tile.medium').css({'width':MEDIUMTILESIZE,'height':MEDIUMTILESIZE}).removeClass('hidden');
    $mainGrid.find('.tile.small').css({'width':SMALLTILESIZE,'height':SMALLTILESIZE}).removeClass('hidden');

    // set article boxes size
    // $('article.main aside.left').css({'width':largeTile});

    // set subtiles size
    // var subsmallTile = tileSize(largeTile);
    // var submediumTile = subsmallTile * 2;
    // var sublargeTile = subsmallTile * 4;

    // $('.large .subTile.large').css({'width':sublargeTile,'height':sublargeTile});
    // $('.large .subTile.medium').css({'width':submediumTile,'height':submediumTile});
    // $('.large .subTile.small').css({'width':subsmallTile,'height':subsmallTile});

    // var subsmallTile = tileSize(mediumTile);
    // var submediumTile = subsmallTile * 2;
    // var sublargeTile = subsmallTile * 4;

    // $('.medium .subTile.large').css({'width':sublargeTile,'height':sublargeTile});
    // $('.medium .subTile.medium').css({'width':submediumTile,'height':submediumTile});
    // $('.medium .subTile.small').css({'width':subsmallTile,'height':subsmallTile});

    // var subsmallTile = tileSize(smallTile);
    // var submediumTile = subsmallTile * 2;
    // var sublargeTile = subsmallTile * 4;

    // $('.small .subTile.large').css({'width':sublargeTile,'height':sublargeTile});
    // $('.small .subTile.medium').css({'width':submediumTile,'height':submediumTile});
    // $('.small .subTile.small').css({'width':subsmallTile,'height':subsmallTile});

    // set the CONTAINER WIDTH
    // $('.gridContainer').css({
        // 'width': $(window).width()
    // });
};

fadeArticlesOut = function(callback){

    $('#mainGrid .tile').addClass('hidden');

    // Q.allResolved(_.map($('.tile'),function(tile){
    //     var deferred = Q.defer(),
    //         $tile = $(tile);

    //     setTimeout(function(){
    //         $tile.addClass('hidden');
    //         $tile.css({'width':SMALLTILESIZE,'height':SMALLTILESIZE});
    //         deferred.resolve();
    //     },1);

    //     return deferred.promise;
    // })).done(function(promises){


        // wait until all animations happend
        setTimeout(function(){

            // run callback
            callback();


            if(RELOAD) {
                RELOAD = false;
                Session.set('showLoadingIcon',false);

                setTimeout(function(){
                    $('#mainGrid .tile').removeClass('hidden');
                    // resizeTiles();
                },600);
            }
        },600);

    // });
};


// I18N TEMPLATE TRANSLATION
Handlebars.registerHelper('translate', function(string,object) {
    object = object || {};
    return new Handlebars.SafeString(__(string, object));
});