//@codekit-prepend "vendor/!!mootools-core-1.4.5.js";
//@codekit-prepend "vendor/!!mootools-more-1.4.0.1.js";
//@codekit-prepend "vendor/!!async.js";

//@codekit-prepend "vendor/jquery.requestAnimationFrame.min.js", "vendor/plugins/jquery.masonry.js", "vendor/plugins/jquery.easing.1.3.js", "vendor/plugins/jquery.hammer.min.js";


// new PlaceholderSupport();




$(function(){

    // VARS
    var ISMOBILE = (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) ? true : false,
        CURRENTDETAILTILE = false,
        VIEWTYPE = 'read',
        HOVERTIMOUT = (ISMOBILE) ? 0 : 300,
        RESIZETIMEOUTID,
        RESIZETIMOUT = (ISMOBILE) ? 1 : 99,
        GRIDANIMATE = (ISMOBILE) ? false : true,
        $VIEWPORT = $('html, body');
        // scrollWindow = new Fx.Scroll(window);


    // HELPER FUNCTIONS
    // Calculate the smallest Tile
    var TileSize = function(containerWidth) {
        var dividerWidth = ($('.mainGrid').width() <= 480) ? 30 : 60;
        containerWidth = $('.mainGrid').width() - dividerWidth; // DEACTIVATE ??
        var division = 1;
        if(containerWidth > 768) division = 2;
        if(containerWidth > 1600) division = 4;
        // division = (containerWidth > 1200) ? 3 : division;
        var containerSize = Math.floor(containerWidth / 2);
        while(containerSize%16 !== 0) {
            containerSize--;
        }

        return containerSize / (division * 4);
    };

    var matrixToArray = function(matrix) {
        if(matrix !== 'none')
            return matrix.substr(7, matrix.length - 8).split(', ');
        else
            return [];
    };

    // Stop the window scrolling if the user scrolls.
    $VIEWPORT.bind('scroll mousedown DOMMouseScroll mousewheel keyup', function(e){
        if ( e.which > 0 || e.which < 0 || e.type === 'mousedown' || e.type === 'mousewheel')
            $VIEWPORT.stop();
    });

    // debulked onresize handler
    // function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,100)};return c};


    var flipTiles = function(){
        var countLeft = {count:0};
        var countRight = {count:0};


        // if(VIEWTYPE === 'read') {
        //     $('.tile').removeClass('flip');
        // } else {
        //     $('.tile').addClass('flip');
        // }

        function turn(container,number){
            if(VIEWTYPE === 'read') {
                $($(container + ' .tile')[number.count]).removeClass('flip');
            } else {
                $($(container + ' .tile')[number.count]).addClass('flip');
            }
            number.count++;
            if(number.count <= $(container + ' .tile').length) {
                window.setTimeout(function(){
                    turn(container,number);
                }, 0);
            }
        }

        VIEWTYPE = (VIEWTYPE === 'topic') ? 'read' : 'topic';

        turn('.mainGrid > .containerLeft',countLeft);
        turn('.mainGrid > .containerRight',countRight);
    };




    // DOM READY
    $(document).ready(function(){

        // $.fn.masonry.prototype.layout = function($bricks, callback) {
        //     // Call the method from the parent = Super_class.prototype.method
        //     this.constructor.prototype.layout($bricks, callback);
        //     containerSize.height = containerSize.height + 20;
        //     console.log(containerSize);
        // };

        var oldcss = $.fn.masonry.layout;
        // ...before overwriting the jQuery extension point
        // $.fn.masonry.layout = function()
        // {
        //     // original behavior - use function.apply to preserve context
        //     var ret = oldcss.apply(this, arguments);

        //     console.log(containerSize);

        //     // preserve return value (probably the jQuery object...)
        //     return ret;
        // };


        // SET MASONRY
        $('.mainGrid > .containerLeft').masonry({
          isRTL: true,
          itemSelector: '.tile',
          columnWidth : TileSize,
          position: 'relative',
          isAnimated: GRIDANIMATE
        });
        $('.mainGrid > .containerRight').masonry({
          itemSelector: '.tile',
          columnWidth : TileSize,
          position: 'relative',
          isAnimated: GRIDANIMATE
        });


        // $('.mainGrid > .containerLeft, .mainGrid > .containerRight').masonry('reloadItems');

        $(window).trigger('resize');

        // BOOKMARK BUTTON
        var $slideElements = $('.mainGrid, .mainGrid > .divider, header.main, footer.main');
        $('.bookmarkButton').click(function(e){
            e.preventDefault();

            $slideElements.toggleClass('slideRight');
            $(this).toggleClass('active');
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


        // FLIP ALL TILES BUTTON
        $('.viewButton').click(function(e) {
            e.preventDefault();
            flipTiles();
            $(this).toggleClass('active');
        });

        // SEARCH INPUT
        $('.pathMenu input').on('keyup',function(e){
            var $input = $(this);

            // clear on ESC
            if(e.keyCode == 27)
                $input.val('');

            if($input.val() !== '')
                $input.next('button.cancel').css('display','inline-block');
            else
                $input.next('button.cancel').css('display','none');
        });
        $('.pathMenu button.cancel').mouseup(function(){
            $(this).prev('input').val('').trigger('keyup').trigger('focus');
        });

        // CENTER IMAGES
        $('.image img, .imageZoom img').each(function() {
            var img = $(this);
            if(img.parents('.image, .imageZoom')) {
                img.parents('.image, .imageZoom').css('background-image','url("' + img.attr('src') + '")');
                img.css('display','none');
            }
        });


        // add zoom to article images
        // $('article.main .image').each(function(){
        //     var img = $(this);
        //     var imgZom = $(this).next('.imageZoom');
        //     img.mousemove(function(e){
        //        var parentOffset = img.offset(); //parent()
        //        //or img.offset(); if you really just want the current element's offset
        //        var relY = -((e.pageY - parentOffset.top) - (e.target.offsetHeight/2));
        //        console.log(e.target.offsetHeight);

        //        // if(relX > 0) relX = 0;
        //        // if(relY > 0) relY = 0;

        //        // if(relX > 0) relX = 0;
        //        // if(relY > 0) relY = 0;

        //        if(relY <= 0)
        //            imgZom.css('background-position-y',relY);

        //        // console.log(relY);
        //     });
        // });


        // ATTACH EVENTS to TILES
        $('.mainGrid > div > .tile').each(function(){

            var $tile = $(this);
            var cornerButtonTimeOut;

            // SHOW DETAIL TILE
            // $tile.click(function(e) {

            //     // remove open detail tile first
            //     if(CURRENTDETAILTILE) {
            //         CURRENTDETAILTILE.fadeOut(400, function(){
            //             if($tile)
            //                 $tile.css('z-index','');
            //             $(this).remove();
            //         });
            //         CURRENTDETAILTILE = false;

            //     // then open the detail tile
            //     } else {
            //         var tile = $(e.target).parents('.tile')[0];
            //         if(tile) {
            //             var $tile = $(tile);
            //             var detailTile = $('<div class="tile large detail">' + $tile.html() + '</div>');
            //             $tile.append(detailTile);
            //             $tile.css('z-index',9999);

            //             // if its a top tile
            //             if($tile.position().top === 0)
            //                 detailTile.css('top',0);
            //             else
            //                 detailTile.css('bottom',0);

            //             // if its in the right side
            //             if($(e.target).parents('.containerRight')[0])
            //                 detailTile.css('right',0);
            //             else
            //                 detailTile.css('left',0);

            //             var tileSize = TileSize($(window).width());

            //             detailTile
            //                 .css({
            //                     'bottom': 0,
            //                     'width': tileSize * 4,
            //                     'height': tileSize * 4
            //                 })
            //                 .mouseleave(function(e) {
            //                     detailTile.fadeOut(400, function(){
            //                         $tile.css('z-index','');
            //                         $(this).remove();
            //                     });
            //                     CURRENTDETAILTILE = false;
            //                 })
            //                 .click(function(e){
            //                     e.stopPropagation();
            //                 });

            //             // SCROLL TO DETAIL TILE
            //             if(detailTile.offset().top < $(window).scrollTop())
            //                 $VIEWPORT.animate({scrollTop: detailTile.offset().top - tileSize / 4}, 500, 'easeOutExpo');
            //                 // scrollWindow.start(0,detailTile.offset().top - 20);

            //             CURRENTDETAILTILE = detailTile;
            //         }
            //     }
            // });

            $tile.find('a').click(function(e){
                e.preventDefault();
                // e.stopPropagation();
            });

            // flip back on mouseleave
            $tile.mouseleave(function(){
                if(VIEWTYPE === 'read')
                    $tile.css('z-index','').removeClass('flip');
                else
                    $tile.css('z-index','').addClass('flip');
            });

            // show front/back side
            $tile.find('a.cornerButton').mouseenter(function(e) {
                e.stopPropagation();

                cornerButtonTimeOut = setTimeout(function() {
                    $tile.css('z-index',9999);
                    $tile.toggleClass('flip');
                },HOVERTIMOUT);
            }).mouseleave(function(){
                clearTimeout(cornerButtonTimeOut);
            });

        });
    });


    // RESIZE
    $(window).resize(function() {

        // show the size in the top bar
        $('.pixelWidth').html('width: ' + $(window).width() + 'px');


        // set the font size automatically
        //Standard height, for which the body font size is correct
        // var preferredWidth = 768;

        // var displayWidth = $(window).width();
        // var percentage = displayWidth / preferredWidth;
        // var newFontSize = Math.floor(12 * percentage) - 1;
        // $('.tile').css('font-size', newFontSize);


        var visibleItem = false;
        // use the currently selected one
        if(CURRENTDETAILTILE)
            visibleItem = CURRENTDETAILTILE;
        // get the last visible tile
        else {
            var scrollPos = $(window).scrollTop();
            $('.mainGrid > div > .tile').each(function(index, item){
                item = $(item);
                if(scrollPos > 60 && scrollPos < item.offset().top) {
                    visibleItem = item;
                    return false;
                }
            });
        }


        // IF ARTICLE IS OPEN
        // $('body').css('overflow','hidden');


        // prevent imediate resize
        clearTimeout(RESIZETIMEOUTID);
        RESIZETIMEOUTID = window.setTimeout(function() {


            // set RESPONSIVE TILE SIZES
            var smallTile = TileSize($('.mainGrid').width() - 60);
            var mediumTile = smallTile * 2;
            var largeTile = smallTile * 4;

            // set grid size
            $('.mainGrid .tile.large').css({'width':largeTile,'height':largeTile});
            $('.mainGrid .tile.medium').css({'width':mediumTile,'height':mediumTile});
            $('.mainGrid .tile.small').css({'width':smallTile,'height':smallTile});

            // set article boxes size
            // $('article.main aside.left').css({'width':largeTile});

            // set subtiles size
            // var subsmallTile = TileSize(largeTile);
            // var submediumTile = subsmallTile * 2;
            // var sublargeTile = subsmallTile * 4;

            // $('.large .subTile.large').css({'width':sublargeTile,'height':sublargeTile});
            // $('.large .subTile.medium').css({'width':submediumTile,'height':submediumTile});
            // $('.large .subTile.small').css({'width':subsmallTile,'height':subsmallTile});

            // var subsmallTile = TileSize(mediumTile);
            // var submediumTile = subsmallTile * 2;
            // var sublargeTile = subsmallTile * 4;

            // $('.medium .subTile.large').css({'width':sublargeTile,'height':sublargeTile});
            // $('.medium .subTile.medium').css({'width':submediumTile,'height':submediumTile});
            // $('.medium .subTile.small').css({'width':subsmallTile,'height':subsmallTile});

            // var subsmallTile = TileSize(smallTile);
            // var submediumTile = subsmallTile * 2;
            // var sublargeTile = subsmallTile * 4;

            // $('.small .subTile.large').css({'width':sublargeTile,'height':sublargeTile});
            // $('.small .subTile.medium').css({'width':submediumTile,'height':submediumTile});
            // $('.small .subTile.small').css({'width':subsmallTile,'height':subsmallTile});

            // set the CONTAINER WIDTH
            // $('.gridContainer').css({
                // 'width': $(window).width()
            // });

            // SCROLL TO the LAST VISIBLE ITEM
            if(visibleItem) {
                window.setTimeout(function() {
                    // $VIEWPORT.animate({scrollTop: visibleItem.offset().top - smallTile}, 900, 'easeOutElastic');
                    // scrollWindow.start(0,visibleItem.offset().top);
                }, 500);
            }

        }, RESIZETIMOUT);

    });
});
