// RENDERED
Template.article.rendered = function() {

    centerImages('article');

    // prevent news grid from scrolling
    lockViewport();

    // fade in
    $('.dimContainer').hide();
    $('.dimContainer').fadeIn('fast');
};


// EVENTS
Template.article.events({
    'mouseup button.close, mouseup .dimContainer': function(e){
        if($(e.target).parent().hasClass('close') || $(e.target).hasClass('dimContainer')) {

            // enable news grid scrolling again
            unlockViewport();

            // fade out
            $('.dimContainer').fadeOut('fast',function(){
                Meteor.Router.to(encodeNewsPath(Session.get('newsPath')));
            });
        }
    },
    'mouseenter .image': function(e) {
        var imageZoomId = $(e.target).attr('data-relatedid');
        $('#' + imageZoomId).addClass('show');
    },
    'mouseleave .image': function(e) {
        var imageZoomId = $(e.target).attr('data-relatedid');
        $('#' + imageZoomId).removeClass('show');
    }
});


// HELPERS
Template.article.articleData = function(){
    var articleData = Session.get('currentArticle');

    // get all articles of that day
    // IMPROVE
    var articles = News.find({_id: articleData.id}).fetch();

    // filter the one with the right title
    // var article = _.filter(articles,function(article){
    //     return (_.slugify(article.title) === articleData.title);
    // });

    // set the websites title
    var article = _.first(articles);
    changeWebsitesTitle((article && article.title) + (article && article.metaData.source && ' - ' + article.metaData.source.id));

    return articles;
};
// the same as in tile.js
Template.article.subTopicLink = function (news) {
    var title = news.clusterData.subTopic;
    return encodeNewsPath(title,true); // add to the existing path
};
Template.article.datetimePubDate = function(timestamp){
    var time = moment.unix(timestamp);
    return time.format();
};
Template.article.relativePubDate = function(timestamp){
    var time = moment.unix(timestamp);
    return time.fromNow();
};
Template.article.absolutePubDate = function(timestamp){
    var time = moment.unix(timestamp);
    return time.calendar();
};
Template.article.generateImageZoomId = function(imagePath){
    imagePath = imagePath.split('/');
    imagePath = _.slugify(_.last(imagePath));
    return 'imageZoom-' + imagePath;
};