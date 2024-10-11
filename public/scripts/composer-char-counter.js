$(document).ready(function() {
  console.log('Doc Ready');

  $('#tweet-text').on('input', function() {
    const textCounter = $(`output[for='${this.id}']`);
    //target the output tag with for attr of this.id and set it to 140 minus string length
    textCounter.text(140 - this.value.length);

    //check if the content of the textCounter is less than 0 (over 140) and add a class that changes to red if so
    if (textCounter.text() < 0) {
      textCounter.addClass('over-limit');
    } else if (textCounter.hasClass('over-limit')) {
      textCounter.removeClass('over-limit');
    }
  });
});