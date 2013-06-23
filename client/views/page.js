// PRESERVE
Template.page.preserve(['.dimContainer','article.main','.content']);


// CREATED
Template.page.created = function() {

    Meteor.defer(function(){
        // fade in
        $('.dimContainer').removeClass('hidden');

        // prevent news grid from scrolling
        lockViewport();
    });
};
// RENDERED
Template.page.rendered = function() {};

Template.page.content = function(){
    return [Session.get('showPage')];
};

// EVENTS
Template.page.events({
    'mouseup button.close, mouseup .dimContainer': function(e){
        if($(e.currentTarget).hasClass('close') || $(e.target).hasClass('dimContainer')) {

            // enable news grid scrolling again
            unlockViewport();

            // fade out
            $('.dimContainer').fadeOut('fast',function(){
                Session.set('showCurrentArticle', false);
                Meteor.Router.to(encodeNewsPath(NEWSPATH));
            });
        }
    }
});


// HELPERS
Template.page.setTitle = function(){
    var page = this;
    // set the websites title
    changeWebsitesTitle(page.title);
};