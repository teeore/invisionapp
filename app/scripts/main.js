var socialApp = {

    init: function() {
        socialApp.getPosts();
        socialApp.callModal();
    },

    getPosts: function() {
        $.getJSON("data/posts.json", function(data) {
            console.log(data)

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
                    // $('.comments:last-child').insertAfter('<div class="reply-comment"><input type="text" placeholder="Reply..." class="reply"></div>')
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
        $('.comments-text a').on('click', function(e){
            $('.comments-wrapper').toggle();
            e.preventDefault();
        });
    },

    callModal: function() {

    }

};

$(document).ready(function() {
    socialApp.init();
});
