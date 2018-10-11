# SR2 Encryption Node.js Library

Install the package with:

    npm install sr2encryption --save

## Usage

The package needs to be configured with your Host, License ID, and License Secret which was sent to you when you signed up for the [SR2 Encryption Service][encryption-service]. Require it with the key's value:

``` js
var sr2encryption = require('sr2encryption')('yourhost.sr2encryption.com','licenseid','licene secret');

sr2encryption.createKey()
    .then(function(KeyId) {

    })
    .catch(function(err) {

    });
```

## Create Your First Encryption Key

Before you can start encrypting data you must create an encryption key within your account. You have the option of adding some additional authentication data in Base64 format to the key that will be created. But it will be needed for all future operations with the key that is created.

``` js
var sr2encryption = require('sr2encryption')('yourhost.sr2encryption.com','licenseid','licene secret');

sr2encryption.createKey("some additional authentication to require in base64 format")
    .then(function(KeyId) {

    })
    .catch(function(err) {

    });
```

## Encrypt Some Data

Now that you have an encryption Key ID you can start encrypting data. If successful, the cipherTextString contains the encrypted data, a properly formatted initialization vector, and the Key ID that was used all in a single Base64 formatted string. The SR2 Encryption service limits you to 64KB of data to be encrypted

``` js
var sr2encryption = require('sr2encryption')('yourhost.sr2encryption.com','licenseid','licene secret');

var plainTextString = "Some text that you want to encrypt";

sr2encryption.encryptData(KeyId, Buffer.from(plainTextString, 'utf8'))
    .then(function(cipherTextString) {

    })
    .catch(function(err) {

    });

```

## Decrypt Some Data

So we've successfully encrypted some data. Now to decrypt the data so that we can access it. Be sure to pass in the same Base64 string that you were given in the encrypt function. The PlaintextBuffer that given to you after the function completes is a full Buffer object that matches whatever data you encrypted.

``` js
var sr2encryption = require('sr2encryption')('yourhost.sr2encryption.com','licenseid','licene secret');

var cipherTextString = 'acquired from the encrypt function';

sr2encryption.decryptData(cipherTextString)
    .then(function(PlaintextBuffer) {

    })
    .catch(function(err) {

    });

```

## Rencrypt Some Data

Depending on your security policies, you may have to rotate encryption keys from time to time. After creating a second key, you can reencrypt some data using the ReEncryptData function. This will safely decrypt encrypted text using the old key and then encrypt it with the new key that you specify. This never exposes the contents of your data.

``` js

var sr2encryption = require('sr2encryption')('yourhost.sr2encryption.com','licenseid','licene secret');

var cipherTextString = 'acquired from the encrypt function';
var destinationKeyId = 'some new KeyID generated using createKey()';

sr2encryption.reEncryptData(cipherTextString, destinationKeyId)
    .then(function(cipherTextString) {

    })
    .catch(function(err) {

    });

```

[encryption-service]: https://www.sr2solutions.com/encryption