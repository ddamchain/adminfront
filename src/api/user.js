import request from '@/utils/request'
import axios from 'axios'

export function login(data) {
  console.log(data)
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  console.log(data)
  return request({
    url: '/ops/admin/info',
    method: 'post'
  })
}

export function logout(data) {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function fetchList(query) {
  return request({
    url: '/ops/admin/list',
    method: 'post',
    params: query
  })
}

export function getUser(userId) {
  return request({
    url: '/ops/admin/detail',
    method: 'post',
    params: { userId }
  })
}

export function createUser(data) {
  return request({
    url: '/ops/admin/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/ops/admin/modify',
    method: 'post',
    data
  })
}
export function deleteUser(data) {
  return request({
    url: '/ops/admin/remove',
    method: 'post',
    data
  })
}
export function report(data) {
  return request({
    url: '/ops/admin/report',
    method: 'post',
    data
  })
}
export function getLogList(data) {
  return request({
    url: '/ops/admin/list_ope_logs',
    method: 'post',
    data
  })
}
export function updateAccessLog(data) {
  return request({
    url: '/ops/admin/updateAccessLog',
    method: 'post',
    data
  })
}
