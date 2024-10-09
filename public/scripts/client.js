/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {

  const data = [
    {
      "user": {
        "name": "Newton",
        "avatars": "https://i.imgur.com/73hZDYK.png"
        ,
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": "https://i.imgur.com/nlhLi3I.png",
        "handle": "@rd" },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    }
  ]

  const createTweet = (tweetData) => {
    const $newTweet = $(`
      <article class="tweet-container">
        <div class="tweet-user-info">
          <img src="./images/profile-hex.png" alt="placeholder profile image"/>
          <div class="tweet-username-container">
            <span class="tweet-display-username">${tweetData.user.name}</span>
            <span class="tweet-display-handle">${tweetData.user.handle}</span>
          </div>
        </div>
        <div class="tweet-content">
          <span class="tweet-text">${tweetData.content.text}</span>
          <div class="tweet-information">
            <span class="tweet-date-posted">${tweetData.created_at}</span>
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
      $('#tweets').append($singleTweet);
    }
  }

  renderAllTweets(data);

  $('.create-tweet').on('submit', function (event) {
    event.preventDefault();
    const serializedData = this.serialize();

    // console.log(serializedData)

    const postTweet = $.post('/tweets', serializedData);

    postTweet.done(function (data) {
      const tweetFeed = $('.tweets');

    })
  })
})