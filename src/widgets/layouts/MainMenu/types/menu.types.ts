import { Component } from "vue"

export interface MenuItem {
  id: string
  icon?: Component
  title: string
  pageName?: string
  children?: SubMenuItem[]
}

interface SubMenuItem {
  id: string
  icon?: Component
  title: string
  pageName: string
}