// SETTINGS
Template.loadingIcon.preserve(['.loadingIcon']);

// HELPERS
Template.loadingIcon.visible = function() {
    return (Session.equals('showLoadingIcon', true)) ? '' : ' hidden';
};
Template.loadingIcon.slideDown = function() {
    return (Session.equals('showMessageBox', true)) ? ' slideDown' : '';
};