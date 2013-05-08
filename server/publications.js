/*
* Publications and Acces rules
*/

// publish only searched articles
Meteor.publish("currentNews", function (articleIds) {
    // TEMPORARY?
    if(articleIds === 'all')
        return News.find({});
    else if(_.isArray(articleIds))
        return News.find({'_id': {$in: articleIds}});
});

// News.allow({
//   insert: function (userId, party) {
//     return false;
//   }
// });
// // client: this will fail
// var party = { ... };
// Parties.insert(party);