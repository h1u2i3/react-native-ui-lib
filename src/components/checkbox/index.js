import _pt from "prop-types";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import _ from 'lodash';
import React, { Component } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { Colors } from '../../style'; //@ts-ignore

import Assets from '../../assets';
import { asBaseComponent } from '../../commons/new';
import TouchableOpacity from '../touchableOpacity';
const DEFAULT_SIZE = 24;
const DEFAULT_COLOR = Colors.blue30;
const DEFAULT_ICON_COLOR = Colors.white;
const DEFAULT_DISABLED_COLOR = Colors.dark70;
;
/**
 * @description: Checkbox component for toggling boolean value related to some context
 * @extends: TouchableOpacity
 * @extendslink: docs/TouchableOpacity
 * @gif: https://media.giphy.com/media/xULW8j5WzsuPytqklq/giphy.gif
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/CheckboxScreen.tsx
 */

class Checkbox extends Component {
  static propTypes = {
    value: _pt.bool,
    onValueChange: _pt.func,
    disabled: _pt.bool,
    color: _pt.string,
    size: _pt.number,
    borderRadius: _pt.number,
    selectedIcon: _pt.number,
    iconColor: _pt.string
  };
  static displayName = 'Checkbox';

  constructor(props) {
    super(props);
    this.state = {
      isChecked: new Animated.Value(this.props.value ? 1 : 0)
    };
    this.styles = createStyles(props);
    this.animationStyle = {
      opacity: this.state.isChecked,
      transform: [{
        scaleX: this.state.isChecked
      }, {
        scaleY: this.state.isChecked
      }]
    };
  }

  componentDidUpdate(prevProps) {
    const {
      value
    } = this.props;

    if (prevProps.value !== value) {
      this.animateCheckbox(value);
    }
  }

  getAccessibilityProps() {
    const {
      accessibilityLabel,
      disabled,
      value
    } = this.props;
    const checkedState = value ? 'checked' : 'unchecked';
    return {
      accessible: true,
      accessibilityLabel: accessibilityLabel ? `${accessibilityLabel} ${checkedState}` : `${checkedState}`,
      accessibilityRole: 'checkbox',
      accessibilityStates: disabled ? ['disabled'] : undefined
    };
  }

  animateCheckbox(value) {
    const {
      isChecked
    } = this.state;
    Animated.timing(isChecked, {
      duration: 170,
      easing: Easing.bezier(0.77, 0.0, 0.175, 1.0),
      toValue: Number(value),
      useNativeDriver: true
    }).start();
  }

  onPress = () => {
    const {
      disabled
    } = this.props;

    if (!disabled) {
      _.invoke(this.props, 'onValueChange', !this.props.value);
    }
  };

  getColor() {
    const {
      color,
      disabled
    } = this.props;
    return disabled ? DEFAULT_DISABLED_COLOR : color || DEFAULT_COLOR;
  }

  getBorderStyle() {
    const borderColor = {
      borderColor: this.getColor()
    };
    const borderStyle = [this.styles.container, {
      borderWidth: 2
    }, borderColor];
    return borderStyle;
  }

  render() {
    const {
      selectedIcon,
      color,
      iconColor,
      disabled,
      testID,
      style,
      ...others
    } = this.props;
    return (
      /*#__PURE__*/
      // @ts-ignore
      React.createElement(TouchableOpacity, _extends({}, this.getAccessibilityProps(), {
        activeOpacity: 1,
        testID: testID
      }, others, {
        style: [this.getBorderStyle(), style],
        onPress: this.onPress
      }), /*#__PURE__*/React.createElement(Animated.View, {
        style: [this.styles.container, {
          backgroundColor: this.getColor()
        }, {
          opacity: this.animationStyle.opacity
        }]
      }, /*#__PURE__*/React.createElement(Animated.Image, {
        style: [this.styles.selectedIcon, color && {
          tintColor: iconColor
        }, {
          transform: this.animationStyle.transform
        }, disabled && {
          tintColor: DEFAULT_ICON_COLOR
        }],
        source: selectedIcon || Assets.icons.checkSmall,
        testID: `${testID}.selected`
      })))
    );
  }

}

function createStyles(props) {
  const {
    color = DEFAULT_COLOR,
    iconColor = DEFAULT_ICON_COLOR,
    size = DEFAULT_SIZE,
    borderRadius
  } = props;
  return StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: borderRadius || 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: color
    },
    selectedIcon: {
      tintColor: iconColor,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });
}

export default asBaseComponent(Checkbox);