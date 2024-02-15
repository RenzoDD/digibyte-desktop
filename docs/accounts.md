# The structure of a DigiByte Account File

Each DigiByte Desktop Account File contain four fields 

| Field   | Description                                                   |
|---------|---------------------------------------------------------------|
| id      | Account's unique random hex string                            |
| name    | Account's name                                                |
| type    | Account's type (`derived`, `single`, `mobile`)                |
| network | Network (`livenet`, `testnet`)                                |
| secret? | Key's unique random hex string, absent for view-only accounts |

# Examples

## Derived Account

| Field    | Description                              |
|----------|------------------------------------------|
| xpub     | Master public key to generate addresses  |
| purpose  | Type of address type (`44`, `49`, `84`)  |
| account  | Index of the account acording BIP32      |
| change   | Next index to generate a change key-pair |
| external | Next index to generate a new key-pair    |

```json
{
  "id": "",
  "name": "",
  "type": "derived",
  "network": "livenet",
  "secret":"1502e0797e56c58a7adf2a493e639f3c4a8da453f3267ead2f5fdcffbef9c849",
  "xpub":"xpub...",
  "purpose": 44,
  "address": "legacy",
  "path": "m/44'/20'/0'",
  "account": 0,
  "change": 0,
  "external": 0
}
```

## Single Account

| Field     | Description                  |
|-----------|------------------------------|
| addresses | Array of generated addresses |

```json
{
  "id": "",
  "name": "",
  "type": "single",
  "network": "livenet",
  "secret":"519526c6d1253cfae0011216d9426b7327e597673646d0d4519ba162b2c117c4",
  "addresses": [
    "",
    "",
    "",
  ]
}
```

## Mobile Account

| Field | Description                                                   |
|-------|---------------------------------------------------------------|
| xpub  | Master public key to generate addresses `(m/0'/change/index)` |

```json
{
  "id": "",
  "name": "",
  "type": "mobile",
  "network": "livenet",
  "secret":"e1f2cd9f46ef0a309ea6841a6ce5db7b9c65bb8cb5e9e112e5dd85653ccc4cc0",
  "xpub":"xpub...",
  "address": "legacy",
  "path": "m/0'",
  "change": 0,
  "external": 0
}
```