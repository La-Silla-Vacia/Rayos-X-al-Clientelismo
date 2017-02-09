/* eslint-env browser */
const $ = require('jquery');
const Handlebars = require('handlebars');
const Popup = require('./_popup.es6');
const c = require('./_config.es6');

const popup = new Popup();

class App {
  constructor() {
    this.container = $('.container');
    this.requestUrl = c.apiURL;
    this.spreadsheetPath = c.spreadsheetURL;

    this.departemento = App.findGetParameter('departemento');
    if (!this.departemento) this.departemento = 'Bogotá';

    this.a = this.departemento;
  }

  start() {
    this.getData((data) => {
      this.processData(data);
    });
  }

  getData(callback) {
    $.ajax({
      url: this.requestUrl,
      type: 'POST',
      data: `path=${this.spreadsheetPath}`,
      dataType: 'json',
      success: (data) => {
        if (callback) callback(data);
      },
      error: () => {
        $('#padrinos').html('Could not get the data. Please reload your browser window.');
      },
    });
  }

  processData(data) {
    const thisdata = [];

    for (let i = 0; i < data.length; i += 1) {
      const thisDepart = this.a.toLowerCase();
      const newDepart = data[i].a.toLowerCase();

      if (thisDepart === newDepart) {
        thisdata.push(data[i]);
      }
    }

    const columnCount = thisdata.length;
    this.container.addClass(`col-count--${columnCount}`);

    this.data = thisdata;
    this.mergeData();
  }

  mergeData() {
    const data = this.data;
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];

      item.PartidoEscaped = item.j.replace(/ /g, '');
      let budgetWidth = item.c;
      budgetWidth = budgetWidth.replace('$', '').replace('"', '');
      budgetWidth = (budgetWidth / 1000000000) * 1.5;
      if (budgetWidth < 35) budgetWidth = 35;
      const halfBudgetWidth = budgetWidth / 2;

      item.BudgetWidth = budgetWidth;
      item.halfBudgetWidth = halfBudgetWidth;

      item.itterator = i;

      if (item.f === '') item.f = './images/avatars/undefined.svg';
      if (item.i === '') item.i = './images/avatars/undefined.svg';
    }

    const context = {
      items: data,
    };

    const padrinoSource = $('#padrino-template').html();
    const padrinoTemplate = Handlebars.compile(padrinoSource);
    // console.log(padrinoTemplate(context));
    $('#padrinos').html(padrinoTemplate(context));

    const cabezasSource = $('#cabezas-template').html();
    const cabezasTemplate = Handlebars.compile(cabezasSource);
    $('#cabezas').append(cabezasTemplate(context));

    const presupuestsSource = $('#presupuests-template').html();
    const presupuestsTemplate = Handlebars.compile(presupuestsSource);
    $('#presupuests').append(presupuestsTemplate(context));

    const destinationsSource = $('#destinations-template').html();
    const destinationsTemplate = Handlebars.compile(destinationsSource);
    $('#destinations').append(destinationsTemplate(context));

    this.watch();
  }

  watch() {
    const self = this;

    $('div[data-ref]').each(function () {
      let open = false;
      const $this = $(this);
      const ref = $this.data('ref');
      const data = self.data[ref];
      const defaultColumnWidth = $('.column__inner').width();

      const currentCol = $(`div[data-ref=${ref}]`);
      $this.hover(
        () => {
          currentCol.addClass('hover');
        },
        () => {
          currentCol.removeClass('hover');
        },
      );

      $this.click(() => {
        if (!open) {
          open = true;

          self.showContent(ref, defaultColumnWidth);
          popup.create(data.l);
        } else {
          open = false;

          self.hideContent(ref);

          popup.close();
        }
      });
    });

    $('#close__content').click(() => {
      popup.close();
      self.hideContent();
    });
  }

  showContent(ref, defaultColumnWidth) {
    const currentCol = $(`div[data-ref=${ref}]`);
    const otherCol = $(`div[data-ref]:not(div[data-ref=${ref}])`);

    currentCol.addClass('row__column--open');
    otherCol.addClass('row__column--closed');
    currentCol.find('.column__inner').removeAttr('style');
    otherCol.find('.column__inner').width(defaultColumnWidth);
    this.container.addClass('container--open');
  }

  hideContent() {
    const cols = $('div[data-ref]');

    cols.removeClass('row__column--open');
    cols.removeClass('row__column--closed');
    this.container.removeClass('container--open');
  }

  static findGetParameter(parameterName) {
    let result = null;
    let tmp = [];
    const items = location.search.substr(1).split('&');
    for (let index = 0; index < items.length; index += 1) {
      tmp = items[index].split('=');
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
  }
}

Handlebars.registerHelper('formatCurrency', (value) => {
  if (value) {
    console.log(value);
    const number = value / 1000000;
    return "$" + number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
  } else {
    return "Sin definir"
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.start();
});
