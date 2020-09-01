# NgxPush

Angular Push Service

## Generate Web Push identifier & certificate

```bash
$ openssl genrsa -out web.com.magloft.pwa.key 2048
$ openssl req -new -key web.com.magloft.pwa.key -out web.com.magloft.pwa.csr -subj "/emailAddress=tobias.strebitzer@magloft.com.com, CN=MAGLOFT, C=SG"
$ openssl x509 -in web.com.magloft.pwa.cer -inform DER -outform PEM -out web.com.magloft.pwa.pem
```

## Sign push package manifest

```bash
openssl smime -sign -text -signer web.dev.magloft.pwa.pem -inkey web.dev.magloft.pwa.key -outform DER -binary -in manifest.json -out signature
```
