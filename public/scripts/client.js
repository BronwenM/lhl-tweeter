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


  $('#create-tweet').on('submit', function(event) {
    event.preventDefault();
    const tweetContent = noHTML($(this).find('textarea').val().trim());
    const serializedData = $(this).serialize();
    console.log('this:', $(this));
    console.log('tweetContent:', tweetContent)
    console.log('serializedData:', serializedData)

    if(!tweetContent) {
      alert("There's nothing here!");
    } else if( tweetContent.length > 140) {
      alert('Your tweet is too long!');
    } else {
      $.post('/tweets', serializedData, () => {
        $(this).find('textarea').val('');
        loadTweets();
      });
    }
  })
})