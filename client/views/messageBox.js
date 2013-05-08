// SETTINGS
Template.messageBox.preserve(['#messageBox']);

// HELPERS
Template.messageBox.slideRight = function() {
    return (Session.get('showLeftsidebar')) ? ' slideRight' : '';
};
Template.messageBox.message = function() {
    if(_.isString(Session.get('messageBoxMessage')))
        return new Handlebars.SafeString(Session.get('messageBoxMessage'));
};

// EVENTS
Template.messageBox.events({
    'click #messageBox': function(e) {
        Session.set('showMessageBox',false);
    }
});