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

## Encrypting Larger Data

It doesn't make sense to encrypt large amounts of data using the SR2 Encryption Service. From a performance standpoint you are much better off encrypting that data on your own servers. But creating cryptographically secure keys for that process can be problematic. So we have implemented functions for a process known as Envelope Encryption. Basically we will generate a cryptographically secure encryption key that you can use with AES 256bit on your own system, and encrypt it using a key that was generated using createKey() making it safe to store within your infrastructure.

``` js
var sr2encryption = require('sr2encryption')('yourhost.sr2encryption.com','licenseid','licene secret');

sr2encryption.generateKeyData(KeyId)
    .then(function(encryptedKeyObject) {

        //CipherText: Base64 string with a key that was encrypted using the specified KeyId
        //Plaintext: Base64 string with the unencrypted AES 256bit encryption key that can be used with Node.js crypto.
    })
    .catch(function(err) {

    });

```

Additionally, you can request just the encrypted copy of the key for storage only. This is useful if you don't need to use the key right away.

``` js
var sr2encryption = require('sr2encryption')('yourhost.sr2encryption.com','licenseid','licene secret');

sr2encryption.generateKeyDataWithoutPlaintext(KeyId)
    .then(function(Plaintext) {

        //Plaintext: Base64 string with the unencrypted AES 256bit encryption key that can be used with Node.js crypto.
    })
    .catch(function(err) {

    });

```

## Generate Random Data

It is always recommended to use an Initialization Vector (IV) when encrypting data. This helps prevent potential bad actors from spotting patterns in encrypted data that could be used to figure out your encryption key. To do this you should use a cryptographically secure random number generator. We provide that functionality with the generateRandomData() function.

``` js
var sr2encryption = require('sr2encryption')('yourhost.sr2encryption.com','licenseid','licene secret');

sr2encryption.generateRandomData(16)//generate 16 bytes of random data
    .then(function(RandomDataBuffer) {

        //RandomDataBuffer: A Buffer object containing the 16 bytes of random data.
    })
    .catch(function(err) {

    });

```

## Managing Your Keys

It is highly advisable to rotate your encryption keys occassionally. While we recommend doing so at least quarterly, you can choose the time table that is best for your project.

### List Keys

``` js
var sr2encryption = require('sr2encryption')('yourhost.sr2encryption.com','licenseid','licene secret');

sr2encryption.listKeys()
    .then(function(Keys) {

        //An array of key objects. This does not include any key data since that information stays securely on the SR2 Encryption server.
    })
    .catch(function(err) {

    });

```

### Deactivate a Key

This is useful if you want to prevent encryption using a key in the future but still be able to decrypt data with that key.

``` js
var sr2encryption = require('sr2encryption')('yourhost.sr2encryption.com','licenseid','licene secret');

sr2encryption.deactivateKey(KeyId)
    .then(function() {

    })
    .catch(function(err) {

    });

```

### Delete a Key

This is useful if you want to prevent encryption AND decryption using a key in the future. Once a key has been deleted you will not be able to decrypt any data that is secured with that key.

``` js
var sr2encryption = require('sr2encryption')('yourhost.sr2encryption.com','licenseid','licene secret');

sr2encryption.deleteKey(KeyId)
    .then(function() {

    })
    .catch(function(err) {

    });

```

[encryption-service]: https://www.sr2solutions.com/encryption