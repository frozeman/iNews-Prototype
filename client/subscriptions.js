Deps.autorun(function (who) {
    var articleIds = Session.get('getArticlesFor') || [];


    // set the home button to active, if on topNews
    if(_.contains(articleIds,'topNews'))
        Session.set('activateHomeButton',true);
    else
        Session.set('activateHomeButton',false);


    // change subscription only when, article ids changed
    if(!_.isEmpty(articleIds)) {

        // console.log('Subscriptions ('+articleIds.length+'): '+ articleIds);

        // change subscription
        Session.set('subscriptionReady', Meteor.subscribe("currentNews", articleIds).ready());

    }
});

Deps.autorun(function (who) {
    var articleId = Session.get('showCurrentArticle') || [];

    // change subscription only when, article ids changed
    if(!_.isEmpty(articleId)) {

        // console.log('Subscribe to Article: '+ articleId);

        // change subscription
        Meteor.subscribe("currentArticle", articleId);

    }
});

Deps.autorun(function(){
    // hide loading circle
    if(_.isEmpty(News.find({}).fetch()))
        Session.set('showArticlesMissingText',true);
    else
        Session.set('showArticlesMissingText',false);
});

Meteor.subscribe("currentClusters");
Meteor.subscribe("queue");