// DOM ready
Meteor.startup(function() {

    // DEFAULT SESSIONS
    Session.setDefault('getArticlesFor',[]);
    Session.setDefault('articles',[]);
    Session.setDefault('showCurrentArticle',false);

    Session.setDefault('viewType', 'read'); // read, navigate
    Session.setDefault('showLeftsidebar', false);
    Session.setDefault('showMessageBox', false);
    Session.setDefault('messageBoxMessage', '');
    Session.setDefault('activateHomeButton',true);
    Session.set('showLoadingIcon',true);

    // set start tile size
    setTileSize();

    // SET the LOCALE
    var locale = navigator.language || navigator.browserLanguage || navigator.userLanguage || navigator.systemLanguage;
    if(locale) {
        // use onl "en" of "en_US"
        locale = locale.substr(0,2);

        // allowed languages: en, de
        locale = (locale === 'en' || locale === 'de') ? locale : 'en';

        Meteor.setLocale(locale);
        moment.lang(locale);
    }


    // SET HEAD

    // add the facebook open graph attributes
    $('html').attr("xmlns:fb","http://ogp.me/ns/fb#");
    $("head").attr("prefix", "og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#");

});


// $.fn.masonry.prototype.layout = function($bricks, callback) {
//     // Call the method from the parent = Super_class.prototype.method
//     this.constructor.prototype.layout($bricks, callback);
//     containerSize.height = containerSize.height + 20;
//     console.log(containerSize);
// };

// var oldcss = $.fn.masonry.layout;
// ...before overwriting the jQuery extension point
// $.fn.masonry.layout = function()
// {
//     // original behavior - use function.apply to preserve context
//     var ret = oldcss.apply(this, arguments);

//     console.log(containerSize);

//     // preserve return value (probably the jQuery object...)
//     return ret;
// };



// MAIN EVENTS

// RESIZE
$(window).resize(function() {


    // set the font size automatically
    //Standard height, for which the body font size is correct
    // var preferredWidth = 768;

    // var displayWidth = $(window).width();
    // var percentage = displayWidth / preferredWidth;
    // var newFontSize = Math.floor(12 * percentage) - 1;
    // $('.tile').css('font-size', newFontSize);


    var visibleItem = false;
    // use the currently selected one
    if(CURRENTDETAILTILE)
        visibleItem = CURRENTDETAILTILE;
    // get the last visible tile
    else {
        var scrollPos = $(window).scrollTop();
        $('#mainGrid > div > .tile').each(function(index, item){
            item = $(item);
            if(scrollPos > 60 && scrollPos < item.offset().top) {
                visibleItem = item;
                return false;
            }
        });
    }


    // IF ARTICLE IS OPEN
    // $('body').css('overflow','hidden');


    // prevent imediate resize
    clearTimeout(RESIZETIMEOUTID);
    RESIZETIMEOUTID = window.setTimeout(function() {

        // reset RESPONSIVE TILE SIZES
        setTileSize();
        resizeTiles();

        // SCROLL TO the LAST VISIBLE ITEM
        // if(visibleItem) {
        //     window.setTimeout(function() {
        //         $VIEWPORT.animate({scrollTop: visibleItem.offset().top - smallTile}, 900, 'easeOutElastic');
        //         scrollWindow.start(0,visibleItem.offset().top);
        //     }, 500);
        // }

    }, RESIZETIMOUT);

});

// DEBUG
// logRenders();