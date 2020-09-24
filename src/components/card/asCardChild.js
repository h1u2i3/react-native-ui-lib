function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import CardContext from './CardContext';

function asCardChild(WrappedComponent) {
  const cardChild = props => {
    return /*#__PURE__*/React.createElement(CardContext.Consumer, null, context => /*#__PURE__*/React.createElement(WrappedComponent, _extends({
      context: context
    }, props)));
  };

  cardChild.displayName = WrappedComponent.displayName;
  return cardChild;
}

export default asCardChild;