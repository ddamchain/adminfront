import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    tradeTime: '@datetime',
    fingerprint: '@first',
    senderPublicKey: '@first',
    receiverPublicKey: '@first',
    senderSignature: '@first',
    receiverSignature: '@first',
    'type|1': ['新采', '二手'],
    'status|1': ['success', 'failure'],
  }))
}

export default [
  {
    url: '/trade/list',
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
    url: '/trade/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const trade of List) {
        if (trade.id === +id) {
          return {
            code: 20000,
            data: trade
          }
        }
      }
    }
  }
]

