function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react'; //@ts-ignore

import hoistStatics from 'hoist-non-react-statics';
export default function forwardRef(WrappedComponent) {
  function forwardRef(props, ref) {
    return /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, props, {
      forwardedRef: ref
    }));
  }

  const ForwardedComponent = /*#__PURE__*/React.forwardRef(forwardRef);
  hoistStatics(ForwardedComponent, WrappedComponent); //@ts-ignore

  ForwardedComponent.displayName = WrappedComponent.displayName; //@ts-ignore

  ForwardedComponent.propTypes = WrappedComponent.propTypes; //@ts-ignore

  ForwardedComponent.defaultProps = WrappedComponent.defaultProps;
  return ForwardedComponent;
}