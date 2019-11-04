import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    fingerprint: '@title(20)',
    info: '@title(20)',
    publicKey: '@title(20)',
    'status|1': ['active', 'inactive'],
    duration: '@integer(300, 5000)',
    activeTime: '@datetime',
    createTime: '@datetime'
  }))
}

export default [
  {
    url: '/device/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20, sort } = config.query

      let mockList = List
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
    url: '/device/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const device of List) {
        if (device.id === +id) {
          return {
            code: 20000,
            data: device
          }
        }
      }
    }
  },

  {
    url: '/device/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/device/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

