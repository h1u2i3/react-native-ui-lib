import _pt from "prop-types";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// TODO: support hitSlop
import React, { PureComponent } from 'react';
import { processColor, StyleSheet } from 'react-native';
import _ from 'lodash';
import Reanimated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { asBaseComponent, forwardRef } from '../commons/new';
const {
  Clock,
  Code,
  cond,
  and,
  or,
  eq,
  neq,
  interpolate,
  Extrapolate,
  Value,
  call,
  block,
  event,
  timing,
  set,
  startClock,
  stopClock
} = Reanimated;

/**
 * @description: a Better, enhanced TouchableOpacity component
 * @modifiers: flex, margin, padding, background
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/incubatorScreens/TouchableOpacityScreen.js
 */
class TouchableOpacity extends PureComponent {
  static propTypes = {
    backgroundColor: _pt.string,
    feedbackColor: _pt.string,
    activeOpacity: _pt.number,
    activeScale: _pt.number,
    onPress: _pt.func,
    onLongPress: _pt.func,
    pressState: _pt.object,
    disabled: _pt.bool
  };
  static displayName = 'Incubator.TouchableOpacity';
  static defaultProps = {
    activeOpacity: 0.2,
    activeScale: 1,
    onPress: _.noop
  };
  state = {
    pressState: new Value(-1)
  };
  _prevPressState = new Value(-1);
  isAnimating = new Value(0);
  clock = new Clock();
  _scale = runTiming(this.clock, this.pressState, this.props.activeScale || 1, 1);
  _opacity = runTiming(this.clock, this.pressState, this.props.activeOpacity || 0.2, 1);
  _color = cond(eq(this.pressState, State.BEGAN), processColor(this.props.feedbackColor || this.backgroundColor), processColor(this.backgroundColor));

  get pressState() {
    return this.props.pressState || this.state.pressState;
  }

  get backgroundColor() {
    const {
      modifiers,
      backgroundColor: backgroundColorProp
    } = this.props;
    const {
      backgroundColor
    } = modifiers;
    return backgroundColorProp || backgroundColor;
  }

  get animatedStyle() {
    const {
      feedbackColor
    } = this.props;
    const style = {
      opacity: this._opacity,
      transform: [{
        scale: this._scale
      }]
    };

    if (feedbackColor) {
      style.backgroundColor = this._color;
    }

    return style;
  }

  onStateChange = event([{
    nativeEvent: {
      state: this.pressState
    }
  }], {
    useNativeDriver: true
  });
  onLongPress = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      _.invoke(this.props, 'onLongPress', this.props);
    }
  };

  render() {
    const {
      modifiers,
      style,
      onPress = _.noop,
      onLongPress,
      disabled,
      forwardedRef,
      ...others
    } = this.props;
    const {
      borderRadius,
      paddings,
      margins,
      alignments,
      flexStyle,
      backgroundColor
    } = modifiers;
    return /*#__PURE__*/React.createElement(TapGestureHandler, {
      onHandlerStateChange: this.onStateChange,
      shouldCancelWhenOutside: true,
      enabled: !disabled
    }, /*#__PURE__*/React.createElement(Reanimated.View, _extends({}, others, {
      ref: forwardedRef,
      style: [borderRadius && {
        borderRadius
      }, flexStyle, paddings, margins, alignments, backgroundColor && {
        backgroundColor
      }, style, this.animatedStyle]
    }), this.props.children, /*#__PURE__*/React.createElement(Code, null, () => {
      return block([cond(and(eq(this.pressState, State.END), eq(this._prevPressState, State.BEGAN)), [call([], () => onPress(this.props))]), set(this._prevPressState, this.pressState)]);
    }), onLongPress && /*#__PURE__*/React.createElement(LongPressGestureHandler, {
      onHandlerStateChange: this.onLongPress,
      enabled: !disabled
    }, /*#__PURE__*/React.createElement(Reanimated.View, {
      style: StyleSheet.absoluteFillObject
    }))));
  }

}

function runTiming(clock, gestureState, initialValue, endValue) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };
  const config = {
    duration: 150,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };
  return block([cond(and(eq(gestureState, State.BEGAN), neq(config.toValue, 1)), [set(state.finished, 0), set(state.time, 0), set(state.frameTime, 0), set(config.toValue, 1), startClock(clock)]), cond(and(or(eq(gestureState, State.END), eq(gestureState, State.FAILED)), neq(config.toValue, 0)), [set(state.finished, 0), set(state.time, 0), set(state.frameTime, 0), set(config.toValue, 0), startClock(clock)]), timing(clock, state, config), cond(state.finished, stopClock(clock)), interpolate(state.position, {
    inputRange: [0, 1],
    outputRange: [endValue, initialValue],
    extrapolate: Extrapolate.CLAMP
  })]);
}

export default asBaseComponent(forwardRef(TouchableOpacity));