# src/persistence

Database access layer — all `pg.Pool` queries live here, not in IPC handlers.

## Purpose

Keep SQL out of `src/main/index.js`. Each file in this directory owns one domain.

## Example

```js
// src/persistence/users.js
import { pool } from './pool.js'

export async function findUser(username) {
  const { rows } = await pool.query(
    'SELECT id, password_hash FROM wmsm.users WHERE username = $1',
    [username]
  )
  return rows[0] ?? null
}
```

## Rules

- Never return raw DB error messages to callers — throw a generic Error
- Use parameterised queries (`$1`, `$2`) — no string interpolation
- Pool instance is shared; import from `./pool.js`, do not create new pools
