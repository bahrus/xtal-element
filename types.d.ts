import {CEArgs, IResolvableService, CEServiceClasses, CEServices} from 'trans-render/froop/types';

export interface INotifySvc extends IResolvableService{}

export interface XEServiceClasses extends CEServiceClasses{
    notify?: {new(args: XEArgs): INotifySvc},
}

export interface XEServices extends CEServices{
    notify?: INotifySvc
}

export interface XEArgs<TProps = any, TAciopns = TProps> extends CEArgs<TProps, TActions> {
    serviceClasses: XEServiceClasses,
    services: XEServices,
}