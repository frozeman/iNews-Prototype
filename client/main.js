// DOM ready
Meteor.startup(function() {

    // DEFAULT SESSIONS
    Session.setDefault('getArticlesFor',[]);
    Session.setDefault('showCurrentArticle',false);

    Session.setDefault('viewType', 'read'); // read, navigate
    Session.setDefault('showLeftsidebar', false);
    Session.setDefault('showMessageBox', false);
    Session.setDefault('messageBoxMessage', '');
    Session.setDefault('activateHomeButton',true);
    Session.setDefault('showLoadingIcon',true);

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



// MAIN EVENTS

// RESIZE
$(window).resize(function() {


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