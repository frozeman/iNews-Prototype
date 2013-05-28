// VARs
var cornerButtonTimeOut;

// SETTINGS
// Template.tile.preserve(['.tile']);


// RENDERED
Template.tile.rendered = function() {
    var $tile = $(this.firstNode);

    // console.log('Tile rendered');

    Meteor.defer(function(){
        $tile.removeClass('hidden');

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
Template.tile.image = function (images,title) {
    if(images[0])
        return new Handlebars.SafeString('<img src="' + images[0] + '" alt="' + title + '">');
};
Template.tile.newsLink = function (news) {
    var title = _.slugify(news.title);
    var time = moment.unix(news.metaData.pubDate);
    return '/article/' + news._id + '/' + time.format('YYYY') + '/' + time.format('MM') + '/' + time.format('DD') + '/' + title;
};
// the same as in article.js
Template.tile.subTopicLink = function (news) {
    var title = news.clusterData.subTopic;
    return (title) ? encodeNewsPath(title,true) : ''; // add to the existing path
};


