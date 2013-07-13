// SETTINGS
// Template.leftSidebar.preserve(['.tile']);


// RENDERED
Template.leftSidebar.rendered = function() {
    var $leftSideBar = $(this.firstNode);

    // console.log('LeftSidebar rendered');

    Meteor.defer(function(){

        $leftSideBar.find('.toolTip').powerTip({
            placement: 's',
            intentPollInterval: 200,
            smartPlacement: true
        });
    });
};


// EVENTS
Template.leftSidebar.events({
    'click #addBookmarkButton': function(e){
        e.preventDefault();


        var bookmarks = JSON.parse(Meteor._localStorage.getItem('bookmarks'));


        if(!_.isEmpty(NEWSPATH) && !_.find(bookmarks, function(item){ return (item.text === NEWSPATH);})) {
            var opinionated = (LASTARTICLE) ? LASTARTICLE.clusterData.opinionated : 0;
            bookmarks = bookmarks || [],
            bookmarks.push({
                text: NEWSPATH,
                link: encodeNewsPath(NEWSPATH),
                opinionated: opinionated
            });
            Meteor._localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
            Session.set('reloadBookmarks',true);
        }
    },
    'click .removeBookmark': function(e){
        e.preventDefault();
        $button = $(e.currentTarget);


        var bookmarks = JSON.parse(Meteor._localStorage.getItem('bookmarks'));

        bookmarks = _.reject(bookmarks, function(bookmark){ return (bookmark === $button.attr('data-bookmark')); });
        Meteor._localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
        Session.set('reloadBookmarks',true);
    },
    'click .removeArticle': function(e){
        e.preventDefault();
        $button = $(e.currentTarget);


        var readingList = JSON.parse(Meteor._localStorage.getItem('readingList'));

        readingList = _.reject(readingList, function(article){ return (article.id === $button.attr('data-article')); });
        Meteor._localStorage.setItem('readingList',JSON.stringify(readingList));

        // reactivity
        Session.set('reloadReadingListButton',$button.attr('data-article'));
        Session.set('reloadReadingList',true);
    }
});


// HELPERS
// the same as in article.js, tile.js
Template.leftSidebar.topicColor = function () {
    return (this && this.opinionated) ? ' topicType' + Math.round(0.5 * this.opinionated): ' topicType1';
};
Template.leftSidebar.bookmarks = function () {
    var bookmarks = JSON.parse(Meteor._localStorage.getItem('bookmarks')) || [];

    // allow reactivity
    if(Session.equals('reloadBookmarks', true))
        Session.set('reloadBookmarks',false);

    return bookmarks;
};
Template.leftSidebar.readingList = function () {
    var readingList = JSON.parse(Meteor._localStorage.getItem('readingList')) || [];

    // allow reactivity
    if(Session.equals('reloadReadingList', true))
        Session.set('reloadReadingList',false);

    return readingList;
};