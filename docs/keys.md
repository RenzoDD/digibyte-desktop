# The structure of a DigiByte Key File

Each DigiByte Desktop Key File contain four fields 

| Field     | Description                                           |
|-----------|-------------------------------------------------------|
| file      | Object type (`key`, `account`, `transaction`)         |
| id        | Key's unique checksum hex string                      |
| name      | Key's name                                            |
| type      | Private Key's type (`mnemonic`, `keys`)               |
| words?    | If required, represents the mnemonic phrase length    |
| secret    | AES-256-CBC with no IV Encrypted `mnemonic` or `WIFs` |

# Examples

Examples of types of private keys objects.

## Mnemonic Phrase

### Without BIP39 Passphrase

Mnemonic: `"knee brass dumb snow design shaft they wood friend animal fashion treat"`

Seed: `"8257c1bd9c4e2a1924a3d1e8946a73acdbb7508e1f4aa70291358ca91104aed5701f06969811e0cceb4672e97c8d3df8575fa96c59bdfe30dcbe58b0cf42a8b6"`

Password: `""`

```json
{
  "file": "key",
  "id": "e270d311b49033f31dc0333c9ef57c625c6e468e06d478d5d87af21883825061",
  "name": "DigiByte Mobile",
  "type": "mnemonic",
  "words": 12,
  "passphrase": false,
  "secret": "2ecdc57fdf1c3812531c550af796aa07f7e33ef5a0e5dec6b4664c5fa1fec1b2ee38fe932362f9ca2918d0113a0cb62f64eed248df9c4d1f22f0f8fac67733f6c96e937ffbe6e7613c21c5ee926fbef5fb50fcc0f932f3d765482839ce4ac429c27c00a6e577a776dd6aff37649b284246ac4df18709616c5eb08185cb6188aac6c02b4a48f4c8582e2153fa716c74de"
}
```

### With BIP39 Passphrase

Mnemonic: `"ask ask ask"`

BIP39 Passphrase: `"digibyte-rocks!"`

Seed: `"a0bab8eb5a9d794714bada94db385d3f0960dc48a0b0730179e63dc139b553976da0fa9135a8dd8c47451caaafa3476118f08a2067123c58d739b362852c0ce4"`

Password: `"Ka9wj%"`

```json
{
  "file": "key",
  "id": "843b8e535e788bf3025c53c67153ac70af2c7554b5b537c0b2e4d5aff2716b25",
  "name": "Test Key",
  "type": "mnemonic",
  "words": 3,
  "passphrase": true,
  "secret": "0ca658b24ac7bd24e751641fa2df99b68e5d15621aa3e11dfc89d163f2d62dbe3ad1ef1d54237f67302ef96b15720e47570af6e1553748b1006e1fb0d8dad2b1c1d0f20922da2206d1e30569822672338f925f219e0523febe5deac30415632e30e2776079f31fab11d286470f64397512dbae8ab9e80850f33c8a3be32b40e049e886444eaa530e2f5352d5b247d725"
}
```

## Private Keys

WIFs: 
- `"KzJ9mPDPk2YLi6bCABEBF6JaiELxAUWLTXcWjDkh1rhMxbdq31ow"`
- `"L47LQjBh97jnJ993qQUNndY2zPpR5pqEz199tExEKQDwsxurUx1S"`
- `"L4e63u1bP72e99bGtabBxzVu6WvAeHnAbu6iCPejbwex1RLC1kJE"`

Password: `"Ka$i2k6"`

```json
{
  "file": "key",
  "id": "43a8fcba10553b68fa62d0f2a962aa57b026b05701fee4c8c1ecd9525a0d8dd9",
  "name": "digiassetX",
  "type": "keys",
  "secret": [
    "478c14d84db4655e46a190215c94e9a12bc33911184b8e7acff09bdbb2f17f393e7d3fe0f6f14c0a187ac517cd7aab6867797739d8065d71b5c70ebfae9164f7",
    "2e28a0a26f36d7608dc7886baa135e5030b25a5370594ed7e17acf0d245d2da0594f1bc6b36ef94dc02cb7b579097581405caf0ba14cbd3fb8b01ffef3c36c85",
    "c6468be707263f10e0ae8d87b8ce300efd7f1e8077cce34f4f60c8c9126fef9ddd6df51d2cf90ec1803733e9e98da69e4be9ca0e0fc804ef9eafc2097aa44e83"
  ]
}
```