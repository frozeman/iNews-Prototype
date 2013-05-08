Deps.autorun(function () {
  Meteor.subscribe("currentNews", Session.get("articleIds"));
});