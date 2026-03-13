import { db } from '../../config/db.js';

export async function query<T = any>(
  text: string,
  params: any[] = []
): Promise<{ rows: T[] }> {
  try {
    // 1. Translate Postgres specific syntax to SQLite
    // Map $1, $2, etc to ?
    let sqliteSql = text.replace(/\$\d+/g, '?');
    
    // Map NOW() to CURRENT_TIMESTAMP
    sqliteSql = sqliteSql.replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP');
    
    // 2. Determine execution method
    // If the query has SELECT or RETURNING, we use .all() to get rows back.
    const isReturning = /RETURNING/i.test(sqliteSql);
    const isSelect = /SELECT/i.test(sqliteSql);
    
    if (isSelect || isReturning) {
      const rows = db.prepare(sqliteSql).all(...params) as T[];
      return { rows };
    } else {
      const result = db.prepare(sqliteSql).run(...params);
      return { rows: [] };
    }
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      err.isUniqueViolation = true;
    }
    if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      err.isForeignKeyViolation = true;
    }
    throw err;
  }
}

