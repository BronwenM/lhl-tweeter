/*
* Client-side JS logic goes here
* jQuery is already loaded
* Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/

//use regex to strip any html tags from the tweet text to prevent XSS
$(document).ready(function() {
  const noHTML = (str) => {
    const regex = /\<\/?[a-z]*\>/gm;

    return str.replaceAll(regex, '');
  };

  const createTweet = (tweetData) => {
    const timeagoFormatted = timeago.format(tweetData.created_at);

    const $newTweet = $(`
      <article class="tweet-container">
        <div class="tweet-user-info">
          <img src="${tweetData.user.avatars ? tweetData.user.avatars : './images/profile-hex.png'}" alt="placeholder profile image"/>
          <div class="tweet-username-container">
            <span class="tweet-display-username">${tweetData.user.name}</span>
            <span class="tweet-display-handle">${tweetData.user.handle}</span>
          </div>
        </div>
        <div class="tweet-content">
          <span class="tweet-text">${noHTML(tweetData.content.text)}</span>
          <div class="tweet-information">
            <span class="tweet-date-posted">${timeagoFormatted}</span>
            <div class="tweet-actions">
                <button type="button"><i class="fa-solid fa-retweet"></i></button>
                <button type="button"><i class="fa-solid fa-flag"></i></button>
                <button type="button"><i class="fa-regular fa-heart"></i></button>
            </div>
          </div>
        </div>
      </article>
    `);

    return $newTweet;
  };

  //takes the array of tweets and creates a newTweet obj to put at the top of the tweets section
  const renderAllTweets = (allTweets) => {
    for (const tweet of allTweets) {
      const $singleTweet = createTweet(tweet);
      $('#tweets').prepend($singleTweet);
    }
  };

  //calls a get to load all the tweets in /tweets endpoint
  const loadTweets = () => {
    $.get('/tweets', function(data) {
      //clear the tweets section briefly to avoid repetitions (entire set of tweets getting prepended again)
      $('#tweets').empty();
      renderAllTweets(data);
    })
      .fail(function() {
        console.error('An error occurred while fetching tweets.');
      });
  };

  loadTweets();

  //handle the click event to close the new tweet warning modal (no content or too long alert)
  $('.tweet-warning button').on('click', function() {
    $('.tweet-warning').css({ opacity: 0 });

    setTimeout(function() {
      $('.tweet-warning').css({ display: "none" });
    }, 300);
  });

  //create a new tweet on form submission
  $('#create-tweet').on('submit', function(event) {
    event.preventDefault();

    const tweetContent = noHTML($(this).find('textarea').val().trim());
    const serializedData = $(this).serialize();

    //check that the form field actually has content before allowing it to post
    if (!tweetContent) {
      $('.tweet-warning span').text('There\'s nothing there!');
      $('.tweet-warning').css({ display: "flex", opacity: 1 });
    } else if (tweetContent.length > 140) {
      $('.tweet-warning span').text('Your Tweet is too long!');
      $('.tweet-warning').css({ display: "flex", opacity: 1 });
    } else {
      $.post('/tweets', serializedData, () => {
        $(this).find('textarea').val('');
        $('.tweet-output output').val('140');

        $('.tweet-warning').css({ opacity: 0 });
        
        setTimeout(function() {
          $('.tweet-warning').css({ display: "none" });
        }, 300);

        loadTweets();
      });
    }
  });

  //bool is the create tweet section hidden?
  let newTweetIsHidden = true;

  //check if the create tweet section is hidden, then transform the create tweet and tweets sections. also transform the nav-cta
  const openCloseNewTweet = (isHidden) => {

    if (!isHidden) {
      $('.new-tweet').css({ opacity: 1, transform: 'translateY(0)' });
      $('#tweets').css({ transform: 'translateY(0)' });
      $('#create-tweet textarea').trigger('focus');
      $('.nav-cta i').css({ transform: 'rotate(-180deg)' });
      $('.nav-cta span').html('<b>Just Browse</b> the timeline');

      newTweetIsHidden = true;

    } else {
      $('.new-tweet').css({ opacity: 0, transform: 'translateY(-220px)' });
      $('#tweets').css({ transform: 'translateY(-220px)' });
      $('.nav-cta i').css({ transform: 'rotate(0)' });
      $('.nav-cta span').html('<b>Write</b> a new tweet');

      newTweetIsHidden = false;
    }

  };

  openCloseNewTweet(newTweetIsHidden);

  $('.nav-cta').on('click', function() {
    openCloseNewTweet(newTweetIsHidden);

    //this works but I find openCloseNewTweet looks better ¯\_(ツ)_/¯
    /* if (newTweetIsHidden) {
      $('.new-tweet').slideUp("slow")
      newTweetIsHidden = false;

    } else {
      $('.new-tweet').slideDown("slow")
      $('#create-tweet textarea').trigger('focus')
      newTweetIsHidden = true;
    } */
  });
});