import {MetricsPanelCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
import JS from './external/YourJS.min';

const panelDefaults = {
  code: '',
  allowScrollbars: true
};

function renderNow(e, jElem) {
  let error,
      isValid = false,
      ctrl = this,
      data = ctrl.data,
      jContent = jElem.find('.panel-content').html(''),
      elemContent = jContent[0];

  elemContent.className = elemContent.className.replace(/\b_\d+\b/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (data) {
    if (data.type === 'table') {
      try {
        function css(styles) { return JS.css(styles, elemContent); }
        var fn = new Function('ctrl, dom, css', ctrl.panel.code + '\nreturn main(ctrl)');
        var result = JS.toArray(fn(ctrl, JS.dom, css))
          .forEach(function(elems) {
            (JS.typeOf(elems) === 'String'
              ? jQuery('<div>').html(elems).toArray()
              : (elems && elems.nodeType === 1)
                ? [elems]
                : []
            ).forEach(function (elem) { elemContent.appendChild(elem); });
          });
        isValid = true;
      }
      catch(e) {
        console.error(error = e);
      }
    }
  }
  if (!isValid) {
    jContent
      .text('No data' + (error ? ':  \r\n' + error.message : '.'))
      .css('text-align', 'center');
  }
  jContent
    .css('overflow', ctrl.panel.allowScrollbars ? 'auto' : 'hidden');
}

export class EvalPanelCtrl extends MetricsPanelCtrl {
  constructor($scope, $injector, $rootScope) {
    super($scope, $injector);
    this.$rootScope = $rootScope;
    this.data = null;

    _.defaults(this.panel, panelDefaults);

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
  }

  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/westc-eval-panel/partials/editor.html', 2);
  }

  onDataError() {
    this.renderNow();
  }

  onDataReceived(dataList) {
    if (dataList && dataList.length) {
      let data = dataList[0];
      this.data = {
        isReal: true,
        type: data.type,
        columns: data.columns,
        rows: data.rows
      };
    }
    else {
      this.data = {
        isReal: false,
        type: 'table',
        columns: [{text: "Off"}, {text: "Down"}, {text: "Run"}, {text: "Idle"}],
        rows: [
          [ 15, 50, 0, 40 ],
          [ 15, 5, 40, 15 ],
          [ 15, 30, 40, 15 ],
          [ 15, 30, 80, 15 ]
        ]
      };
    }

    this.renderNow();
  }

  renderNow() {
    this.events.emit('renderNow');
  }

  link(scope, elem, attrs, ctrl) {
    this.events.on('renderNow', e => renderNow.call(this, e, elem));
    this.events.on('render', _.debounce(e => renderNow.call(this, e, elem), 250));
  }
}

EvalPanelCtrl.templateUrl = 'partials/module.html';
