import {inject, singleton} from 'tsyringe'
import Database from 'better-sqlite3'
import {DatabaseProvider} from './database'

@singleton()
export class MessageModel {
  private db: Database.Database

  constructor(
    @inject(DatabaseProvider) private databaseProvider: DatabaseProvider,
  ) {
    this.db = this.databaseProvider.getDatabase()
    this.initialize()
  }
  
  // Initialize the messages table
  private initialize(): void {
    this.db.prepare(`
        CREATE TABLE IF NOT EXISTS messages
        (
            id
            INTEGER
            PRIMARY
            KEY
            AUTOINCREMENT,
            content
            TEXT
            NOT
            NULL,
            created_at
            DATETIME
            DEFAULT
            CURRENT_TIMESTAMP
        )
    `).run()
  }
  
  // Persist a new message and return its ID
  public createMessage(content: string): number {
    const stmt = this.db.prepare('INSERT INTO messages (content) VALUES (?)')
    const info = stmt.run(content)
    return info.lastInsertRowid as number
  }
  
  // Retrieve all messages, most recent first
  public getMessages(): any[] {
    const stmt = this.db.prepare('SELECT * FROM messages ORDER BY created_at DESC')
    return stmt.all()
  }
}