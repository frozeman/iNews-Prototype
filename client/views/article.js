// PRESERVE
Template.article.preserve(['.dimContainer','article.main','.content']);


// CREATED
Template.article.created = function() {

    Meteor.defer(function(){
        // fade in
        $('.dimContainer').removeClass('hidden');

        // prevent news grid from scrolling
        lockViewport();
    });
};
// RENDERED
Template.article.rendered = function() {
    var $this = $(this.firstNode);

    centerImages('article');

    Meteor.defer(function(){
        $this.find('.toolTip').powerTip({
            placement: 's',
            intentPollInterval: 200,
            smartPlacement: true
        });
    });
};



// EVENTS
Template.article.events({
    'click .articleLink': function(){
        LASTARTICLE = this;
    },
    'mouseup button.close, mouseup .dimContainer': function(e){
        if($(e.currentTarget).hasClass('close') || $(e.target).hasClass('dimContainer')) {

            // enable news grid scrolling again
            unlockViewport();

            // fade out
            // $('.dimContainer').fadeOut('fast',function(){
                Session.set('showCurrentArticle', false);
                Meteor.Router.to(encodeNewsPath(NEWSPATH));
            // });
        }
    },
    // ADD READING LIST
    'click .addToReadingList': function(e){
        e.preventDefault();
        var article = this;

        addToReadingList(article);
    },
    // IMPORTANT BUTTON
    'click .importantButton': function(e){
        e.preventDefault();
        var article = this;

        var importantButton = JSON.parse(Meteor._localStorage.getItem('importantButton'));

        // add importance
        if(!_.isEmpty(article) && !_.contains(importantButton, article._id)) {
            News.update({_id: article._id},{$inc: {'clusterData.importance': 1}}, function(error){
                if(!error) {
                    
                    importantButton = importantButton || [];
                    importantButton.push(article._id);
                    Meteor._localStorage.setItem('importantButton',JSON.stringify(importantButton));
                    Session.set('reloadImportantButton',true);

                }
            });
        // remove importance
        } else {

            News.update({_id: article._id},{$inc: {'clusterData.importance': -1}}, function(error){
                if(!error) {
                    
                    importantButton = importantButton || [];
                    importantButton = _.reject(importantButton, function(item){ return (item === article._id); });
                    Meteor._localStorage.setItem('importantButton',JSON.stringify(importantButton));
                    Session.set('reloadImportantButton',true);

                }
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
    return News.find({_id: Session.get('showCurrentArticle')});
};
Template.article.setTitle = function(){
    var article = this;
    // set the websites title
    changeWebsitesTitle((article && article.title) + (article && article.metaData.source && ' - ' + article.metaData.source.id));
};
Template.article.isImportant = function (articleId) {
    var importantButton = JSON.parse(Meteor._localStorage.getItem('importantButton'));

    // allow reactivity
    if(Session.equals('reloadImportantButton', true))
        Session.set('reloadImportantButton',false);

    return (_.contains(importantButton, articleId)) ? ' active' : '';
};
// same as in tile.js
Template.article.isOnReadingList = function (articleId) {
    var readingList = JSON.parse(Meteor._localStorage.getItem('readingList'));

    // allow reactivity
    if(Session.equals('reloadReadingListButton', true))
        Session.set('reloadReadingListButton',false);

    return (_.find(readingList, function(item){ return (item.id === articleId) })) ? ' active' : '';
};
// the same as in leftSidebar.js, tile.js
Template.article.topicColor = function () {
    return (this && this.clusterData && this.clusterData.opinionated) ? ' topicType' + Math.round(0.5 * this.clusterData.opinionated): ' topicType1';
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
    return new Handlebars.SafeString(content.replace(/<\/?(?:(?!p\b)(?!a\b)(?!img\b)[^>])*>/gi,''));
};