# The structure of a DigiByte Key File

Each DigiByte Desktop Key File contain four fields 

| Field     | Description                                           |
|-----------|-------------------------------------------------------|
| id        | Key's unique random hex string                        |
| name      | Key's name                                            |
| type      | Private Key's type (`seed`, `keys`)                   |
| words?    | If required, represents the mnemonic phrase length    |
| secret    | AES-256-CBC with no IV Encrypted `mnemonic` or `WIFs` |

# Examples

Examples of types of private keys objects.

## Mnemonic Phrase

### Without BIP39 Passphrase

Mnemonic: `"knee brass dumb snow design shaft they wood friend animal fashion treat"`

Seed: `"8257c1bd9c4e2a1924a3d1e8946a73acdbb7508e1f4aa70291358ca91104aed5701f06969811e0cceb4672e97c8d3df8575fa96c59bdfe30dcbe58b0cf42a8b6"`

```json
{
  "id": "e1f2cd9f46ef0a309ea6841a6ce5db7b9c65bb8cb5e9e112e5dd85653ccc4cc0",
  "name": "DigiByte Mobile",
  "type": "seed",
  "words": 12,
  "secret": "718c7e7942fcacd08c9b4af6a6468551ec34723a189ea87d088129898849c072d6fd2dbefb580bee3e5db0f4f02ebd4eff905f0a3d49ffbd861a62c033fea3f3fab9a64ae9505a00d54a3be3cb29b6b8"
}
```

### With BIP39 Passphrase

Mnemonic: `"ask ask ask"`

BIP39 Passphrase: `"digibyte-rocks!"`

Seed: `"a0bab8eb5a9d794714bada94db385d3f0960dc48a0b0730179e63dc139b553976da0fa9135a8dd8c47451caaafa3476118f08a2067123c58d739b362852c0ce4"`

```json
{
  "id": "1502e0797e56c58a7adf2a493e639f3c4a8da453f3267ead2f5fdcffbef9c849",
  "name": "Test Account",
  "type": "seed",
  "words": 3,
  "secret": "16d0068de8405f11731323fde1a2d7949fdfd77b288596fb09b7775b5b334990fc4f43d1fbc4886a92e53143db91165f23b29e8121d1cd86547a9b16573c80bdd21300e332b5c52071a9e4b181da67a9"
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
  "id": "519526c6d1253cfae0011216d9426b7327e597673646d0d4519ba162b2c117c4",
  "name": "digiassetX",
  "type": "keys",
  "secret": [
    "478c14d84db4655e46a190215c94e9a12bc33911184b8e7acff09bdbb2f17f393e7d3fe0f6f14c0a187ac517cd7aab6867797739d8065d71b5c70ebfae9164f7",
    "2e28a0a26f36d7608dc7886baa135e5030b25a5370594ed7e17acf0d245d2da0594f1bc6b36ef94dc02cb7b579097581405caf0ba14cbd3fb8b01ffef3c36c85",
    "c6468be707263f10e0ae8d87b8ce300efd7f1e8077cce34f4f60c8c9126fef9ddd6df51d2cf90ec1803733e9e98da69e4be9ca0e0fc804ef9eafc2097aa44e83"
  ]
}
```