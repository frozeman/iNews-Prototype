// SETTINGS
Template.contentWrapper.preserve(['.contentWrapper']);


// HELPERS
Template.contentWrapper.slideRight = function() {
    return (Session.get('showLeftsidebar')) ? ' slideRight' : '';
};
Template.contentWrapper.slideDown = function() {
    return (Session.get('showMessageBox')) ? ' slideDown' : '';
};
