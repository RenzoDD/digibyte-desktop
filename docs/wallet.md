# The structure of a DigiByte Wallet

Each DigiByte Desktop Wallet File contain four fields 

| Field     | Description                                                |
|-----------|------------------------------------------------------------|
| name      | Private Keys Name                                          |
| type      | Type of private key (`seed`, `keys`)                       |
| secret    | AES-256-CBC with no IV Encrypted JSON format of the keys   |
| integrity | SHA-256 Hash of name, type & secret JSON stringlify object |

## Example

Key: `digibyte rocks!`

Seed: `0b25fef7270b30afab0206442de37800fcf7a95e8179a2fd27a5e3aef46068dcc5ef59af69ad30564dbd685be2d186bc869f9398f8012a6e8ac6f107b0bc67ae`

```json
{
    "name": "Renzo's Personal Wallet",
    "type": "seed",
    "secret": "cae5eaab7fb51127592fc94ec2943d1fcadbf4a849316ce7a6eda67bf32e4993a15b003955124d7496552782594bda1fa4ecd9392a9b7711f0921ea6fd12e47220baccd5184161c931daf87ca89a98a9bf0c8d2de87bff81b27c8abf63578a71471ad12eb7995ad05e90002061c176697cb8ed06fca3abcb0c8607125cdbb6c36754df66ed09bb8acf973a11f91ce746",
    "integrity": "469c9183b2433b7eacdad33007db4d3cf05f1ba86b1627515a382e5ec2e07deb"
}
```