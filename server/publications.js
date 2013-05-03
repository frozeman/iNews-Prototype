// server: publish all news documents
Meteor.publish("all-news", function () {
  return News.find(); // everything
});