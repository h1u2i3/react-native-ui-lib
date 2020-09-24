import _pt from "prop-types";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { PureComponent } from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import _ from 'lodash';
import { asBaseComponent, forwardRef } from '../../commons/new'; // @ts-ignore

import Incubator from '../../incubator';

/**
 * @description: A wrapper for TouchableOpacity component. Support onPress, throttling and activeBackgroundColor
 * @extends: TouchableOpacity
 * @modifiers: margins, paddings, alignments, background, borderRadius
 * @extendslink: https://facebook.github.io/react-native/docs/touchableopacity.html
 * @gif: https://media.giphy.com/media/xULW8AMIgw7l31zjm8/giphy.gif
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/src/components/touchableOpacity/index.tsx
 */
class TouchableOpacity extends PureComponent {
  static propTypes = {
    backgroundColor: _pt.string,
    throttleTime: _pt.number,
    throttleOptions: _pt.shape({
      leading: _pt.bool.isRequired,
      trailing: _pt.bool.isRequired
    }),
    activeBackgroundColor: _pt.string,
    useNative: _pt.bool,
    ref: _pt.any
  };
  static displayName = 'TouchableOpacity';

  constructor(props) {
    super(props);
    const {
      throttleTime,
      throttleOptions
    } = this.props;
    this.onPress = _.throttle(this.onPress.bind(this), throttleTime, throttleOptions);
    this.onPressIn = this.onPressIn.bind(this);
    this.onPressOut = this.onPressOut.bind(this);
  }

  state = {
    active: false
  };

  getAccessibilityInfo() {
    const {
      disabled
    } = this.props;
    return {
      accessibilityRole: 'button',
      accessibilityStates: disabled ? ['disabled'] : []
    };
  }

  onPressIn(...args) {
    this.setState({
      active: true
    });

    _.invoke(this.props, 'onPressIn', ...args);
  }

  onPressOut(...args) {
    this.setState({
      active: false
    });

    _.invoke(this.props, 'onPressOut', ...args);
  }

  get backgroundColorStyle() {
    const {
      backgroundColor: propsBackgroundColor,
      modifiers
    } = this.props;
    const backgroundColor = propsBackgroundColor || modifiers.backgroundColor;

    if (backgroundColor) {
      return {
        backgroundColor
      };
    }
  }

  get activeBackgroundStyle() {
    const {
      active
    } = this.state;
    const {
      activeBackgroundColor
    } = this.props;

    if (active && activeBackgroundColor) {
      return {
        backgroundColor: activeBackgroundColor
      };
    }
  }

  render() {
    const {
      useNative,
      style,
      modifiers,
      forwardedRef,
      ...others
    } = this.props;
    const {
      borderRadius,
      paddings,
      margins,
      alignments,
      flexStyle
    } = modifiers;

    if (useNative) {
      return /*#__PURE__*/React.createElement(Incubator.TouchableOpacity, this.props);
    }

    return (
      /*#__PURE__*/
      // @ts-ignore
      React.createElement(RNTouchableOpacity, _extends({}, this.getAccessibilityInfo(), others, {
        onPress: this.onPress,
        onPressIn: this.onPressIn,
        onPressOut: this.onPressOut,
        style: [this.backgroundColorStyle, borderRadius && {
          borderRadius
        }, flexStyle, paddings, margins, alignments, style, this.activeBackgroundStyle],
        ref: forwardedRef
      }))
    );
  }

  onPress() {
    _.invoke(this.props, 'onPress', this.props);
  }

}

export default asBaseComponent(forwardRef(TouchableOpacity));