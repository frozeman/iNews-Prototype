Deps.autorun(function () {
    var articleIds = Session.get('articleIds');

    // add article id of the current article, when url was only an article
    if(_.isEmpty(articleIds) && Session.get("currentArticle"))
        articleIds = ['topNews',Session.get("currentArticle")];


    // change subscription only when, article ids changed
    if(!_.isEmpty(articleIds) || _.isString(articleIds)) {

        console.log('Subscriptions: '+ articleIds);

        Meteor.subscribe("currentNews", articleIds);

    }
});

Meteor.subscribe("currentClusters");
Meteor.subscribe("queue");