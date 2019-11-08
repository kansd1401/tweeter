const renderTweets = function(tweets) {
// loops through tweets
  for (let user = tweets.length - 1; user >= 0; user--) {
    // calls createTweetElement for each tweet
    const $tweet = createTweetElement(tweets[user]);
    // takes return value and appends it to the tweets container
    $('.new-tweet').append($tweet);
  }
};

//If the user submits scripts it makes them safe
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//Creates a article tag attachs html to it and returns it
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

//loads tweets from the server side and calls renderTweets function with the data
const loadTweets = () => {
  $.ajax({url: '/tweets'})
    .then((res) => {
      renderTweets(res);
    })
    .fail(() => {
      console.log('Server down')
    });
};

//toggle warning for posting a new tweet that doesn't follow rules
const warn = () => {$(".warning").slideDown();};
const warnHide = () => {$(".warning").slideUp();};

//Posts the event data when tweet is clicked and checks if the input follows rules or not
const postTweet = function(event) {
  event.preventDefault();
  const data = $(this).serialize();
  const $content = $("#input").val();
  if ($content.length > 140) {
    $('.warningText').text('You are exceeding the charachter limit!');
    warn();
  } else if ($content.length === 0) {
    $('.warningText').text('You are posting an empty tweet!');
    warn();
  } else {
    //posts with ajax and hides the warning if it was triggered
    warnHide();
    $.ajax({
      type: 'POST',
      url: '/tweets',
      data: data})
      .then(()=> {
        $("#input").val('');
        $('.new-tweet').empty();
        $('#counter').text(140);
        loadTweets();
      });
  }
};

//custom function increasing textarea(input) for posting new tweets so they just increase in height according to the length instead of adding a scroll bar
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
  //hides my warning,icon(scroll to top) and posttweet when page is loaded
  $("#new-post").animate({'margin-top': "-240px"});
  $('#backUp').hide();
  let hidden = true;
  warnHide();
  //loads tweet
  loadTweets();
  //if not scrolled to the top shows my scroll to top icon
  $(window).scroll(() => {
    if ($(window).scrollTop() === 0) {
      $("#backUp").hide();
    } else {
      $('#backUp').show();
    }
  });
  //clicking on the scrollToTop scrolls it to top
  $('#backUp').click(() => {
    $("html").animate({ scrollTop: 0 },);
  });
  //Pressing enter key in textarea also posts but shift+enter doesn't
  $("#input").keypress(function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      $('#new-post').submit();
    }
  });
  //listening for submit on the tweet key
  $('#new-post').submit(postTweet);
  //Toggles the new tweet from hiding and showing
  $('#show-post').click(() => {
    if (hidden) {
      $("#new-post").animate({'margin-top': "00px"});
      $("#input").focus();
      warnHide();
      hidden = false;
    } else {
      $("#new-post").animate({'margin-top': "-240px"});
      $("#input").val('');
      warnHide();
      hidden = true;
    }
  });
});
