var socialApp = {

    init: function() {
        socialApp.activeTab();
        socialApp.clipHeader();
        socialApp.getProfile();
        socialApp.getPosts();
        socialApp.callModal();
    },

    activeTab: function() {
        // highlight active tab
        $('#post-tab').addClass('active-tab');
        $('.content-tab ul li a').click(function() {
            $('.content-tab ul li.active-tab').removeClass('active-tab');
            $(this).closest('li').addClass('active-tab');
            return false;
        });
    },

    clipHeader: function() {
        $(window).scroll(function() {
            $('.header-below').fadeIn('fast');
            if ($(window).scrollTop() == 0) {
                $('.header-below').fadeOut('fast');
            }
        });
    },

    getProfile: function() {
        $.getJSON('data/profile.json', function(data) {
            var avatarImg = '<img src="' + data.avatar + '">';
            var headerAvatar = '<a class="profilemenu" href="#">' + avatarImg +
                '<span id="profile-caret" class = "sprite-main sprite-caret-down"></span></a>';
            $('.profile-avatar').prepend(headerAvatar);
            $('.settings-profile-pic').append(avatarImg);

            socialApp.updateSettings(data);
        });
    },

    getPosts: function() {
        $.getJSON("data/posts.json", function(data) {
            // console.log(data)
            socialApp.loadAllPosts(data);
        })
    },

    loadAllPosts: function(data) {
        // load posts
        $.each(data, function(i, item) {
            var postTmpl = '<div class="posts"><div class="post-icons"><ul> ' +
                '<a href="#"><li class="sprite-main sprite-reply-icon"></li></a>' +
                '<a href="#"> <li class="sprite-main sprite-like-icon"></li></a>' +
                '<li class="post-time"> ' +
                item.time + '</li></ul></div>' +
                '<div class="post-pic">' +
                '<img src="' + item.avatar + '"> </div>' +
                '<div class="post-msg-wrapper"> <div class="post-name"> ' +
                item.name + '</div> <div class = "post-msg" >' +
                item.msg +
                '</div> </div>';
            $('.all-posts').append(postTmpl);

            // add link to expand comments
            if (item.comments) {
                var addExpandLink = '<div class = "comments-text"> <a class="expand" href = "#"> Expand' +
                    '<span class = "sprite-main sprite-caret-down"> </span></a></div>';
                $('.post-msg-wrapper').append(addExpandLink);
                socialApp.expandComments();

                // insert comments
                $.each(item.comments, function(i, comment) {
                    var commentTmpl = '<div class="comments"><div class="post-icons"><ul> ' +
                        '<a href="#"><li class="sprite-main sprite-reply-icon"></li></a>' +
                        '<a href="#"> <li class="sprite-main sprite-like-icon"></li></a>' +
                        '<li class="post-time"> ' +
                        comment.time + '</li></ul></div>' +
                        '<div class="post-pic">' +
                        '<img src="' + comment.avatar + '"> </div>' +
                        '<div class="post-msg-wrapper"> <div class="post-name"> ' +
                        comment.name + '</div> <div class = "post-msg" >' +
                        comment.msg +
                        '</div> </div>';
                    var addComments = $('.comments-wrapper').append(commentTmpl);
                    $('.all-posts').append(addComments);

                });
            }

            // insert images
            if (item.images) {
                $.each(item.images, function(i, item) {
                    var postImg = '<a href="#" class="img-large"><img src="' + item.image + '"></a>';
                    var imageTmpl = '<div class="image-post">' + postImg + '</div>';
                    var addImage = $('.image-post-wrapper').append(imageTmpl);
                    $('.all-posts').append(addImage);
                    socialApp.imageModal(postImg, postTmpl);
                });
            }
        });

    },

    expandComments: function() {
        var expand = '<a id="expand" href = "#"> Expand <span class = "sprite-main sprite-caret-down"> </span></a>';
        // var collapse = '<a id="collapse" href = "#"> Collapse <span class = "sprite-main sprite-caret-up"> </span></a>';
        var replyDiv = $('<div class="reply-comment"><input type="text" placeholder="Reply..." class="reply"></div>');
        var commentText = $('.comments-text');


        $('.comments-text a').click(function() {
            if ($(this).hasClass('expand')) {
                $(this).removeClass('expand').addClass('collapse');
                $('.comments-wrapper').show()

                if(!$('#reply-wrapper').length) {
                    $('.comments-wrapper').append('<div id="reply-wrapper"></div>');
                    $('#reply-wrapper').html(replyDiv);
                }

                $('.sprite-main').removeClass('sprite-caret-down').addClass('sprite-caret-up')
            } else {
                $(this).removeClass('collapse').addClass('expand');
                $('.sprite-main').removeClass('sprite-caret-up').addClass('sprite-caret-down')
                $('.comments-wrapper').hide();
            }
            return false;
        });
    },

    callModal: function() {
        $('.chat-icon a').click(function(e) {
            socialApp.insertModal();
            e.preventDefault();
        });
    },

    insertModal: function() {
        $.get('partial/modal.html', function(data) {
            $('html, body').scrollTop(0);
            $('.container, footer').addClass('blur');
            $('#modal-wrapper').append(data);
            socialApp.removeModal();
        });
    },

    removeModal: function() {
        $('.close-modal').on('click', function(e) {
            $('#modal-wrapper').empty();
            $('.container, footer').removeClass('blur');
            e.preventDefault();
        });
    },

    imageModal: function(img, postTmpl) {
        $('.img-large').on('click', function(e) {
            $('html, body').scrollTop(0);
            $('.container, footer').addClass('blur');
            $('#img-wrapper')
                .html('<div class="img-bg"><div class="img-content">' + img + '</div></div>');
            $('.post-details').append(postTmpl);
            e.preventDefault();
        });
    },

    updateSettings: function(data) {

        // prepopulate name and email
        $('#settings-name').val(data.name);
        $('#settings-email').val(data.email);
        $('#settings-pswd').val(data.pswd);


        // change background if password is more than 6 characters
        $('#settings-pswd').on('keypress', socialApp.pswdValidation)

        // reset page on saving
        $('#resetPage').click(function() {
            socialApp.settingsReset();
        });

        socialApp.changePswd();
        socialApp.toggleSettings();
    },

    pswdValidation: function() {
        var settingsPswd = '#settings-pswd';
        var pswdVal = $(settingsPswd).val();
        if (pswdVal.length >= 5) {
            $(this).addClass('validPswd');
            $(this).prev('#pswdIcon')
                .removeClass('sprite-pswd-icon')
                .addClass('sprite-pswd-success-icon');
        }
    },

    settingsReset: function() {
        $('#settings-pswd')
            .removeClass('validPswd sprite-pswd-success-icon')
            .addClass('sprite-pswd-icon');
    },

    changePswd: function() {
        $('#changePswd').click(function(e) {
            $('#settings-pswd').prop('disabled', false);
            $('#settings-pswd').val('').focus();
            e.preventDefault();
        });
    },

    toggleSettings: function() {
        // toggle notifications
        $('.settings-notifications span').click(function() {
            if ($(this).hasClass('sprite-toggle-on')) {
                $(this)
                    .removeClass('sprite-toggle-on')
                    .addClass('sprite-toggle-off')
            } else {
                $(this)
                    .removeClass('sprite-toggle-off')
                    .addClass('sprite-toggle-on')
            }
        });

        // toggle privacy
        $('.settings-privacy span').click(function() {
            if ($(this).hasClass('sprite-privacy-on')) {
                $(this)
                    .removeClass('sprite-privacy-on')
                    .addClass('sprite-privacy-off')
            } else {
                $(this)
                    .removeClass('sprite-privacy-off')
                    .addClass('sprite-privacy-on')
            }
        });

    }

};

$(document).ready(function() {
    socialApp.init();
});
