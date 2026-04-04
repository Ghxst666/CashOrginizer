import { 
    SYSTEM_ROUTE,
    INFORMATION_ROUTE,
    PLANNING_ROUTE,
    TRANSACTION_ROUTE,
 } from "../router";

export type SystemRouteNamesType = (typeof SYSTEM_ROUTE)[keyof typeof SYSTEM_ROUTE]['NAME']
export type InformationRouteNamesType = (typeof INFORMATION_ROUTE)[keyof typeof INFORMATION_ROUTE]['NAME']
export type PlanningRouteNamesType = (typeof PLANNING_ROUTE)[keyof typeof PLANNING_ROUTE]['NAME']
export type TransactionRouteNamesType = (typeof TRANSACTION_ROUTE)[keyof typeof TRANSACTION_ROUTE]['NAME']

export type ProtectedRouteNamesType
    = SystemRouteNamesType
        | InformationRouteNamesType
        | PlanningRouteNamesType
        | TransactionRouteNamesType