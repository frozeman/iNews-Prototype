// SETTINGS
Template.loadingIcon.preserve(['.loadingIcon']);

// HELPERS
Template.loadingIcon.visible = function() {
    return (Session.get('showLoadingIcon')) ? '' : ' hidden';
};
Template.loadingIcon.slideDown = function() {
    return (Session.get('showMessageBox')) ? ' slideDown' : '';
};