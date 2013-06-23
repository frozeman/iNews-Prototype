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
        Meteor.subscribe("currentNews", articleIds, {onReady: function(error){

            // hide loading circle
            Session.set('showLoadingIcon',false);

        }});

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

Meteor.subscribe("currentClusters");
Meteor.subscribe("queue");