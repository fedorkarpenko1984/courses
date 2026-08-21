import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'access_tokens.store': { paramsTuple?: []; params?: {} }
    'access_tokens.me': { paramsTuple?: []; params?: {} }
    'course.get_all': { paramsTuple?: []; params?: {} }
    'course.get_course': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'course.create': { paramsTuple?: []; params?: {} }
    'course.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'course.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'chapters.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'chapters.store': { paramsTuple?: []; params?: {} }
    'chapters.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'chapters.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subchapter.store': { paramsTuple?: []; params?: {} }
    'subchapter.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subchapter.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.store': { paramsTuple?: []; params?: {} }
    'lessons.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'access_tokens.store': { paramsTuple?: []; params?: {} }
    'course.create': { paramsTuple?: []; params?: {} }
    'chapters.store': { paramsTuple?: []; params?: {} }
    'subchapter.store': { paramsTuple?: []; params?: {} }
    'lessons.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'access_tokens.me': { paramsTuple?: []; params?: {} }
    'course.get_all': { paramsTuple?: []; params?: {} }
    'course.get_course': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'chapters.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'access_tokens.me': { paramsTuple?: []; params?: {} }
    'course.get_all': { paramsTuple?: []; params?: {} }
    'course.get_course': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'chapters.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'course.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'chapters.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subchapter.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'course.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'chapters.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subchapter.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}