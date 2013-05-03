// RENDERED
Template.tileSide.rendered = function() {
    console.log('tile renderd');
};


// EVENTS
Template.tileSide.events({
    'click .front .image': function(e){
        Meteor.Router.to($(e.currentTarget).next('.textBox').children('a').attr('href'));
    }
});


// HELPERS
Template.tileSide.image = function (images) {
    return images[0];
};

Template.tileSide.newsLink = function (news) {
    var title = URLify(news.title);
    var time = moment.unix(news.metaData.pubDate);
    return '/' + news._id + '/' + time.format('YYYY') + '/' + time.format('MM') + '/' + time.format('DD') + '/' + title;
};


var newsLink = function(news) {
    // body...
};

