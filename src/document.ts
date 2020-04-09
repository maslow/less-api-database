import { Database } from './index'
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

}
