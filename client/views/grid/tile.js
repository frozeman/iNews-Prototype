// VARs
var cornerButtonTimeOut;

// SETTINGS
Template.tile.preserve(['.tile']);

// CREATED
Template.tile.created = function() {
    var article = this.data;

    Meteor.defer(function(){
        var $tile = $(this.find('.tile'));



    });
};

// RENDERED
Template.tile.rendered = function() {
    var $tile = $(this.find('.tile')),
        article = this.data;

    // console.log('Tile rendered');

    centerImages($tile);

    $tile.find('.toolTip').powerTip({
        placement: 's',
        intentPollInterval: 200,
        smartPlacement: true
    });

    // set default side
    if(Session.equals('viewType', 'navigate')) {
        $tile.addClass('flip');
    } else
        $tile.removeClass('flip');


    // set timeout to prevent flickering
    Meteor.setTimeout(function(){

        $tile.removeClass('hidden');

    }, 500);

};
Template.tile.destroyed = function(){
    // console.log('Tile destroyed');
};

// REACTIVITY
Template.tile.addSizeClass = function(){

    // console.log(this.clusterData.importance, Session.get('CURRENTLYLOWESTIMPORTANCE'));

    // set tile size
    // SMALL
    if(this.clusterData.importance < (Session.get('PARTLYIMPORTANCE') + Session.get('CURRENTLYLOWESTIMPORTANCE')))
        return ' small';
    // MEDIUM
    else if(this.clusterData.importance < (Session.get('PARTLYIMPORTANCE') * 2 + Session.get('CURRENTLYLOWESTIMPORTANCE')))
        return ' medium';
    // LARGE
    else
        return ' large';
};
Template.tile.addSizeStyles = function(){
    // set tile size
    // SMALL
    if(this.clusterData.importance < (Session.get('PARTLYIMPORTANCE') + Session.get('CURRENTLYLOWESTIMPORTANCE')))
        return 'width:'+SMALLTILESIZE+'px; height:'+SMALLTILESIZE+'px';
    // MEDIUM
    else if(this.clusterData.importance < (Session.get('PARTLYIMPORTANCE') * 2 + Session.get('CURRENTLYLOWESTIMPORTANCE')))
        return 'width:'+MEDIUMTILESIZE+'px; height:'+MEDIUMTILESIZE+'px';
    // LARGE
    else
        return 'width:'+LARGETILESIZE+'px; height:'+LARGETILESIZE+'px';
};


// EVENTS
Template.tile.events({
    'click .front .image': function(e){
        Meteor.Router.to($(e.currentTarget).next('.textBox').children('a').attr('href'));
    },
    'click .addSubTopicToQueryButton, click .back a.title': function(){
        LASTARTICLE = this;
    },
    // ADD READING LIST
    'click .addToReadingList': function(e){
        e.preventDefault();
        var article = this;

        addToReadingList(article);
    },
    'mouseleave .tile': function(e){
        var $tile = $(e.currentTarget);

        if(Session.equals('viewType', 'read'))
            $tile.css('z-index','').removeClass('flip');
        else
            $tile.css('z-index','').addClass('flip');
    },
    'mouseenter button.cornerButton': function(e){
        e.stopPropagation();
        var $tile = $(e.currentTarget).closest('.tile');

        cornerButtonTimeOut = setTimeout(function() {
            $tile.css('z-index',9999);
            $tile.toggleClass('flip');
        },HOVERTIMOUT);
    },
    'mouseleave button.cornerButton': function(e){
        e.stopPropagation();
        clearTimeout(cornerButtonTimeOut);
    },
});


// HELPERS
// the same as in leftSidebar.js, article.js
Template.tile.topicColor = function () {
    return (this && this.clusterData && this.clusterData.opinionated) ? ' topicType' + Math.round(0.5 * this.clusterData.opinionated): ' topicType1';
};
Template.tile.image = function (images,title) {
    if(images[0])
        return new Handlebars.SafeString('<img src="' + images[0] + '" alt="' + title + '">');
};
Template.tile.newsLink = function(article) {
    return encodeArticlePath(article);
};
Template.tile.subTopicLink = function (article) {
    var title = article.clusterData.subTopic;
    return (title) ? encodeNewsPath(title) : '';
};
// the same as in article.js
Template.tile.subTopicLinkAdd = function (article) {
    var title = article.clusterData.subTopic;
    return (title) ? encodeNewsPath(title,true) : ''; // add to the existing path
};
// same as in article.js
Template.tile.isOnReadingList = function (articleId) {
    var readingList = JSON.parse(Meteor._localStorage.getItem('readingList'));

    // allow reactivity
    if(Session.equals('reloadReadingListButton', articleId))
        Session.set('reloadReadingListButton',false);

    return (_.find(readingList, function(item){ return (item.id === articleId) })) ? ' active' : '';
};


