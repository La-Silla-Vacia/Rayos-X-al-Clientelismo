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
    let formattedText = formatText.create(data);

    if (!formattedText) formattedText = "<h3>No hay contenido disponible en este momento.</h3>";

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
