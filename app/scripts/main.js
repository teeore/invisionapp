var socialApp = {

    init: function() {
        socialApp.getProfile();
        socialApp.getPosts();
        socialApp.callModal();
    },

    getProfile: function() {
        $.getJSON('data/profile.json', function(data) {
            var avatarImg = '<img src="' + data.avatar + '">';
            var headerAvatar = '<a class="profilemenu" href="#">' + avatarImg + '</a>' +
                '<span class = "sprite-main sprite-caret-down"></span>';
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
                var addExpandLink = '<div class = "comments-text"> <a href = "#"> Expand' +
                    '<span class = "sprite-main sprite-caret-down"> </span></a>' +
                    '</div>';
                $('.posts').append(addExpandLink);
                socialApp.showComments();

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
                    var imageTmpl = '<div class="image-post"><img src="' + item.image + '"></div>';
                    var addImage = $('.image-post-wrapper').append(imageTmpl);
                    $('.all-posts').append(addImage);
                });
            }
        });
    },

    showComments: function() {
        var comments = $('.comments-wrapper');
        var replyDiv = '<div class="reply-comment"><input type="text" placeholder="Reply..." class="reply"></div>';

        $('.comments-text a').on('click', function(e) {
            e.preventDefault();
            // $(comments).toggle(function(){
            //     $(replyDiv).show();
            // },
            // function() {
            //     $(replyDiv).hide();
            // });
            $(comments).toggle(function() {
                if ($(comments).length) {
                    if ($(replyDiv.length === 0)) {
                        $(comments).append(replyDiv);
                    }
                }
            });

        });
    },

    callModal: function() {
        $('.chat-icon a').click(function(e) {
            $('html, body').scrollTop(0);
            $('.container, footer').addClass('blur');
            $('.modal, .modal-dialog').show();
            e.preventDefault();
        });
        $('.close-modal').on('click', function(e) {
            $('.container, footer').removeClass('blur');
            $('.modal, .modal-dialog').hide();
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
