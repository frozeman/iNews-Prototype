// vars
var messageBoxTimeout;

Meteor.Router.beforeRouting = function() {
    // clear websites title
    changeWebsitesTitle();
};
Meteor.Router.add({
    '/news': {as: 'news', to: function(){
        Session.set('articleIds','all');
    }},
    '/news/*': function(path) {
        var newsPath = decodeNewsPath(path);

        changeWebsitesTitle(newsPath);

        // only START a SEARCH when the topics changed
        if(Session.get('newsPath') !== newsPath) {

            // set the newsPath
            Session.set('newsPath', newsPath);
            $('#search').val(newsPath);

            // console.log('SEARCH STARTED: '+newsPath);

            // show loading circle
            Session.set('showLoadingIcon',true);

            // -> START SEARCH
            Meteor.call('search', newsPath, function(error, result) {

                // console.log('SEARCH ENDED: ');
                // console.log(result);

                // -> SHOW MESSAGE for MISSING CLUSTERS
                if(!_.isEmpty(result[1])) {
                    var missingTopicsMessage = __('messageBox.missingClusters',{
                        topics: _.reduce(result[1],function(memo,topic){
                            topic = '&quot;' + topic + '&quot;';
                            return (memo) ? (memo + ', ' + topic) : topic;
                        },'')}
                    );
                    Session.set('messageBoxMessage',missingTopicsMessage);
                    Session.set('showMessageBox',true);

                    // hide automatically
                    clearTimeout(messageBoxTimeout);
                    messageBoxTimeout = setTimeout(function(){
                        Session.set('showMessageBox',false);
                    },8000);
                } else
                    Session.set('showMessageBox',false);


                // -> FADE ARTICLES OUT
                var smallTile = tileSize();
                Q.allResolved(_.map($('.tile'),function(tile){
                    var deferred = Q.defer(),
                        $tile = $(tile);

                    setTimeout(function(){
                        $tile.addClass('hidden');
                        $tile.css({'width':smallTile,'height':smallTile});
                        deferred.resolve();
                    },1);

                    return deferred.promise;
                })).done(function(promises){

                    // wait until all animations happend
                    setTimeout(function(){
                        resizeTiles();
                        $('.tile').removeClass('hidden');
                        // -> set article ids
                        Session.set('articleIds',result[0]);
                    },400);
                });


                // hide loading circle
                Session.set('showLoadingIcon',false);
            });
        }
    },
    '/article/:id/:year/:month/:day/:title': { to: 'article', and: function(id,year,month,day,title) {
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