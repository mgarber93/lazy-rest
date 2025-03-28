import Database from 'better-sqlite3'
import path from 'path'
import {singleton} from 'tsyringe'

@singleton()
export class DatabaseProvider {
  private db: Database.Database | null = null
  
  public getDatabase(): Database.Database {
    if (!this.db) {
      const dbPath = path.resolve(__dirname, '..', 'lazy-rest.db')
      this.db = new Database(dbPath)
      this.db.pragma('journal_mode = WAL')
    }
    return this.db
  }
}

