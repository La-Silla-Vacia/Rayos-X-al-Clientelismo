const $ = require('jquery');
const FormatText = require('./_textFormat.es6');
const formatText = new FormatText();

class popup {
  constructor() {
    this.open = false;

    this.watchCloseButton();
  }

  create(data) {
    const contentWidth = $('.container').width() * 0.6;

    const contentBox = $('.content');
    const contentInner = $('.content__inner');
    // console.
    data = formatText.create(data);

    contentInner.css({width: contentWidth + 'px'});
    contentInner.html(data);
    contentBox.removeClass('content--hidden');

    this.open = false;
  }

  close() {
    const contentBox = $('.content')
    const contentInner = $('.content__inner');
    contentInner.empty();
    contentBox.addClass('content--hidden');
  }

  watchCloseButton() {

  }

}

module.exports = popup;