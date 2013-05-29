// VARs
var cornerButtonTimeOut;

// SETTINGS
Template.tile.preserve(['.tile']);


// RENDERED
Template.tile.rendered = function() {
    var $tile = $(this.find('.tile'));

    console.log('Tile rendered');
    // console.log($tile);

    Meteor.defer(function(){

        // set tile size
        // LARGE
        if($tile.hasClass('large'))
            $tile.css({'width':LARGETILESIZE,'height':LARGETILESIZE});
        // MEDIUM
        else if($tile.hasClass('medium'))
            $tile.css({'width':MEDIUMTILESIZE,'height':MEDIUMTILESIZE});
        // SMALL
        else if($tile.hasClass('small'))
            $tile.css({'width':SMALLTILESIZE,'height':SMALLTILESIZE});


        $tile.removeClass('hidden');

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
    });

};


// EVENTS
Template.tile.events({
    'click .front .image': function(e){
        Meteor.Router.to($(e.currentTarget).next('.textBox').children('a').attr('href'));
    },
    'click .addSubTopicToQueryButton, click .back a.title': function(){
        LASTARTICLE = this;
    },
    'mouseleave .tile': function(e){
        var $tile = $(e.currentTarget);

        if(Session.equals('viewType', 'read'))
            $tile.css('z-index','').removeClass('flip');
        else
            $tile.css('z-index','').addClass('flip');
    },
    'mouseenter a.cornerButton': function(e){
        e.stopPropagation();
        var $tile = $(e.currentTarget).closest('.tile');

        cornerButtonTimeOut = setTimeout(function() {
            $tile.css('z-index',9999);
            $tile.toggleClass('flip');
        },HOVERTIMOUT);
    },
    'mouseleave a.cornerButton': function(e){
        e.stopPropagation();
        clearTimeout(cornerButtonTimeOut);
    },
});


// HELPERS
// makes the tile reactive
Template.tile.tile = function () {
    return News.find({_id: this._id}).fetch();
};
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


