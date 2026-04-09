import { ProtectedRouteNamesType } from "@/shared/types/routes"
import { Component } from "vue"

export interface MenuItem {
  id: string
  icon?: Component
  title: string
  pageName?: ProtectedRouteNamesType
  children?: SubMenuItem[]
}

interface SubMenuItem {
  id: string
  icon?: Component
  title: string
  pageName: ProtectedRouteNamesType
}