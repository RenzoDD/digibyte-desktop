# Storage

The wallet use LevelDB to store the data. LevelDB is a key-value database and follows this structure:

| Key                              | Value                      |
|----------------------------------|----------------------------|
| `keys`                           | Array of key ID's          |
| `{key-id}@keys`                  | Object of key data         |
| `accounts`                       | Array of account ID's      |
| `{account-id}@accounts`          | Object of account data     |
| `{account-id}@account-movements` | Array of account movements |
| `{account-id}@account-mempool`   | Array of account mempool   |
| `{account-id}@account-balance`   | Object of account balance  |
| `{txid}@tx-data`                 | Object of transaction data |
| `exchange`                       | Object of exchange data    |