class textFormat {
  constructor(text) {

  }

  create(text) {
    return ((text || ""))  // make sure it is a string;
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\t/g, "    ")
      .replace(/ /g, "&#8203;&nbsp;&#8203;")
      .replace(/\r\n|\r|\n/g, "<br />");
  }
}

module.exports = textFormat;