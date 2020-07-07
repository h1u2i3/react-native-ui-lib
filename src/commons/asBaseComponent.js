import React from 'react';
import _ from 'lodash';
//@ts-ignore
import hoistStatics from 'hoist-non-react-statics';
//@ts-ignore
import * as Modifiers from './modifiers';
import forwardRef from './forwardRef';
import UIComponent from './UIComponent';
function asBaseComponent(WrappedComponent) {
    class BaseComponent extends UIComponent {
        constructor() {
            super(...arguments);
            this.state = Modifiers.generateModifiersStyle(undefined, BaseComponent.getThemeProps(this.props, this.context));
        }
        static getDerivedStateFromProps(nextProps, prevState) {
            const themeProps = BaseComponent.getThemeProps(nextProps, undefined);
            const newModifiers = Modifiers.generateModifiersStyle(undefined, themeProps);
            if (!_.isEqual(newModifiers, prevState)) {
                return newModifiers;
            }
            return null;
        }
        render() {
            const themeProps = BaseComponent.getThemeProps(this.props, this.context);
            // TODO: omit original modifiers props (left, right, flex, etc..)
            // Because they throws an error when being passed to RNView on Android
            const { forwardedRef, ...others } = themeProps;
            return <WrappedComponent /* {...this.props} */ {...others} modifiers={this.state} ref={forwardedRef}/>;
        }
    }
    BaseComponent.getThemeProps = (props, context) => {
        return Modifiers.getThemeProps.call(WrappedComponent, props, context);
    };
    // Statics
    hoistStatics(BaseComponent, WrappedComponent);
    BaseComponent.displayName = WrappedComponent.displayName;
    BaseComponent.propTypes = WrappedComponent.propTypes;
    BaseComponent.defaultProps = WrappedComponent.defaultProps;
    return forwardRef(BaseComponent);
}
export default asBaseComponent;
