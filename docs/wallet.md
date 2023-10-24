# The structure of a DigiByte Wallet

Each DigiByte Desktop Wallet File contain four fields 

| Field     | Description                                                |
|-----------|------------------------------------------------------------|
| name      | Private Keys Name                                          |
| type      | Type of private key (`xprv`, `keys`)                       |
| secret    | AES-256-CBC with no IV Encrypted JSON format of the keys   |
| integrity | SHA-256 Hash of name, type & secret JSON stringlify object |

## Example
Key: "digibyte rocks!"
```json
{
    "name": "Renzo's Personal Wallet",
    "type": "xprv",
    "secret": "619ae794ec8813f856076da46ba289eb53f1d1d4b635d2e06b6fbcc14a65a4ded92c962783decb10edd8153f6f158d28988e373b55ec19610c6127d242e5c35c21fe35375876e4deef1b7c14a2bb9a85680539d2906c86c9da8040bacbe7b5c4c8948910d2fa9a96ee7d08f0c42044b2",
    "integrity": "4de067573a8adbc5d6274eccfbce53fd265634f8e30095b0d5dfc8a290034dca"
}
```