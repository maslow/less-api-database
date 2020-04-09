import { createPromiseCallback } from './database/lib/util'
import { Database } from './index'
import { Util } from './database/util'
import { UpdateSerializer } from './database/serializer/update'
import { serialize } from './database/serializer/datatype'
import { UpdateCommand } from './database/commands/update'
import { QueryType } from './database/constant'
import { DocumentReference } from "./database/document"
import { throwNotSupportErrorFunc } from "./util"

/**
 * 文档模块
 *
 * @author maslow
 */
export class Document extends DocumentReference{
 
  /**
   * 初始化
   *
   * @internal
   *
   * @param db    - 数据库的引用
   * @param coll  - 集合名称
   * @param docID - 文档ID
   */
  constructor(db: Database, coll: string, docID: string | number, projection = {}) {
    super(db, coll, docID, projection)
    this._db = db

    this.watch = throwNotSupportErrorFunc('watch()')
  }

  /**
   * 创建一篇文档
   *
   * @param data - 文档数据
   * @internal
   */
  create(data: any, callback?: any): Promise<any> {
    callback = callback || createPromiseCallback()

    let params = {
      collectionName: this._coll,
      // data: Util.encodeDocumentDataForReq(data, false, false)
      data: serialize(data)
    }

    if (this.id) {
      params['_id'] = this.id
    }

    this.request
      .send('database.addDocument', params)
      .then(res => {
        if (res.code) {
          callback(0, res)
        } else {
          callback(0, {
            id: res.data._id,
            requestId: res.requestId
          })
        }
      })
      .catch(err => {
        callback(err)
      })

    return callback.promise
  }

  /**
   * 创建或添加数据
   *
   * 如果文档ID不存在，则创建该文档并插入数据，根据返回数据的 upserted_id 判断
   * 添加数据的话，根据返回数据的 set 判断影响的行数
   *
   * @param data - 文档数据
   */
  set(data: Object, callback?: any): Promise<any> {
    callback = callback || createPromiseCallback()

    if (!this.id) {
      return Promise.resolve({
        code: 'INVALID_PARAM',
        message: 'docId不能为空'
      })
    }

    if (!data || typeof data !== 'object') {
      return Promise.resolve({
        code: 'INVALID_PARAM',
        message: '参数必需是非空对象'
      })
    }

    if (data.hasOwnProperty('_id')) {
      return Promise.resolve({
        code: 'INVALID_PARAM',
        message: '不能更新_id的值'
      })
    }

    let hasOperator = false
    const checkMixed = objs => {
      if (typeof objs === 'object') {
        for (let key in objs) {
          if (objs[key] instanceof UpdateCommand) {
            hasOperator = true
          } else if (typeof objs[key] === 'object') {
            checkMixed(objs[key])
          }
        }
      }
    }
    checkMixed(data)

    if (hasOperator) {
      //不能包含操作符
      return Promise.resolve({
        code: 'DATABASE_REQUEST_FAILED',
        message: 'update operator complicit'
      })
    }

    const merge = false //data不能带有操作符
    let param = {
      collectionName: this._coll,
      queryType: QueryType.DOC,
      // data: Util.encodeDocumentDataForReq(data, merge, false),
      data: serialize(data),
      multi: false,
      merge,
      upsert: true
    }

    if (this.id) {
      param['query'] = { _id: this.id }
    }

    this.request
      .send('database.updateDocument', param)
      .then(res => {
        if (res.code) {
          callback(0, res)
        } else {
          callback(0, {
            updated: res.data.updated,
            upsertedId: res.data.upserted_id,
            requestId: res.requestId
          })
        }
      })
      .catch(err => {
        callback(err)
      })

    return callback.promise
  }

  /**
   * 更新数据
   *
   * @param data - 文档数据
   */
  update(data: Object, callback?: any) {
    callback = callback || createPromiseCallback()

    if (!data || typeof data !== 'object') {
      return Promise.resolve({
        code: 'INVALID_PARAM',
        message: '参数必需是非空对象'
      })
    }

    if (data.hasOwnProperty('_id')) {
      return Promise.resolve({
        code: 'INVALID_PARAM',
        message: '不能更新_id的值'
      })
    }

    const query = { _id: this.id }
    const merge = true //把所有更新数据转为带操作符的
    const param = {
      collectionName: this._coll,
      // data: Util.encodeDocumentDataForReq(data, merge, true),
      data: UpdateSerializer.encode(data),
      query: query,
      queryType: QueryType.DOC,
      multi: false,
      merge,
      upsert: false
    }

    this.request
      .send('database.updateDocument', param)
      .then(res => {
        if (res.code) {
          callback(0, res)
        } else {
          callback(0, {
            updated: res.data.updated,
            upsertedId: res.data.upserted_id,
            requestId: res.requestId
          })
        }
      })
      .catch(err => {
        callback(err)
      })

    return callback.promise
  }

  /**
   * 删除文档
   */
  remove(callback?: any): Promise<any> {
    callback = callback || createPromiseCallback()

    const query = { _id: this.id }
    const param = {
      collectionName: this._coll,
      query: query,
      queryType: QueryType.DOC,
      multi: false
    }

    this.request
      .send('database.deleteDocument', param)
      .then(res => {
        if (res.code) {
          callback(0, res)
        } else {
          callback(0, {
            deleted: res.data.deleted,
            requestId: res.requestId
          })
        }
      })
      .catch(err => {
        callback(err)
      })

    return callback.promise
  }

  /**
   * 返回选中的文档（_id）
   */
  get(callback?: any): Promise<any> {
    callback = callback || createPromiseCallback()

    const query = { _id: this.id }
    const param = {
      collectionName: this._coll,
      query: query,
      queryType: QueryType.DOC,
      multi: false,
      projection: this.projection
    }
    this.request
      .send('database.queryDocument', param)
      .then(res => {
        if (res.code) {
          callback(0, res)
        } else {
          const documents = Util.formatResDocumentData(res.data.list)
          callback(0, {
            data: documents,
            requestId: res.requestId,
            total: res.TotalCount,
            limit: res.Limit,
            offset: res.Offset
          })
        }
      })
      .catch(err => {
        callback(err)
      })

    return callback.promise
  }
}
