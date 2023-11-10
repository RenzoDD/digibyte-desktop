# The structure of a DigiByte Key File

Each DigiByte Desktop Key File contain four fields 

| Field     | Description                                                   |
|-----------|---------------------------------------------------------------|
| version   | Version of the wallet that generated the file                 |
| type      | Type of private key (`seed`, `keys`)                          |
| secret    | AES-256-CBC with no IV Encrypted JSON format of the keys      |
| integrity | SHA-256 Hash of version, type & secret JSON stringlify object |

## Example

Key: `digibyte rocks!`

Seed: `b511936fd6a476f32578401944522d646042bc3fae26fbb27efc27dda0b9ccd81572635b47fd6b10aa7e6208d7c6f178a954b16009e623759a05cded2f083146`

```json
{
  "version": "0.0.0",
  "type": "seed",
  "secret": "aea76b898ceb65682c3c70c204934d039f49c4f86057f031b688216f0bec409638d312c428075b5208520c6f584c796ebea69d9b8b2ef853eae9ceed5943e91cf5d1baa8939601c39af3938f6699ab85",
  "integrity": "40b2e8ff9297706a7292f80bf2a8348485a28a44c66d3fade1322e10f89b1ee6"
}
```