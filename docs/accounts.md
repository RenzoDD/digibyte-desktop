# The structure of a DigiByte Account File

Each DigiByte Desktop Account File contain four fields 

| Field   | Description                                    |
|---------|----------------------------------------------- |
| file    | Object type (`key`, `account`, `transaction`)  |
| id      | Account's unique random hex string             |
| name    | Account's name                                 |
| type    | Account's type (`derived`, `single`, `mobile`) |
| network | Network (`livenet`, `testnet`)                 |
| secret? | Key's unique checksum hex string               |

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
  "file": "account",
  "id": "f22bcacf9bfbcdcc7b1d5fcd2dd2c8f0a462148e3f89c9f16e10a34159c84fee",
  "name": "Personal Savings",
  "type": "derived",
  "network": "livenet",
  "secret": "2843b8e535e788bf3025c53c67153ac70af2c7554b5b537c0b2e4d5aff2716b25",
  "xpub": "xpub6Bonb2tB3BAtENfxYitKuXCt7meqinUd25mX27kwuxdCsWgPe6N8xWha54WwHmL8vdZYT1tkjecfLFyHrdEGyPxLaqLNiNzGMnNYQX9FzYn",    
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
  "file": "account",
  "id": "44aa95d14a22b9bab50bd915cb12025e102af5696bda00d03524bc1246de05ed",
  "name": "digiassetX Web Wallet",
  "type": "single",
  "network": "livenet",
  "secret": "43a8fcba10553b68fa62d0f2a962aa57b026b05701fee4c8c1ecd9525a0d8dd9",
  "addresses": [
    "DF8mauGJXFXrFVgCvsoFfMfteVzMwEnnk5",
    "dgb1q8djyrt9ps7v3ux8w7kayhz0crl4nu5ye3ux8um",
    "dgb1qry8984t722qrl2xe83ruhnn8sdkqy94f2ry0nw"
  ]
}
```

## Mobile Account

| Field | Description                                                   |
|-------|---------------------------------------------------------------|
| xpub  | Master public key to generate addresses `(m/0'/change/index)` |

```json
{
  "file": "account",
  "id": "ccd1ed440fbd6c3200975a155c6755b6c143797624f3596c49eac8aa45b9053e",
  "name": "Mobile Account",
  "type": "mobile",
  "network": "livenet",
  "secret": "e270d311b49033f31dc0333c9ef57c625c6e468e06d478d5d87af21883825061",
  "xpub": "xpub69WwFTuz6CFYVTPbTtbit6HxdeCpyvkMLBD52JqGFaAsRMKKYDbm9Ewnz4jf9fc2HyFgZKhTUry7THfsY9sKEMpmwMMqN4MTURG3w8f6WUR",    
  "address": "legacy",
  "path": "m/0'",
  "change": 0,
  "external": 0
}
```