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
        if($(e.currentTarget).hasClass('close') || $(e.target).hasClass('dimContainer')) {

            // enable news grid scrolling again
            unlockViewport();

            // fade out
            $('.dimContainer').fadeOut('fast',function(){
                Meteor.Router.to(encodeNewsPath(NEWSPATH));
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
    var articleId = Session.get('currentArticle');

    // fetch article
    var article = News.findOne({_id: articleId});

    if(article) {
        // set the websites title
        changeWebsitesTitle((article && article.title) + (article && article.metaData.source && ' - ' + article.metaData.source.id));

        // remove the html from the content
        article.abstract = article.abstract.replace(/<\/?(?:(?!p\b)(?!a\b)(?!img\b)[^>])*>/gi,'');
        article.content = article.content.replace(/<\/?(?:(?!p\b)(?!a\b)(?!img\b)[^>])*>/gi,'');
    }

    Session.set('showLoadingIcon',false);

    return article ? [article] : [];
};
// the same as in tile.js
Template.article.subTopicLink = function (news) {
    var title = news.clusterData.subTopic;
    return (title) ? encodeNewsPath(title,true) : ''; // add to the existing path
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
Template.article.placeAuthor = function(content){
    return new Handlebars.SafeString(content);
};
Template.article.placeContent = function(content){
    return new Handlebars.SafeString(content);
};