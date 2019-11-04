import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/ops/wallet/list',
    method: 'post',
    params: query
  })
}

export function requestPass(query) {
  return request({
    url: '/ops/wallet/requestPass',
    method: 'post',
    data: query
  })
}
export function requestPass2(query) {
  return request({
    url: '/ops/wallet/requestPass2',
    method: 'post',
    data: query
  })
}
