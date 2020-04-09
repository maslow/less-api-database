import { Database } from './index'
import { Document } from './document'
import { CollectionReference } from "./database/collection"
import { throwNotSupportErrorFunc } from "./util"

/**
 * 集合模块
 *
 * @author maslow
 */
export class Collection extends CollectionReference {
  /**
   * 初始化
   *
   * @internal
   *
   * @param db    - 数据库的引用
   * @param coll  - 集合名称
   */
  /* eslint-disable no-useless-constructor */
  constructor(db: Database, coll: string) {
    super(db, coll)

    this.watch = throwNotSupportErrorFunc('Collection::watch()')
    this.aggregate = throwNotSupportErrorFunc('Collection::aggregate()')
    
  }

  /**
   * 获取文档的引用
   *
   * @param docID - 文档ID
   */
  doc(docID?: string | number): Document {
    if (typeof docID !== 'string' && typeof docID !== 'number') {
      throw new Error('docId必须为字符串或数字')
    }
    return new Document(this._db, this._coll, docID)
  }

  /**
   * 添加一篇文档
   *
   * @param data - 数据
   */
  add(data: Object, callback?: any): Promise<any> {
    let docRef = new Document(this._db, this._coll, undefined)
    return docRef.create(data, callback)
  }

}
