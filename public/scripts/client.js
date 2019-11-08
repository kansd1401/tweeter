/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const renderTweets = function(tweets) {
// loops through tweets
  for (let user = tweets.length-1;user >= 0;user--) {
    // calls createTweetElement for each tweet
    const $tweet = createTweetElement(tweets[user]);
    // takes return value and appends it to the tweets container
    $('.new-tweet').append($tweet);
  }
};

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = (tweetData) => {
  const $tweet = $("<article>").addClass("tweet");
  const safeHtml = escape(tweetData.content.text);
  const timeStamp = moment(tweetData.created_at).fromNow();
  const markup = `
        <header>
          <img class="avatar" src="${tweetData.user.avatars}">
          <div class="userName">${tweetData.user.name}</div>
          <div class="userId">${tweetData.user.handle}</div>
        </header>
        <div class="content">${safeHtml}</div>
        <footer> 
          <div class="life">${timeStamp}</div>
          <div class="shortcuts">
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
          </div></footer>
        `;
  $($tweet).append(markup);
  return $tweet;
};

const loadTweets = () => {
  $.ajax({url: '/tweets'})
    .then((res) => {
      renderTweets(res);
    })
    .fail(() => {
      console.log('dont work');
    });
};

const warn = () => {
  $(".warning").slideToggle();
};

$(document)
  .one('focus.autoExpand', 'textarea.autoExpand', function() {
    let savedValue = this.value;
    this.value = '';
    this.baseScrollHeight = this.scrollHeight;
    this.value = savedValue;
  })
  .on('input.autoExpand', 'textarea.autoExpand', function() {
    let minRows = this.getAttribute('data-min-rows') | 0, rows;
    this.rows = minRows;
    rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
    this.rows = minRows + rows;
});

//When pages loaded starts working on the script
$(() => {
  $("#new-post").animate({'margin-top': "-240px"});
  loadTweets();
  warn();
  $('#backUp').hide();
  let hidden = true;
  $(window).scroll(() => {
    if($(window).scrollTop() === 0) {
      $("#backUp").hide();
    }else{
      $('#backUp').show();
    }
  });
  $('#backUp').click(() => {
    $("html").animate({ scrollTop: 0 },);
  });
  $('#new-post').submit(function(event) {
    event.preventDefault();
    const data = $(this).serialize();
    const $content = $("#input").val();
    if ($content.length > 140) {
      warn();
      setTimeout(warn,3000);
    } else if ($content.length === 0) {
      warn();
      setTimeout(warn,3000);
    } else {
      $.ajax({
        type: 'POST',
        url: '/tweets',
        data: data})
        .then(()=> {
          $("#input").val('');
          $('.new-tweet').empty();
          loadTweets();
        });
    }
  });
  $('#show-post').click(() => {
    if (hidden) {
      $("#new-post").animate({'margin-top': "00px"});
      $("#input").focus();
      hidden = false;
    } else {
      $("#new-post").animate({'margin-top': "-240px"});
      $("#input").val('');
      hidden = true;
    }
  });
});
