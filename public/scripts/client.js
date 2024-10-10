/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
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
          <span class="tweet-text">${tweetData.content.text}</span>
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
  }

  loadTweets();

  $('.create-tweet').on('submit', function (event) {
    event.preventDefault();
    const serializedData = this.serialize();

    // console.log(serializedData)

    $.post('/tweets', serializedData, function(data) {
      renderAllTweets(data);
    });
  })
})