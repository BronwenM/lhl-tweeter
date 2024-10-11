/*
* Client-side JS logic goes here
* jQuery is already loaded
* Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/

$(document).ready(function () {
  const noHTML = (str) => {
    const regex = /\<\/?[a-z]*\>/gm;
  
    return str.replaceAll(regex, '')
  }

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
  }

  const renderAllTweets = (allTweets) => {
    for(const tweet of allTweets) {
      const $singleTweet = createTweet(tweet);
      $('#tweets').prepend($singleTweet);
    }
  }

  const loadTweets = () => {
    $.get('/tweets', function(data) {  
      renderAllTweets(data);
    })
    .fail(function() {
      console.error('An error occurred while fetching tweets.');
    });
  }

  loadTweets();

  $('.tweet-warning button').on('click', function(){
    $('.tweet-warning').css({opacity: 0});

    setTimeout(function(){ $('.tweet-warning').css({display: "none"}) }, 300);
  })

  $('#create-tweet').on('submit', function(event) {
    event.preventDefault();
    const tweetContent = noHTML($(this).find('textarea').val().trim());
    const serializedData = $(this).serialize();
    console.log('this:', $(this));
    console.log('tweetContent:', tweetContent)
    console.log('serializedData:', serializedData)

    if(!tweetContent) {
      $('.tweet-warning span').text('There\'s nothing there!');
      $('.tweet-warning').css({display: "flex", opacity: 1});
    } else if( tweetContent.length > 140) {
      $('.tweet-warning span').text('Your Tweet is too long!');
      $('.tweet-warning').css({display: "flex", opacity: 1});
    } else {
      $.post('/tweets', serializedData, () => {
        $(this).find('textarea').val('');
        $('.tweet-warning').css({opacity: 0});
        setTimeout(function(){ $('.tweet-warning').css({display: "none"}) }, 300);
        loadTweets();
      });
    }
  })

  let newTweetIsHidden = true;

  const openCloseNewTweet = (isHidden) => {

      if(!isHidden) {
        $('.new-tweet').css({opacity: 1, transform: 'translateY(0)'});
        $('#tweets').css({transform: 'translateY(0)'})

        $('.nav-cta i').css({transform: 'rotate(0)'});
        $('.nav-cta span').html('<b>Browse</b> the timeline');
        newTweetIsHidden = true;
  
      } else {
        $('.new-tweet').css({opacity: 0, transform: 'translateY(-220px)'});
        $('#tweets').css({transform: 'translateY(-220px)'})
        $('.nav-cta i').css({transform: 'rotate(-180deg)'});
        $('.nav-cta span').html('<b>Write</b> a new tweet');
        newTweetIsHidden = false;
      }
    
  }
  
  openCloseNewTweet(newTweetIsHidden);

  $('.nav-cta').on('click', function(){
        openCloseNewTweet(newTweetIsHidden);
  })
})