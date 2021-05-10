const { client } = require('./db')

const DICT_FIND_ONE_QUERY = `
  select value
  from stas_dict
  where key = $1::text
`

const DICT_UPSERT_EXEC = `
  insert into stas_dict(key, value)
  values($1::text, $2::text)
  on conflict (key) do update set value = $2::text
`

const DICT_DELETE_EXEC = `
  delete
  from stas_dict
  where key = $1::text
`

async function readDictValue(key) {
  const tokenResponse = await client.query(DICT_FIND_ONE_QUERY, [key])
  if (tokenResponse.rows.length === 1 && tokenResponse.rows[0].value) {
    return tokenResponse.rows[0].value
  } else {
    return null
  }
}

async function updateDictValue(key, value) {
  if (value) {
    return await client.query(DICT_UPSERT_EXEC, [key, value])
  } else {
    return await client.query(DICT_DELETE_EXEC, [key])
  }
}

module.exports = {
  readDictValue,
  updateDictValue,
}
