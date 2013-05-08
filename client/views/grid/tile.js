// SETTINGS
Template.tile.preserve(['.tile']);


// RENDERED
Template.tile.rendered = function() {

};


// EVENTS
Template.tile.events({
    'click .front .image': function(e){
        Meteor.Router.to($(e.currentTarget).next('.textBox').children('a').attr('href'));
    }
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
    return encodeNewsPath(title,true); // add to the existing path
};


