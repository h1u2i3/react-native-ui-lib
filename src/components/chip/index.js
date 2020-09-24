import _pt from "prop-types";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import _ from 'lodash';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import Assets from '../../assets';
import { asBaseComponent } from '../../commons/new';
import { BorderRadiuses, Spacings } from '../../style'; // @ts-ignore

import Avatar from '../avatar'; // @ts-ignore

import Badge, { BADGE_SIZES } from '../badge';
import Image from '../image';
import Text from '../text';
import TouchableOpacity from '../touchableOpacity';
import View from '../view';

/**
 * @description: Chip component
 * @extends: TouchableOpacity
 * @extendslink: docs/TouchableOpacity
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/ChipScreen.tsx
 */
const Chip = ({
  avatarProps,
  backgroundColor,
  badgeProps,
  borderRadius,
  containerStyle,
  onDismiss,
  dismissColor,
  dismissIcon,
  dismissIconStyle,
  dismissContainerStyle,
  iconColor,
  iconSource,
  iconStyle,
  label,
  labelStyle,
  labelColor,
  onPress,
  resetSpacings,
  size,
  useSizeAsMinimum,
  testID,
  ...others
}) => {
  const renderIcon = useCallback(() => {
    return /*#__PURE__*/React.createElement(Image // @ts-ignore
    , {
      source: iconSource,
      tintColor: iconColor,
      style: [iconStyle, getMargins('iconSource')],
      testID: `${testID}.icon`
    });
  }, [iconColor, iconSource, iconStyle]);
  const renderBadge = useCallback(() => {
    return /*#__PURE__*/React.createElement(Badge, _extends({
      size: BADGE_SIZES.medium,
      testID: `${testID}.counter`
    }, badgeProps, {
      // @ts-ignore
      containerStyle: [getMargins('badge'), badgeProps.containerStyle]
    }));
  }, [badgeProps]);
  const renderOnDismiss = useCallback(() => {
    return /*#__PURE__*/React.createElement(TouchableOpacity, {
      style: [getMargins('dismiss'), dismissContainerStyle],
      onPress: onDismiss,
      hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      testID: `${testID}.dismiss`
    }, /*#__PURE__*/React.createElement(Image // @ts-ignore
    , {
      source: dismissIcon,
      tintColor: dismissColor,
      style: [dismissIconStyle],
      accessibilityLabel: "dismiss",
      testID: `${testID}.dismiss`
    }));
  }, [dismissContainerStyle, onDismiss, dismissIcon, dismissIconStyle]);
  const renderAvatar = useCallback(() => {
    return /*#__PURE__*/React.createElement(Avatar, _extends({
      size: 20,
      testID: `${testID}.avatar`
    }, avatarProps, {
      // @ts-ignore
      containerStyle: [getMargins('avatar'), avatarProps.containerStyle]
    }));
  }, [avatarProps]);
  const renderLabel = useCallback(() => {
    return /*#__PURE__*/React.createElement(Text, {
      text90M: true,
      numberOfLines: 1 // @ts-ignore
      ,
      tintColor: labelColor,
      style: [styles.label, getMargins('label'), labelStyle],
      testID: `${testID}.label`
    }, label);
  }, [label, labelColor, labelStyle]);
  const getMargins = useCallback(element => {
    if (!resetSpacings) {
      switch (element) {
        case 'label':
          if (avatarProps) {
            return {
              marginRight: Spacings.s2,
              marginLeft: Spacings.s1
            };
          }

          if (badgeProps) {
            return {
              marginLeft: Spacings.s3,
              marginRight: Spacings.s1
            };
          }

          if (iconSource) {
            return {
              marginLeft: 2,
              marginRight: Spacings.s2
            };
          }

          if (onDismiss) {
            return {
              marginLeft: Spacings.s3,
              marginRight: Spacings.s2
            };
          } else {
            return {
              marginHorizontal: Spacings.s3
            };
          }

        case 'avatar':
          return {
            marginLeft: 2
          };

        case 'badge':
          return {
            marginRight: Spacings.s1
          };

        case 'dismiss':
          return {
            marginRight: Spacings.s2
          };
      }
    }
  }, [avatarProps, badgeProps, iconSource, onDismiss]);
  const getContainerSize = useCallback(() => {
    const width = useSizeAsMinimum ? 'minWidth' : 'width';
    const height = useSizeAsMinimum ? 'minHeight' : 'height';
    return typeof size === 'object' ? {
      [width]: _.get(size, 'width'),
      [height]: _.get(size, 'height')
    } : {
      [width]: size,
      [height]: size
    };
  }, [size]);
  const Container = onPress ? TouchableOpacity : View;
  return /*#__PURE__*/React.createElement(Container, _extends({
    activeOpacity: 1,
    onPress: onPress,
    style: [styles.container, {
      backgroundColor
    }, {
      borderRadius
    }, containerStyle, getContainerSize()],
    testID: testID
  }, others), avatarProps && renderAvatar(), iconSource && renderIcon(), label && renderLabel(), badgeProps && renderBadge(), onDismiss && renderOnDismiss());
};

Chip.propTypes = {
  size: _pt.oneOfType([_pt.number, _pt.shape({
    width: _pt.number.isRequired,
    height: _pt.number.isRequired
  })]),
  onPress: _pt.func,
  backgroundColor: _pt.string,
  borderRadius: _pt.number,
  useSizeAsMinimum: _pt.bool,
  resetSpacings: _pt.bool,
  testID: _pt.string,
  label: _pt.string,
  labelColor: _pt.string,
  iconColor: _pt.string,
  onDismiss: _pt.func,
  dismissColor: _pt.string
};
Chip.displayName = 'Chip';
Chip.defaultProps = {
  borderRadius: BorderRadiuses.br100,
  dismissIcon: Assets.icons.x,
  useSizeAsMinimum: true,
  size: 26
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: BorderRadiuses.br100
  },
  label: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
export default asBaseComponent(Chip);