const $ = require('jquery');
const Handlebars = require('handlebars');
const Popup = require('./_popup.es6');
const popup = new Popup();

class Test {
  constructor() {
    this.container = $(".container");

    this.a = "Atlántico";
    this.getData((data) => this.processData(data));
  }

  getData(callback) {
    const request = "http://spreadsheet.dev";
    const path = "https://docs.google.com/spreadsheets/d/1Lz--EnGgDkIoxV0e86dhrqnx-LtZkqzIsKlQeP1ksro/pub?gid=641172671&single=true";

    $.ajax({
      url: request,
      type: 'POST',
      data: 'path=' + path,
      dataType: 'json',
      success: function (data) {
        if (callback) callback(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(jqXHR.responseText);
      }
    });
  }

  processData(data) {
    const thisdata = [];
    for (let item of data) {

      const thisDepart = this.a.toLowerCase();
      const newDepart = item.a.toLowerCase();

      if (thisDepart === newDepart) {
        thisdata.push(item);
      }
    }

    const columnCount = thisdata.length;
    this.container.addClass("col-count--" + columnCount);

    this.data = thisdata;
    this.mergeData();
  }

  mergeData() {
    const data = this.data;
    let i = 0;
    for (let item of data) {
      i++;

      item.PartidoEscaped = item.j.replace(/ /g, '');
      let budgetWidth = item.c;
      budgetWidth = budgetWidth.replace('$', '').replace('"', '');
      budgetWidth = (budgetWidth / 1000000000) * 1.5;
      if (budgetWidth < 35) budgetWidth = 35;
      let halfBudgetWidth = budgetWidth / 2;

      item.BudgetWidth = budgetWidth;
      item.halfBudgetWidth = halfBudgetWidth;

      item.itterator = i;

      if (item.f == "") item.f = "./images/avatars/undefined.svg";
      if (item.i == "") item.i = "./images/avatars/undefined.svg";
      // console.log(item.BudgetWidth);
      // console.log(item.Partido);
    }

    const context = {
      items: data
    };
    const padrinoSource = $("#padrino-template").html();
    const padrinoTemplate = Handlebars.compile(padrinoSource);
    // console.log(padrinoTemplate(context));
    $('#padrinos').html(padrinoTemplate(context));

    const cabezasSource = $("#cabezas-template").html();
    const cabezasTemplate = Handlebars.compile(cabezasSource);
    $('#cabezas').append(cabezasTemplate(context));

    const presupuestsSource = $("#presupuests-template").html();
    const presupuestsTemplate = Handlebars.compile(presupuestsSource);
    $('#presupuests').append(presupuestsTemplate(context));

    const destinationsSource = $("#destinations-template").html();
    const destinationsTemplate = Handlebars.compile(destinationsSource);
    $('#destinations').append(destinationsTemplate(context));

    this.watch();
  }

  watch() {
    const self = this;

    $("div[data-ref]").each(function () {
      let open = false;
      const $this = $(this);
      const ref = $this.data('ref');
      const data = self.data[ref - 1];
      let defaultColumnWidth = $('.column__inner').width();

      const currentCol = $("div[data-ref=" + ref + "]");
      $this.hover(
        () => {
          currentCol.addClass('hover');
        },
        () => {
          currentCol.removeClass('hover');
        }
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
  }

  showContent(ref, defaultColumnWidth) {
    const currentCol = $("div[data-ref=" + ref + "]");
    const otherCol = $("div[data-ref]:not(div[data-ref=" + ref + "])");

    currentCol.addClass('row__column--open');
    otherCol.addClass('row__column--closed');
    currentCol.find('.column__inner').removeAttr('style');
    otherCol.find('.column__inner').width(defaultColumnWidth);
    this.container.addClass('container--open');
  }

  hideContent(ref) {
    const currentCol = $("div[data-ref=" + ref + "]");
    const otherCol = $("div[data-ref]:not(div[data-ref=" + ref + "])");

    currentCol.removeClass('row__column--open');
    otherCol.removeClass('row__column--closed');
    this.container.removeClass('container--open');
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  let t = new Test(0, 0);
});