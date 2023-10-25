# The structure of a DigiByte Wallet

Each DigiByte Desktop Wallet File contain four fields 

| Field     | Description                                                |
|-----------|------------------------------------------------------------|
| type      | Type of private key (`seed`, `keys`)                       |
| secret    | AES-256-CBC with no IV Encrypted JSON format of the keys   |
| integrity | SHA-256 Hash of name, type & secret JSON stringlify object |

## Example

Key: `digibyte rocks!`

Seed: `b511936fd6a476f32578401944522d646042bc3fae26fbb27efc27dda0b9ccd81572635b47fd6b10aa7e6208d7c6f178a954b16009e623759a05cded2f083146`

```json
{
  "type": "seed",
  "secret": "aea76b898ceb65682c3c70c204934d039f49c4f86057f031b688216f0bec409638d312c428075b5208520c6f584c796ebea69d9b8b2ef853eae9ceed5943e91cf5d1baa8939601c39af3938f6699ab85",
  "integrity": "05168e6603e62d4adc0ff27fe25a2e9161f76df911427e5e50c1cb4235743128"
}
```