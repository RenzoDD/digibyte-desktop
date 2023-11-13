# The structure of a DigiByte Key File

Each DigiByte Desktop Key File contain four fields 

| Field     | Description                                                   |
|-----------|---------------------------------------------------------------|
| type      | Type of private key (`seed`, `keys`)                          |
| words?    | If required, represents the mnemonic phrase length            |
| secret    | AES-256-CBC with no IV Encrypted `mnemonic` or `private keys` |

# Examples

Examples of types of private keys objects.

## Mnemonic Phrase

Mnemonic: `"ask ask ask"`

Seed: `"6fa134086db67fe0a06c9779ab3815bda09280dacf7b5ee64bc7850b29af565e680788bdc4e6810277a38a2c4e57cb95b54c4d5d928a1a6f3772002b6d163efe"`

Password: `"digibyte-rocks!"`

```json
{
  "type": "seed",
  "words": 3,
  "secret": "a63038af37e862350fad65cf082dbeeabfc622dd1cc595fb35a70ae8b738dcfa2c3c248ec64d15500ea2abff5360bad5748ab11a43163186d219ec8387bc8c4badb53b3b177bb1860365ba2dbd1db7d0"
}
```

## Private Keys

WIFs: `"KzJ9mPDPk2YLi6bCABEBF6JaiELxAUWLTXcWjDkh1rhMxbdq31ow"`, `"L47LQjBh97jnJ993qQUNndY2zPpR5pqEz199tExEKQDwsxurUx1S"`, `"L4e63u1bP72e99bGtabBxzVu6WvAeHnAbu6iCPejbwex1RLC1kJE"`

Password: `"Ka$i2k6"`

```json
{
  "type": "keys",
  "secret": [
    "478c14d84db4655e46a190215c94e9a12bc33911184b8e7acff09bdbb2f17f393e7d3fe0f6f14c0a187ac517cd7aab6867797739d8065d71b5c70ebfae9164f7",
    "2e28a0a26f36d7608dc7886baa135e5030b25a5370594ed7e17acf0d245d2da0594f1bc6b36ef94dc02cb7b579097581405caf0ba14cbd3fb8b01ffef3c36c85",
    "c6468be707263f10e0ae8d87b8ce300efd7f1e8077cce34f4f60c8c9126fef9ddd6df51d2cf90ec1803733e9e98da69e4be9ca0e0fc804ef9eafc2097aa44e83"
  ]
}
```