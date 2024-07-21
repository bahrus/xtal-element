import { XForm } from "trans-render/types";
import { PropInfo } from 'trans-render/froop/types';
import {Scope} from 'trans-render/lib/types';

export interface PropInferenceCriteria{
    cssSelector: string,
    attrForProp: string,

}

export interface EndUserProps<TProps = any, TActions = TProps> {
    aka?: string,
    inferProps?: boolean,
    xform?: XForm<TProps, TActions>,
    lcXform?: XForm<TProps, TActions>,
    shadowRootMode?:  ShadowRootMode,
    propDefaults?: Partial<TProps>,
    propInfo: Partial<{[key in keyof TProps]: PropInfo}>;
    targetScope?: Scope,
    assumeCSR?: boolean,
    propInferenceCriteria?: Array<PropInferenceCriteria>,
    inherits?: string | {new(): HTMLElement};
}

export interface AP extends EndUserProps{
    mainTemplate?: HTMLTemplateElement,
    styles?: string,
}
export type ProAP = Promise<AP>

export interface Actions {
    getTemplate(self: this): ProAP,
    define(self: this): ProAP,
}

