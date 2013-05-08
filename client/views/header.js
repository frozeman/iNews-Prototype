// SETTINGS
Template.header.preserve(['header.main']);

// RENDERED
Template.header.rendered = function() {


    // SEARCH INPUT
    // $('#search').typeahead({
    //     name: 'accounts',
    //     local: ['timtrueman', 'JakeHarding', 'vskarich']
    // });








    // $('.pathMenu input').on('keyup',function(e){
    //     var $input = $(this);

    //     // clear on ESC
    //     if(e.keyCode == 27)
    //         $input.val('');

    //     if($input.val() !== '')
    //         $input.next('button.cancel').removeClass('hidden');
    //         // $input.next('button.cancel').css('display','inline-block');
    //     else
    //         $input.next('button.cancel').addClass('hidden');
    //         // $input.next('button.cancel').css('display','none');
    // });
    // $('.pathMenu button.cancel').click(function(){
    //     $(this).prev('input').val('').trigger('keyup').trigger('focus');
    // });


    // SHOW/HIDE LEFT SIDEBAR BY SWIPE
    // var $slideElementsHammer = $('#mainGrid').hammer({swipe_velocity: 0.2});
    // $slideElementsHammer.on("swipeleft", function(e) {
    //     $slideElements.removeClass('slideRight');
    //     $('.sidebarButton').removeClass('active');
    // });
    // $slideElementsHammer.on("swiperight", function(e) {
    //     $slideElements.addClass('slideRight');
    //     $('.sidebarButton').addClass('active');
    // });

};


// EVENTS
var searchKeyTimeout = null;

Template.header.events({
    // FLIP ALL TILES BUTTON
    'click .viewButton': function(e) {
        e.preventDefault();
        $(e.target).toggleClass('active');

        flipTiles();
    },
    // BOOKMARK BUTTON
    'click .sidebarButton': function(e){
        e.preventDefault();

        if($(e.currentTarget).hasClass('active'))
            Session.set('showLeftsidebar',false);
        else
            Session.set('showLeftsidebar',true);
    },
    // SEARCH INPUT
    'keyup #search': function(e) {
        var $input = $(e.currentTarget);
        var value = $input.val();
        // clearTimeout(searchKeyTimeout);

        // -> START SEARCH
        if(e.keyCode === 13 && Session.get('newsPath') !== value){

            // highlight the input text
            $input.addClass('highlight');
            setTimeout(function(){ $input.removeClass('highlight'); },200);

            Meteor.Router.to(encodeNewsPath(value)); //_.slugify(result)

        // -> SHOW TOPICS
        } else {
            // searchKeyTimeout = setTimeout(function() {

                // var topics = Search.getClustersFor(value);

                // console.log('SHOW TOPICS FOR: '+ value);
                // show topics under the header bar

            // },100);   
        }
    }
});


// HELPERS
Template.header.currentNewsPath = function() {
    return Session.get('newsPath');
};
Template.header.slideDown = function() {
    return (Session.get('showMessageBox')) ? ' slideDown' : '';
};
Template.header.sidebarButtonActive = function() {
    return (Session.get('showLeftsidebar')) ? ' active' : '';
};