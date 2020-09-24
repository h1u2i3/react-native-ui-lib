import _pt from "prop-types";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import _ from 'lodash';
import React, { PureComponent } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Constants } from '../../helpers';
import { Colors, BorderRadiuses } from '../../style'; // import {PureBaseComponent} from '../../commons';

import { asBaseComponent, forwardRef } from '../../commons/new';
import View from '../view';
import TouchableOpacity from '../touchableOpacity';
import Image from '../image';
import CardImage from './CardImage';
import CardSection, { CardSectionProps } from './CardSection'; // @ts-ignore

import Assets from '../../assets';
import CardContext from './CardContext';
import * as CardPresenter from './CardPresenter';
const DEFAULT_BORDER_RADIUS = BorderRadiuses.br40;
const DEFAULT_SELECTION_PROPS = {
  borderWidth: 2,
  color: Colors.blue30,
  indicatorSize: 20,
  icon: Assets.icons.checkSmall,
  iconColor: Colors.white,
  hideIndicator: false
};
export { CardSectionProps };

/**
 * @description: Card component
 * @extends: TouchableOpacity
 * @extendsnotes: (Touchable when passing onPress)
 * @extendslink: docs/TouchableOpacity
 * @modifiers: margin, padding
 * @gif: https://media.giphy.com/media/l0HU9SKWmv0VTOYMM/giphy.gif
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/CardsScreen.js
 */
class Card extends PureComponent {
  static propTypes = {
    width: _pt.oneOfType([_pt.number, _pt.string]),
    height: _pt.oneOfType([_pt.number, _pt.string]),
    row: _pt.bool,
    borderRadius: _pt.number,
    onPress: _pt.func,
    enableShadow: _pt.bool,
    elevation: _pt.number,
    enableBlur: _pt.bool,
    blurOptions: _pt.object,
    selected: _pt.bool,
    selectionOptions: _pt.shape({
      icon: _pt.number,
      iconColor: _pt.string,
      color: _pt.string,
      borderWidth: _pt.number,
      indicatorSize: _pt.number,
      hideIndicator: _pt.bool
    })
  };
  static displayName = 'Card';
  static defaultProps = {
    enableShadow: true
  };

  constructor(props) {
    super(props);
    this.state = {
      animatedSelected: new Animated.Value(Number(this.props.selected))
    };
    this.styles = createStyles(this.props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selected !== this.props.selected) {
      this.animateSelection();
    }
  }

  animateSelection() {
    const {
      animatedSelected
    } = this.state;
    const {
      selected
    } = this.props;
    Animated.timing(animatedSelected, {
      toValue: Number(selected),
      duration: 120,
      useNativeDriver: true
    }).start();
  }

  getBlurOptions() {
    const {
      blurOptions
    } = this.props;
    return {
      blurType: 'light',
      blurAmount: 5,
      ...blurOptions
    };
  } // todo: add unit test


  calcChildPosition(childIndex) {
    const {
      row
    } = this.props;
    const childrenCount = React.Children.count(this.children);
    const position = [];
    const childLocation = childIndex;

    if (childLocation === 0) {
      position.push(row ? 'left' : 'top');
    }

    if (childLocation === childrenCount - 1) {
      position.push(row ? 'right' : 'bottom');
    }

    return position;
  }

  get elevationStyle() {
    const {
      elevation,
      enableShadow
    } = this.props;

    if (enableShadow) {
      return {
        elevation: elevation || 2
      };
    }
  }

  get shadowStyle() {
    const {
      enableShadow
    } = this.props;

    if (enableShadow) {
      return this.styles.containerShadow;
    }
  }

  get blurBgStyle() {
    const {
      enableBlur
    } = this.props;

    if (Constants.isIOS && enableBlur) {
      return {
        backgroundColor: Colors.rgba(Colors.white, 0.85)
      };
    } else {
      return {
        backgroundColor: Colors.white
      };
    }
  }

  get borderRadius() {
    const {
      borderRadius
    } = this.props;
    return borderRadius === undefined ? DEFAULT_BORDER_RADIUS : borderRadius;
  }

  get children() {
    const {
      children
    } = this.props;
    return React.Children.toArray(children).filter(child => {
      return !_.isNull(child);
    });
  }

  renderSelection() {
    const {
      selectionOptions = {},
      selected
    } = this.props;
    const {
      animatedSelected
    } = this.state;

    const selectionColor = _.get(selectionOptions, 'color', DEFAULT_SELECTION_PROPS.color);

    if (_.isUndefined(selected)) {
      return null;
    }

    return /*#__PURE__*/React.createElement(Animated.View, {
      style: [this.styles.selectedBorder, {
        borderColor: selectionColor
      }, {
        borderRadius: this.borderRadius
      }, {
        opacity: animatedSelected
      }],
      pointerEvents: "none"
    }, !selectionOptions.hideIndicator && /*#__PURE__*/React.createElement(View, {
      style: [this.styles.selectedIndicator, {
        backgroundColor: selectionColor
      }]
    }, /*#__PURE__*/React.createElement(Image, {
      style: this.styles.selectedIcon,
      source: _.get(selectionOptions, 'icon', DEFAULT_SELECTION_PROPS.icon)
    })));
  }

  renderChildren = () => {
    return React.Children.map(this.children, (child, index) => {
      const position = this.calcChildPosition(index);
      const borderStyle = CardPresenter.generateBorderRadiusStyle({
        position,
        borderRadius: this.borderRadius
      });
      return /*#__PURE__*/React.createElement(CardContext.Provider, {
        key: index,
        value: {
          position,
          borderStyle
        }
      }, child);
    });
  };

  render() {
    const {
      onPress,
      onLongPress,
      style,
      selected,
      containerStyle,
      enableBlur,
      forwardedRef,
      ...others
    } = this.props;
    const blurOptions = this.getBlurOptions();
    const Container = onPress || onLongPress ? TouchableOpacity : View;
    const brRadius = this.borderRadius;
    return /*#__PURE__*/React.createElement(Container, _extends({
      style: [this.styles.container, {
        borderRadius: brRadius
      }, this.elevationStyle, this.shadowStyle, this.blurBgStyle, containerStyle, style],
      onPress: onPress,
      onLongPress: onLongPress,
      delayPressIn: 10,
      activeOpacity: 0.6,
      accessibilityState: {
        selected
      }
    }, others, {
      ref: forwardedRef
    }), Constants.isIOS && enableBlur &&
    /*#__PURE__*/
    // @ts-ignore
    React.createElement(BlurView, _extends({
      style: [this.styles.blurView, {
        borderRadius: brRadius
      }]
    }, blurOptions)), this.renderChildren(), this.renderSelection());
  }

}

function createStyles({
  width,
  height,
  borderRadius,
  selectionOptions
}) {
  const selectionOptionsWithDefaults = { ...DEFAULT_SELECTION_PROPS,
    ...selectionOptions
  };
  const brRadius = borderRadius === undefined ? DEFAULT_BORDER_RADIUS : borderRadius;
  return StyleSheet.create({
    container: {
      width,
      height,
      overflow: 'visible',
      borderRadius: brRadius
    },
    containerShadow: {
      // sh30 bottom
      shadowColor: Colors.dark40,
      shadowOpacity: 0.25,
      shadowRadius: 12,
      shadowOffset: {
        height: 5,
        width: 0
      }
    },
    blurView: { ...StyleSheet.absoluteFillObject,
      borderRadius: brRadius
    },
    selectedBorder: { ...StyleSheet.absoluteFillObject,
      borderRadius: DEFAULT_BORDER_RADIUS,
      borderWidth: selectionOptionsWithDefaults.borderWidth,
      borderColor: selectionOptionsWithDefaults.color
    },
    selectedIndicator: {
      borderRadius: BorderRadiuses.br100,
      position: 'absolute',
      top: -selectionOptionsWithDefaults.indicatorSize / 2 + 2,
      right: -selectionOptionsWithDefaults.indicatorSize / 2 + 1,
      width: selectionOptionsWithDefaults.indicatorSize,
      height: selectionOptionsWithDefaults.indicatorSize,
      backgroundColor: selectionOptionsWithDefaults.color,
      alignItems: 'center',
      justifyContent: 'center'
    },
    selectedIcon: {
      tintColor: selectionOptionsWithDefaults.iconColor
    }
  });
}

Card.Image = CardImage;
Card.Section = CardSection;
export default asBaseComponent(forwardRef(Card));