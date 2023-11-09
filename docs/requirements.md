# Requests

**Features** of the Desktop Wallet

| Code | Description                      | Requirements           |
|:----:|:---------------------------------|-----------------------:|
| FR01 | Manage private keys              | KF01, KF02, KF03       |
| FR02 | Generate private keys            | KF04, KF05, KF09       |
| FR03 | Import private keys              | KF06, KF07, KF08, KF09 |
| FR04 | Export private keys              | KF10                   |

# Requirements

**Characteristics** the wallet must have to fulfill the requests.

| Code | Description                      | Requests   |
|:----:|:---------------------------------|-----------:|
| KF01 | List key files                   | FR01       |
| KF02 | Validate key file integrity      | FR01       |
| KF03 | Delete key file                  | FR01       |
| KF04 | Generate 12 word mnemonic phrase | FR02       |
| KF05 | Generate 24 word mnemonic phrase | FR02       |
| KF06 | Import mnemonic phrase           | FR03       |
| KF07 | Import private key list (WIF)    | FR03       |
| KF08 | Import key file                  | FR03       |
| KF09 | Generate key file                | FR02, FR03 |
| KF10 | Export key file                  | FR04       |