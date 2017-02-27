'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sticky = function (_React$Component) {
  _inherits(Sticky, _React$Component);

  function Sticky(props) {
    _classCallCheck(this, Sticky);

    var _this = _possibleConstructorReturn(this, (Sticky.__proto__ || Object.getPrototypeOf(Sticky)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {};
    return _this;
  }

  _createClass(Sticky, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.channel = this.context['sticky-channel'];
      this.channel.subscribe(this.updateContext);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.on(['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.onEvent);
      this.recomputeState();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.recomputeState(nextProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.off(['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.onEvent);
      this.channel.unsubscribe(this.updateContext);
    }
  }, {
    key: 'getXOffset',
    value: function getXOffset() {
      return this.placeholder.getBoundingClientRect().left;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.placeholder.getBoundingClientRect().width;
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.children.getBoundingClientRect().height;
    }
  }, {
    key: 'getPlaceholderRect',
    value: function getPlaceholderRect() {
      return this.placeholder.getBoundingClientRect();
    }
  }, {
    key: 'getContainerRect',
    value: function getContainerRect() {
      return this.containerNode ? this.containerNode.getBoundingClientRect() : {
        top: 0,
        bottom: 0
      };
    }
  }, {
    key: 'isStickyBottom',
    value: function isStickyBottom(props, state) {
      var bottomOffset = props.bottomOffset;
      var containerOffset = state.containerOffset,
          height = state.height,
          placeholderTop = state.placeholderTop,
          winHeight = state.winHeight;


      var bottomBreakpoint = containerOffset - bottomOffset;
      var placeholderBottom = placeholderTop + height;

      return placeholderBottom >= winHeight - bottomBreakpoint;
    }
  }, {
    key: 'isStickyTop',
    value: function isStickyTop(props, state) {
      var distancesFromPlaceholder = state.placeholderTop;

      var topBreakpoint = state.containerOffset - props.topOffset;
      var bottomBreakpoint = state.containerOffset + props.bottomOffset;

      return distancesFromPlaceholder <= topBreakpoint && state.containerBottom >= bottomBreakpoint;
    }
  }, {
    key: 'isSticky',
    value: function isSticky(props, state) {
      if (!props.isActive) {
        return false;
      }

      return props.position === 'top' ? this.isStickyTop(props, state) : this.isStickyBottom(props, state);
    }
  }, {
    key: 'on',
    value: function on(events, callback) {
      events.forEach(function (evt) {
        window.addEventListener(evt, callback);
      });
    }
  }, {
    key: 'off',
    value: function off(events, callback) {
      events.forEach(function (evt) {
        window.removeEventListener(evt, callback);
      });
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(newProps, newState) {
      var _this2 = this;

      // Have we changed the number of props?
      var propNames = Object.keys(this.props);
      if (Object.keys(newProps).length != propNames.length) return true;

      // Have we changed any prop values?
      var valuesMatch = propNames.every(function (key) {
        return newProps.hasOwnProperty(key) && newProps[key] === _this2.props[key];
      });
      if (!valuesMatch) return true;

      // Have we changed any state that will always impact rendering?
      var state = this.state;
      if (newState.isSticky !== state.isSticky) return true;

      // If we are sticky, have we changed any state that will impact rendering?
      if (state.isSticky) {
        if (newState.height !== state.height) return true;
        if (newState.width !== state.width) return true;
        if (newState.xOffset !== state.xOffset) return true;
        if (newState.placeholderTop !== state.placeholderTop) return true;
      }

      // We should check container sizes anyway
      if (newState.containerOffset !== state.containerOffset) return true;
      if (newState.containerBottom !== state.containerBottom) return true;
      if (newState.containerTop !== state.containerTop) return true;

      return false;
    }
  }, {
    key: 'getPositionOffset',
    value: function getPositionOffset() {
      var _state = this.state,
          containerOffset = _state.containerOffset,
          containerTop = _state.containerTop,
          containerBottom = _state.containerBottom,
          height = _state.height;
      var _props = this.props,
          bottomOffset = _props.bottomOffset,
          position = _props.position,
          topOffset = _props.topOffset;


      var bottomLimit = containerBottom - height - bottomOffset;
      var topLimit = window.innerHeight - containerTop - topOffset;

      return position === 'top' ? Math.min(containerOffset, bottomLimit) : Math.min(containerOffset, topLimit);
    }
  }, {
    key: 'render',


    /*
     * The special sauce.
     */
    value: function render() {
      var _extends2;

      var _props2 = this.props,
          propsClassName = _props2.className,
          bottomOffset = _props2.bottomOffset,
          isActive = _props2.isActive,
          onStickyStateChange = _props2.onStickyStateChange,
          position = _props2.position,
          stickyClassName = _props2.stickyClassName,
          stickyStyle = _props2.stickyStyle,
          style = _props2.style,
          topOffset = _props2.topOffset,
          props = _objectWithoutProperties(_props2, ['className', 'bottomOffset', 'isActive', 'onStickyStateChange', 'position', 'stickyClassName', 'stickyStyle', 'style', 'topOffset']);

      var _state2 = this.state,
          isSticky = _state2.isSticky,
          height = _state2.height,
          width = _state2.width,
          xOffset = _state2.xOffset;


      var placeholderStyle = { paddingBottom: isSticky ? height : 0 };
      var className = propsClassName + ' ' + (isSticky ? stickyClassName : '');
      var finalStickyStyle = isSticky && _extends((_extends2 = {
        position: 'fixed'
      }, _defineProperty(_extends2, position, this.getPositionOffset()), _defineProperty(_extends2, 'left', xOffset), _defineProperty(_extends2, 'width', width), _extends2), stickyStyle);

      // To ensure that this component becomes sticky immediately on mobile devices instead
      // of disappearing until the scroll event completes, we add `transform: translateZ(0)`
      // to 'kick' rendering of this element to the GPU
      // @see http://stackoverflow.com/questions/32875046
      var finalStyle = _extends({
        transform: 'translateZ(0)'
      }, style, finalStickyStyle || {});

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('div', { ref: this.setPlaceholderRef, style: placeholderStyle }),
        _react2.default.createElement(
          'div',
          _extends({}, props, { ref: this.setChildrenRef, className: className, style: finalStyle }),
          this.props.children
        )
      );
    }
  }]);

  return Sticky;
}(_react2.default.Component);

Sticky.propTypes = {
  isActive: _react2.default.PropTypes.bool,
  className: _react2.default.PropTypes.string,
  position: _react2.default.PropTypes.oneOf(['top', 'bottom']),
  style: _react2.default.PropTypes.object,
  stickyClassName: _react2.default.PropTypes.string,
  stickyStyle: _react2.default.PropTypes.object,
  topOffset: _react2.default.PropTypes.number,
  bottomOffset: _react2.default.PropTypes.number,
  onStickyStateChange: _react2.default.PropTypes.func
};
Sticky.defaultProps = {
  isActive: true,
  className: '',
  position: 'top',
  style: {},
  stickyClassName: 'sticky',
  stickyStyle: {},
  topOffset: 0,
  bottomOffset: 0,
  onStickyStateChange: function onStickyStateChange() {}
};
Sticky.contextTypes = {
  'sticky-channel': _react2.default.PropTypes.any
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onEvent = function () {
    _this3.recomputeState();
  };

  this.updateContext = function (_ref) {
    var inherited = _ref.inherited,
        node = _ref.node;

    _this3.containerNode = node;
    _this3.recomputeState(_this3.props, inherited);
  };

  this.recomputeState = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this3.props;
    var inherited = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var nextState = _extends({}, _this3.state, {
      height: _this3.getHeight(),
      width: _this3.getWidth(),
      xOffset: _this3.getXOffset(),
      containerOffset: inherited === false ? _this3.state.containerOffset : inherited,
      containerBottom: _this3.getContainerRect().bottom,
      containerTop: _this3.getContainerRect().top,
      placeholderTop: _this3.getPlaceholderRect().top,
      winHeight: window.innerHeight
    });

    var isSticky = _this3.isSticky(props, nextState);
    var finalNextState = _extends({}, nextState, { isSticky: isSticky });
    var hasChanged = _this3.state.isSticky !== isSticky;

    _this3.setState(finalNextState, function () {
      // After component did update lets broadcast update msg to channel
      if (hasChanged) {
        if (_this3.channel) {
          _this3.channel.update(function (data) {
            data.offset = isSticky ? _this3.state.height : 0;
          });
        }

        _this3.props.onStickyStateChange(isSticky);
      }
    });
  };

  this.setChildrenRef = function (children) {
    _this3.children = children;
  };

  this.setPlaceholderRef = function (placeholder) {
    _this3.placeholder = placeholder;
  };
};

exports.default = Sticky;
module.exports = exports['default'];