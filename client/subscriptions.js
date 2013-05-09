Deps.autorun(function () {
    var articleIds = Session.get("articleIds");

    // add article id of the current article, too
    if(_.isEmpty(articleIds))
        articleIds = [Session.get("currentArticle")];

    Meteor.subscribe("currentNews", articleIds);
});