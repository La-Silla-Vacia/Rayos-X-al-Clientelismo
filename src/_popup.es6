const $ = require('jquery');
const FormatText = require('./_textFormat.es6');

const formatText = new FormatText();

class popup {
  constructor() {
    this.open = false;
    this.contentBox = $('.content');
    this.contentInner = $('.content__inner');
  }

  create(data) {
    const contentWidth = $('.container').width() * 0.6;
    // console.
    const formattedText = formatText.create(data);

    this.contentInner.css({ width: `${contentWidth}px` });
    this.contentInner.html(formattedText);
    this.contentBox.removeClass('content--hidden');

    this.open = false;
  }

  close() {
    this.contentInner.empty();
    this.contentBox.addClass('content--hidden');
  }

}

module.exports = popup;
