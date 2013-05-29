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
        
        if($(e.currentTarget).hasClass('active'))
            Session.set('viewType','read');
        else
            Session.set('viewType','navigate');
    },
    // BOOKMARK BUTTON
    'click .sidebarButton': function(e){
        e.preventDefault();

        if($(e.currentTarget).hasClass('active'))
            Session.set('showLeftsidebar',false);
        else
            Session.set('showLeftsidebar',true);
    },
    // RELOAD BUTTON
    'click #reloadButton': function(e) {
        $input = $('#search');

        $input.addClass('highlight');
        setTimeout(function(){
            $input.removeClass('highlight');
            RELOAD = true;
            Meteor.Router.to(encodeNewsPath($input.val()));
        },200);
    },
    // HOME BUTTON
    'click .homeButton': function(){
        Meteor.Router.to(encodeNewsPath(''));
    },
    // SEARCH INPUT
    'keypress #search': function(e) {
        var $input = $(e.currentTarget);
        var value = $input.val();
        // clearTimeout(searchKeyTimeout);

        // -> START SEARCH
        if(e.keyCode === 13 && NEWSPATH !== value){

            // highlight the input text
            $input.addClass('highlight');
            setTimeout(function(){
                $input.removeClass('highlight');
                Meteor.Router.to(encodeNewsPath(value)); //_.slugify(result)
            },200);

        // -> SHOW TOPICS
        } else {
            // searchKeyTimeout = setTimeout(function() {

                // var topics = Search.getClustersFor(value);

                // console.log('SHOW TOPICS FOR: '+ value);
                // show topics under the header bar

            // },100);   
        }
    },
    'submit form.search': function(e){
        e.preventDefault();
    }
});

// SHOW/HIDE SIDEBAR
Deps.autorun(function() {
    if(Session.equals('showLeftsidebar', true)) {
        $('#contentWrapper').addClass('slideRight');
    } else {
        $('#contentWrapper').removeClass('slideRight');
    }
});

// SHOW/HIDE MESSAGEBOX
Deps.autorun(function() {
    if(Session.equals('showMessageBox', true)) {
        $('#contentWrapper, #mainGrid').addClass('slideDown');
    } else {
        $('#contentWrapper, #mainGrid').removeClass('slideDown');
    }
});


// FLIP TILES
Deps.autorun(function() {
    var countLeft = {count:0};
    var countRight = {count:0};


    // if(VIEWTYPE === 'read') {
    //     $('.tile').removeClass('flip');
    // } else {
    //     $('.tile').addClass('flip');
    // }

    flipTiles = function(container,number,viewType){
        if(viewType === 'read') {
            $($(container + ' .tile')[number.count]).removeClass('flip');
        } else {
            $($(container + ' .tile')[number.count]).addClass('flip');
        }
        number.count++;
        if(number.count <= $(container + ' .tile').length) {
            setTimeout(function(){
                flipTiles(container,number,viewType);
            }, 50);
        }
    };
    

    flipTiles('#mainGrid > .containerLeft', countLeft, Session.get('viewType'));
    flipTiles('#mainGrid > .containerRight', countRight, Session.get('viewType'));
});


// HELPERS
Template.header.currentNewsPath = function() {
    return NEWSPATH;
};
Template.header.slideDown = function() {
    return (Session.equals('showMessageBox',true)) ? ' slideDown' : '';
};
Template.header.slideRight = function() {
    return (Session.equals('showLeftsidebar',true)) ? ' slideRight' : '';
};
Template.header.sidebarButtonActive = function() {
    return (Session.equals('showLeftsidebar',true)) ? ' active' : '';
};
Template.header.viewButtonActive = function() {
    return (Session.equals('viewType','navigate')) ? ' active' : '';
};
Template.header.homeButtonActive = function() {
    return (Session.equals('activateHomeButton',true)) ? ' active' : '';
};