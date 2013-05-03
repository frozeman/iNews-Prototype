// RENDERED
Template.header.rendered = function() {


    // SEARCH INPUT
    $('.pathMenu input').on('keyup',function(e){
        var $input = $(this);

        // clear on ESC
        if(e.keyCode == 27)
            $input.val('');

        if($input.val() !== '')
            $input.next('button.cancel').removeClass('hidden');
            // $input.next('button.cancel').css('display','inline-block');
        else
            $input.next('button.cancel').addClass('hidden');
            // $input.next('button.cancel').css('display','none');
    });
    $('.pathMenu button.cancel').click(function(){
        $(this).prev('input').val('').trigger('keyup').trigger('focus');
    });


    // SHOW/HIDE LEFT SIDEBAR BY SWIPE
    // var $slideElementsHammer = $('.mainGrid').hammer({swipe_velocity: 0.2});
    // $slideElementsHammer.on("swipeleft", function(e) {
    //     $slideElements.removeClass('slideRight');
    //     $('.bookmarkButton').removeClass('active');
    // });
    // $slideElementsHammer.on("swiperight", function(e) {
    //     $slideElements.addClass('slideRight');
    //     $('.bookmarkButton').addClass('active');
    // });

};


// EVENTS
Template.header.events({
    // FLIP ALL TILES BUTTON
    'click .viewButton': function(e) {
        e.preventDefault();
        $(e.target).toggleClass('active');

        flipTiles();
    },
    // BOOKMARK BUTTON
    'click .bookmarkButton': function(e){
        e.preventDefault();

        var $bookmarkButton = $(e.currentTarget);

        // show/hide sidebar
        // if($bookmarkButton.hasClass('active'))
        //     $('.leftSidebar').hide();
        // else
        //     $('.leftSidebar').show();

        $('.leftSidebar').show();

        $('.mainGrid, .mainGrid > .divider, header.main, footer.main').toggleClass('slideRight');
        $bookmarkButton.toggleClass('active');
    }
});