// ADD / REMOVE ARTICLES from the READING LIST
addToReadingList = function(article){

    var readingList = JSON.parse(Meteor._localStorage.getItem('readingList'));

    // add to reading list
    if(!_.isEmpty(article) && !_.find(readingList, function(item){ return (item.id === article._id); })) {
        readingList = readingList || [];
        readingList.push({
            id: article._id,
            title: _.stripTags(article.title),
            link: encodeArticlePath(article),
            opinionated: article.clusterData.opinionated
        });
        Meteor._localStorage.setItem('readingList',JSON.stringify(readingList));

    // remove from reading list
    } else {

        readingList = _.reject(readingList, function(item){ return (item.id === article._id); });
        Meteor._localStorage.setItem('readingList',JSON.stringify(readingList));
    }

    Session.set('reloadReadingListButton',article._id);
    Session.set('reloadReadingList',true);
};