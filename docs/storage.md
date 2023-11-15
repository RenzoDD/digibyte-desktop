# Storage

The wallet use LevelDB to store the data. LevelDB is a key-value database and follows this structure:

| Key             | Value              |
|-----------------|--------------------|
| `keys`          | Array of key ID's  |
| `{key-id}@keys` | Object of key data |