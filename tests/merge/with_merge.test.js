
const { Request } = require('./node_modules/less-api-client/dist/commonjs/request')

const { Db } = require('../../dist/commonjs/index')

// 这里使用 less-framework 来进行测试，请自行启动 less-framework 服务
function getAccessToken() {
  return 'eyJ1aWQiOjEsInJvbGVzIjpbMV0sInR5cGUiOiJhZG1pbiIsImV4cGlyZSI6MTYxNjQ5NzU1ODIxNn0=.6f93ab13ad1066b8eb4b9efbcd346a1a'
}
Db.reqClass = Request
Db.getAccessToken = getAccessToken

const db = new Db({
  entryUrl: 'http://localhost:8080/admin/entry',
  getAccessToken: getAccessToken
})


describe('Db merge', async () => {

  it('with & merge', async () => {
    const res = await db.collection('admin')
      .with({
        query: db.collection('user_role').leftJoin('role', 'id', 'role_id'),
        from: 'uid',
        to: 'uid',
        as: 'roles'
      })
      .merge()

    for (let data of res.data) {
      console.log(data)
    }
  })

  it('withOne & merge', async () => {
    const res = await db.collection('admin')
      .withOne({
        query: db.collection('user_role'),
        from: 'uid',
        to: 'uid',
        as: 'role'
      })
      .merge()

    for (let data of res.data) {
      console.log(data)
    }
  })

  it('withOne & merge (sub query withOne)', async () => {
    const sub_query = db.collection('user_role')
      .field(['uid', 'role_id'])
      .withOne({
        query: db.collection('role'),
        from: 'role_id',
        to: 'id',
        as: 'info'
      })

    const res = await db.collection('admin')
      .withOne({
        query: sub_query,
        from: 'uid',
        to: 'uid',
        as: 'role',
      })
      .merge()

    for (let data of res.data) {
      console.log(data)
    }
  })
})