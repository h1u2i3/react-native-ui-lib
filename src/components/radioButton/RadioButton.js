import _pt from "prop-types";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import _ from 'lodash';
import React, { PureComponent } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../../style';
import { asBaseComponent, forwardRef } from '../../commons/new';
import TouchableOpacity from '../touchableOpacity';
import View from '../view';
import Text from '../text';
import Image from '../image';
import asRadioGroupChild from './asRadioGroupChild';
const DEFAULT_SIZE = 24;
const DEFAULT_COLOR = Colors.blue30;

/**
 * A Radio Button component, should be wrapped inside a RadioGroup
 */
class RadioButton extends PureComponent {
  static propTypes = {
    value: _pt.oneOfType([_pt.string, _pt.number, _pt.bool]),
    selected: _pt.bool,
    onPress: _pt.func,
    disabled: _pt.bool,
    color: _pt.string,
    size: _pt.number,
    borderRadius: _pt.number,
    label: _pt.string,
    iconOnRight: _pt.bool
  };
  static displayName = 'RadioButton';
  static defaultProps = {
    iconOnRight: false
  };

  constructor(props) {
    super(props);
    this.styles = createStyles(props);
    this.state = {
      opacityAnimationValue: new Animated.Value(0),
      scaleAnimationValue: new Animated.Value(0.8)
    };
  }

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selected !== this.props.selected) {
      this.animate();
    }
  }

  animate() {
    const {
      selected
    } = this.props;
    const {
      opacityAnimationValue,
      scaleAnimationValue
    } = this.state;
    const animationTime = 150;
    const animationDelay = 60;

    if (selected) {
      Animated.parallel([Animated.timing(opacityAnimationValue, {
        toValue: 1,
        duration: animationTime,
        useNativeDriver: true
      }), Animated.timing(scaleAnimationValue, {
        toValue: 1,
        delay: animationDelay,
        duration: animationTime,
        easing: Easing.bezier(0.165, 0.84, 0.44, 1),
        useNativeDriver: true
      })]).start();
    } else {
      Animated.parallel([Animated.timing(scaleAnimationValue, {
        toValue: 0.8,
        duration: animationTime,
        useNativeDriver: true
      }), Animated.timing(opacityAnimationValue, {
        toValue: 0,
        duration: animationTime,
        useNativeDriver: true
      })]).start();
    }
  }

  onPress = () => {
    const {
      disabled,
      value,
      selected
    } = this.props;

    if (!disabled) {
      _.invoke(this.props, 'onValueChange', value);

      _.invoke(this.props, 'onPress', selected);
    }
  };
  getAccessibilityProps = () => {
    const {
      label = '',
      selected,
      disabled
    } = this.props;
    const selectedAccessibilityText = selected ? 'selected' : 'unselected';
    const accessibilityLabel = `${selectedAccessibilityText}. ${label}`;
    return {
      accessible: true,
      accessibilityStates: disabled ? ['disabled'] : undefined,
      accessibilityRole: 'button',
      // 'radio', TODO: uncomment when switching to RN60
      accessibilityLabel
    };
  };

  getRadioButtonOutlineStyle() {
    const {
      color,
      size,
      borderRadius,
      style: propsStyle,
      disabled
    } = this.props;
    const style = [this.styles.radioButtonOutline];

    if (size) {
      style.push({
        width: size,
        height: size
      });
    }

    if (borderRadius) {
      style.push({
        borderRadius
      });
    }

    if (color) {
      style.push({
        borderColor: disabled ? Colors.dark70 : color
      });
    }

    style.push(propsStyle);
    return style;
  }

  getRadioButtonInnerStyle() {
    const {
      color,
      borderRadius,
      disabled
    } = this.props;
    const style = [this.styles.radioButtonInner];

    if (borderRadius) {
      style.push({
        borderRadius
      });
    }

    if (color) {
      style.push({
        backgroundColor: disabled ? Colors.dark70 : color
      });
    }

    return style;
  }

  renderLabel() {
    const {
      label,
      labelStyle
    } = this.props;
    return label && /*#__PURE__*/React.createElement(Text, {
      "marginL-10": true,
      style: labelStyle
    }, label);
  }

  renderIcon() {
    const {
      iconSource,
      iconStyle
    } = this.props;
    const style = [this.styles.image, iconStyle];
    return iconSource && /*#__PURE__*/React.createElement(Image, {
      style: style,
      source: iconSource
    });
  }

  render() {
    const {
      onPress,
      onValueChange,
      ...others
    } = this.props;
    const {
      opacityAnimationValue,
      scaleAnimationValue
    } = this.state;
    const Container = onPress || onValueChange ? TouchableOpacity : View;
    return (
      /*#__PURE__*/
      // @ts-ignore
      React.createElement(Container, _extends({
        row: true,
        centerV: true,
        activeOpacity: 1
      }, others, {
        style: undefined,
        onPress: this.onPress
      }, this.getAccessibilityProps()), /*#__PURE__*/React.createElement(View, {
        style: this.getRadioButtonOutlineStyle()
      }, /*#__PURE__*/React.createElement(Animated.View, {
        style: [this.getRadioButtonInnerStyle(), {
          opacity: opacityAnimationValue
        }, {
          transform: [{
            scale: scaleAnimationValue
          }]
        }]
      })), this.props.iconOnRight ? this.renderLabel() : this.renderIcon(), this.props.iconOnRight ? this.renderIcon() : this.renderLabel())
    );
  }

}

function createStyles(props) {
  const {
    size = DEFAULT_SIZE,
    borderRadius = DEFAULT_SIZE / 2,
    color = DEFAULT_COLOR,
    disabled
  } = props;
  return StyleSheet.create({
    radioButtonOutline: {
      borderWidth: 2,
      borderColor: disabled ? Colors.dark70 : color,
      width: size,
      height: size,
      borderRadius,
      padding: 3
    },
    radioButtonInner: {
      backgroundColor: disabled ? Colors.dark70 : color,
      flex: 1,
      borderRadius
    },
    image: {
      marginLeft: 6
    }
  });
}

export default asBaseComponent(forwardRef(asRadioGroupChild(RadioButton)));