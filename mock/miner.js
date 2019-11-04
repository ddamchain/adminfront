import Mock from 'mockjs'

const MinerList = []
const count = 100

for (let i = 0; i < count; i++) {
  MinerList.push(Mock.mock({
    id: '@increment',
    fingerprint: '@title(3)',
    info: '@title(5)',
    publicKey: '@title(20)',
    'status|1': ['active', 'inactive'],
    duration: '@integer(300, 5000)',
    activeTime: '@datetime',
    lastActiveTime: '@datetime'
  }))
}

export default [
  {
    url: '/miner/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20, sort } = config.query

      let mockList = MinerList
      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/miner/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const miner of MinerList) {
        if (miner.id === +id) {
          return {
            code: 20000,
            data: miner
          }
        }
      }
    }
  },

  {
    url: '/miner/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/miner/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

