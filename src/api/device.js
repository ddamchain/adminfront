import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/ops/device/list',
    method: 'post',
    params: query
  })
}

export function getDevice(deviceId) {
  return request({
    url: '/ops/device/detail',
    method: 'post',
    params: { deviceId }
  })
}

export function createDevice(data) {
  return request({
    url: '/ops/device/add',
    method: 'post',
    data
  })
}

export function updateDevice(data) {
  return request({
    url: '/ops/device/modify',
    method: 'post',
    data
  })
}

export function deleteDevice(data) {
  return request({
    url: '/ops/device/remove',
    method: 'post',
    data
  })
}
