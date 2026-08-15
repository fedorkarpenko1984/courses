/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'access_tokens.store': {
    methods: ["POST"],
    pattern: '/admin/login',
    tokens: [{"old":"/admin/login","type":0,"val":"admin","end":""},{"old":"/admin/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['access_tokens.store']['types'],
  },
  'access_tokens.me': {
    methods: ["GET","HEAD"],
    pattern: '/admin/me',
    tokens: [{"old":"/admin/me","type":0,"val":"admin","end":""},{"old":"/admin/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['access_tokens.me']['types'],
  },
  'course.get_all': {
    methods: ["GET","HEAD"],
    pattern: '/admin/course',
    tokens: [{"old":"/admin/course","type":0,"val":"admin","end":""},{"old":"/admin/course","type":0,"val":"course","end":""}],
    types: placeholder as Registry['course.get_all']['types'],
  },
  'course.get_course': {
    methods: ["GET","HEAD"],
    pattern: '/admin/course/:id',
    tokens: [{"old":"/admin/course/:id","type":0,"val":"admin","end":""},{"old":"/admin/course/:id","type":0,"val":"course","end":""},{"old":"/admin/course/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['course.get_course']['types'],
  },
  'course.create': {
    methods: ["POST"],
    pattern: '/admin/course',
    tokens: [{"old":"/admin/course","type":0,"val":"admin","end":""},{"old":"/admin/course","type":0,"val":"course","end":""}],
    types: placeholder as Registry['course.create']['types'],
  },
  'course.update': {
    methods: ["PUT"],
    pattern: '/admin/course/:id',
    tokens: [{"old":"/admin/course/:id","type":0,"val":"admin","end":""},{"old":"/admin/course/:id","type":0,"val":"course","end":""},{"old":"/admin/course/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['course.update']['types'],
  },
  'course.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/course/:id',
    tokens: [{"old":"/admin/course/:id","type":0,"val":"admin","end":""},{"old":"/admin/course/:id","type":0,"val":"course","end":""},{"old":"/admin/course/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['course.destroy']['types'],
  },
  'chapters.show': {
    methods: ["GET","HEAD"],
    pattern: '/admin/chapter/:id',
    tokens: [{"old":"/admin/chapter/:id","type":0,"val":"admin","end":""},{"old":"/admin/chapter/:id","type":0,"val":"chapter","end":""},{"old":"/admin/chapter/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['chapters.show']['types'],
  },
  'chapters.store': {
    methods: ["POST"],
    pattern: '/admin/chapter',
    tokens: [{"old":"/admin/chapter","type":0,"val":"admin","end":""},{"old":"/admin/chapter","type":0,"val":"chapter","end":""}],
    types: placeholder as Registry['chapters.store']['types'],
  },
  'chapters.update': {
    methods: ["PUT"],
    pattern: '/admin/chapter/:id',
    tokens: [{"old":"/admin/chapter/:id","type":0,"val":"admin","end":""},{"old":"/admin/chapter/:id","type":0,"val":"chapter","end":""},{"old":"/admin/chapter/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['chapters.update']['types'],
  },
  'chapters.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/chapter/:id',
    tokens: [{"old":"/admin/chapter/:id","type":0,"val":"admin","end":""},{"old":"/admin/chapter/:id","type":0,"val":"chapter","end":""},{"old":"/admin/chapter/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['chapters.destroy']['types'],
  },
  'subchapter.store': {
    methods: ["POST"],
    pattern: '/admin/subchapter',
    tokens: [{"old":"/admin/subchapter","type":0,"val":"admin","end":""},{"old":"/admin/subchapter","type":0,"val":"subchapter","end":""}],
    types: placeholder as Registry['subchapter.store']['types'],
  },
  'subchapter.update': {
    methods: ["PUT"],
    pattern: '/admin/subchapter/:id',
    tokens: [{"old":"/admin/subchapter/:id","type":0,"val":"admin","end":""},{"old":"/admin/subchapter/:id","type":0,"val":"subchapter","end":""},{"old":"/admin/subchapter/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['subchapter.update']['types'],
  },
  'subchapter.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/subchapter/:id',
    tokens: [{"old":"/admin/subchapter/:id","type":0,"val":"admin","end":""},{"old":"/admin/subchapter/:id","type":0,"val":"subchapter","end":""},{"old":"/admin/subchapter/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['subchapter.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
