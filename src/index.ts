
import { Db } from './database'
import { throwNotSupportErrorFunc } from "./util"
import { Collection } from "./collection"

export { Query } from './database/query'
export { Collection } from './collection'
export { Document as DocumentReference } from './document'

/**
 * 数据库模块
 *
 * @author maslow
 */
export class Database extends Db {

  constructor(config?: any) {
    super(config)
    this.startTransaction = throwNotSupportErrorFunc('startTransaction()')
    this.runTransaction = throwNotSupportErrorFunc('runTransaction()')
    this.createCollection = throwNotSupportErrorFunc('createCollection()')
  }

  /**
   * 获取集合的引用
   *
   * @param collName - 集合名称
   * @override
   */
  collection(collName: string): Collection {
    if (!collName) {
      throw new Error('Collection name is required')
    }
    return new Collection(this, collName)
  }
}
