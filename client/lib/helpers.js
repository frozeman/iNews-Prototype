// GLOBAL VARS

// VARS
ISMOBILE = (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) ? true : false;
CURRENTDETAILTILE = false;
VIEWTYPE = 'read';
HOVERTIMOUT = (ISMOBILE) ? 0 : 300;
RESIZETIMEOUTID = null;
RESIZETIMOUT = (ISMOBILE) ? 1 : 99;
GRIDANIMATE = (ISMOBILE) ? false : true;
$VIEWPORT = $('body, html');



// GLOBAL HELPER FUNCTIONS

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
    $('head > title').text(title);
};

encodeNewsPath = function(newsPath,add) {
    if(add)
        return Meteor.Router.newsPath() + '/' + Session.get('newsPath').replace(/ +/g,'/') + '/' + newsPath.replace(/ +/g,'/');
    else
        return Meteor.Router.newsPath() + '/' + newsPath.replace(/ +/g,'/');
};
decodeNewsPath = function(newsPath) {
    return newsPath.replace(Meteor.Router.newsPath() + '/','').replace(/\//g,' ');
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

resizeTiles = function() {

    // var
    $mainGrid = $('#mainGrid');

    // set RESPONSIVE TILE SIZES
    var smallTile = tileSize();//$mainGrid.width() - 60);
    var mediumTile = smallTile * 2;
    var largeTile = smallTile * 4;

    // set grid size
    $mainGrid.find('.tile.large').css({'width':largeTile,'height':largeTile});
    $mainGrid.find('.tile.medium').css({'width':mediumTile,'height':mediumTile});
    $mainGrid.find('.tile.small').css({'width':smallTile,'height':smallTile});

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

flipTiles = function(){
    var countLeft = {count:0};
    var countRight = {count:0};


    // if(VIEWTYPE === 'read') {
    //     $('.tile').removeClass('flip');
    // } else {
    //     $('.tile').addClass('flip');
    // }

    var turn = function(container,number){
        if(VIEWTYPE === 'read') {
            $($(container + ' .tile')[number.count]).removeClass('flip');
        } else {
            $($(container + ' .tile')[number.count]).addClass('flip');
        }
        number.count++;
        if(number.count <= $(container + ' .tile').length) {
            window.setTimeout(function(){
                turn(container,number);
            }, 0);
        }
    };

    VIEWTYPE = (VIEWTYPE === 'topic') ? 'read' : 'topic';

    turn('#mainGrid > .containerLeft',countLeft);
    turn('#mainGrid > .containerRight',countRight);
};


// I18N TEMPLATE TRANSLATION
Handlebars.registerHelper('translate', function(string,object) {
    object = object || {};
    return new Handlebars.SafeString(__(string, object));
});