// // SETTINGS
// // Template.leftSidebar.preserve(['.tile']);


// // RENDERED
// Template.leftSidebar.rendered = function() {
//     var $leftSideBar = $(this.firstNode);

//     // console.log('LeftSidebar rendered');

//     // Meteor.defer(function(){
//     // });
// };


// // EVENTS
// Template.leftSidebar.events({
//     'click #addBookmarkButton': function(e){
//         e.preventDefault();


//         var bookmarks = Meteor.BrowserStore.get('bookmarks');

//         if(!_.isEmpty(NEWSPATH) && !_.contains(bookmarks, NEWSPATH)) {
//             bookmarks.push(NEWSPATH);
//             Meteor.BrowserStore.set('bookmarks',bookmarks);
//         }
//     }
// });


// // HELPERS
// Template.leftSidebar.bookmarks = function () {
//         console.log(Meteor.BrowserStore);
//     var bookmarks = Meteor.BrowserStore.get('bookmarks') || [];

//     bookmarks = _.map(bookmarks,function(bookmark){
//         return {
//             text: bookmark,
//             link: encodeNewsPath(bookmark)
//         };
//     });

//     return bookmarks;
// };