import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/ops/miner/list',
    method: 'post',
    data
  })
}

export function getMiner(minerId) {
  return request({
    url: '/ops/miner/detail',
    method: 'post',
    params: { minerId }
  })
}

export function createMiner(data) {
  return request({
    url: '/ops/miner/add',
    method: 'post',
    data
  })
}
export function resetMiner(data) {
  return request({
    url: '/ops/miner/unbind',
    method: 'post',
    data
  })
}
export function applyMiner(data) {
  return request({
    url: '/ops/miner/onchain/manual',
    method: 'post',
    data
  })
}

export function updateMiner(data) {
  return request({
    url: '/ops/miner/modify',
    method: 'post',
    data
  })
}
