import { 
    INFORMATION_ROUTE,
    TRANSACTION_ROUTE,
    AUTH_ROUTE,
 } from "../router";

export type AuthRouteNamesType = (typeof AUTH_ROUTE)[keyof typeof AUTH_ROUTE]['NAME']
export type InformationRouteNamesType = (typeof INFORMATION_ROUTE)[keyof typeof INFORMATION_ROUTE]['NAME']
export type TransactionRouteNamesType = (typeof TRANSACTION_ROUTE)[keyof typeof TRANSACTION_ROUTE]['NAME']

export type PublicRouteNamesType = AuthRouteNamesType

export type ProtectedRouteNamesType
    = 
        InformationRouteNamesType
        | TransactionRouteNamesType