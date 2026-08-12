import type { Component } from "vue"
import DefaultLayout from "./default.vue"
import EmptyLayout from "./empty.vue"

export type LayoutType = 'default' | 'empty'

export const layouts: Record<LayoutType, Component> = {
  'default': DefaultLayout,
  'empty': EmptyLayout,
}