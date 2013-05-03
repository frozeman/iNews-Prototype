Meteor.Router.add({
    '/news': {as: 'news'},
    '/news/:path': function(path) {
        Session.set('newsPath', path);
    },
    '/:id/:year/:month/:day/:title': { to: 'article', and: function(id,year,month,day,title) {
        // IMPROVE
        var article = {
            id: id,
            year: year,
            month: month,
            day: day,
            timestamp: moment(year + '-' + month + '-' + day).unix(),
            title: title
        };

        Session.set('currentArticle', article);
    }},


    '*': 'not_found'
});