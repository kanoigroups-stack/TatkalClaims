# Migration evidence manifest

The files under this directory are retained as historical CMS migration evidence. They are not runtime content sources and must not be used to repopulate or overwrite the live Sanity production dataset without a separately approved recovery/migration procedure.

## Preserved evidence

| Path | Git blob checksum | Purpose |
| --- | --- | --- |
| `baseline/effective-blogs.json` | `d1c716c9e988062bf6fd0a31a97ce74888f44ac1` | Pre-migration effective article baseline |
| `baseline/manifest.json` | `a54e95875e1e3248d93111895ea4063403d757d9` | Baseline manifest |
| `phase6/staging-parity-report.json` | `bc45738703e38de752a76e86cc49a577906eb124` | Phase 6 staging parity evidence |
| `sanity/dry-run.ndjson` | `72d842ca0978add3e33b729e1005574ae49e8ba9` | Deterministic migration payload |
| `sanity/private-id-pre-repair.ndjson` | `f82e147f45cef74575ce25d5f2e2c6ff257af3e9` | Pre-public-ID repair payload |
| `sanity/private-id-pre-repair-report.json` | `99934be1816d8058893526c0c43acb7882139857` | Pre-repair report |
| `sanity/report.json` | `a00950e41fa97b7333cc8e3002c925c478bbc6ea` | Migration report |
| `sanity/staging-parity-report.json` | `4392e18391220a9ecd6a85dfb55fa0d9bc404a31` | Sanity staging parity report |

These are Git object checksums for the preserved blobs in the audited baseline. Any intentional change to one of these evidence files should update this manifest and explain why the evidence changed.

## Operational separation

Historical migration scripts and workflow definitions are archived under `archive/migration/`. Active production workflows must not execute the archived migration payloads.
