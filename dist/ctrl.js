"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EvalPanelCtrl = void 0;

var _sdk = require("app/plugins/sdk");

var _lodash = _interopRequireDefault(require("lodash"));

var _YourJS = _interopRequireDefault(require("./external/YourJS.min"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var panelDefaults = {
  code: '',
  allowScrollbars: true
};

function renderNow(e, jElem) {
  var error,
      isValid = false,
      ctrl = this,
      data = ctrl.data,
      jContent = jElem.find('.panel-content').html(''),
      elemContent = jContent[0];
  elemContent.className = elemContent.className.replace(/\b_\d+\b/g, ' ').replace(/\s+/g, ' ').trim();

  if (data) {
    if (data.type === 'table') {
      try {
        var css = function css(styles) {
          return _YourJS.default.css(styles, elemContent);
        };

        var fn = new Function('ctrl, dom, css', ctrl.panel.code + '\nreturn main(ctrl)');

        var result = _YourJS.default.toArray(fn(ctrl, _YourJS.default.dom, css)).forEach(function (elems) {
          console.log({
            elems: elems
          });
          (_YourJS.default.typeOf(elems) === 'String' ? jQuery('<div>').html(elems).toArray() : elems && elems.nodeType === 1 ? [elems] : []).forEach(function (elem) {
            console.log({
              elemContent: elemContent,
              elem: elem
            });
            elemContent.appendChild(elem);
          });
        });

        isValid = true;
      } catch (e) {
        console.error(error = e);
      }
    }
  }

  if (!isValid) {
    jContent.text('No data' + (error ? ':  \r\n' + error.message : '.')).css('text-align', 'center');
  }

  jContent.css('overflow', ctrl.panel.allowScrollbars ? 'auto' : 'hidden');
}

var EvalPanelCtrl =
/*#__PURE__*/
function (_MetricsPanelCtrl) {
  _inherits(EvalPanelCtrl, _MetricsPanelCtrl);

  function EvalPanelCtrl($scope, $injector, $rootScope) {
    var _this;

    _classCallCheck(this, EvalPanelCtrl);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EvalPanelCtrl).call(this, $scope, $injector));
    _this.$rootScope = $rootScope;
    _this.data = null;

    _lodash.default.defaults(_this.panel, panelDefaults);

    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_assertThisInitialized(_this)));

    _this.events.on('data-received', _this.onDataReceived.bind(_assertThisInitialized(_this)));

    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_assertThisInitialized(_this)));

    _this.events.on('data-error', _this.onDataError.bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(EvalPanelCtrl, [{
    key: "onInitEditMode",
    value: function onInitEditMode() {
      this.addEditorTab('Options', 'public/plugins/westc-eval-panel/partials/editor.html', 2);
    }
  }, {
    key: "onDataError",
    value: function onDataError() {
      this.renderNow();
    }
  }, {
    key: "onDataReceived",
    value: function onDataReceived(dataList) {
      if (dataList && dataList.length) {
        var data = dataList[0];
        this.data = {
          isReal: true,
          type: data.type,
          columns: data.columns,
          rows: data.rows
        };
      } else {
        this.data = {
          isReal: false,
          type: 'table',
          columns: [{
            text: "Off"
          }, {
            text: "Down"
          }, {
            text: "Run"
          }, {
            text: "Idle"
          }],
          rows: [[15, 50, 0, 40], [15, 5, 40, 15], [15, 30, 40, 15], [15, 30, 80, 15]]
        };
      }

      this.renderNow();
    }
  }, {
    key: "renderNow",
    value: function renderNow() {
      this.events.emit('renderNow');
    }
  }, {
    key: "link",
    value: function link(scope, elem, attrs, ctrl) {
      var _this2 = this;

      this.events.on('renderNow', function (e) {
        return renderNow.call(_this2, e, elem);
      });
      this.events.on('render', _lodash.default.debounce(function (e) {
        return renderNow.call(_this2, e, elem);
      }, 250));
    }
  }]);

  return EvalPanelCtrl;
}(_sdk.MetricsPanelCtrl);

exports.EvalPanelCtrl = EvalPanelCtrl;
EvalPanelCtrl.templateUrl = 'partials/module.html';
//# sourceMappingURL=ctrl.js.map
