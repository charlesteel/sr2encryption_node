var sr2encryption = require('./index')();

var someDataThatNeedsToBeEncryptedAndSigned = Buffer.from("Here is a message that I want to encrypt and sign with SR2 Encryption.", "utf8");
var storedCipherText;
var storedSignature;

var storedDecryptedBuffer;

//create an encryption key
sr2encryption.createKey()//acquire a unique KeyID. Key Data remains on the server, but a Key ID is returned
    .then((KeyId) => {

        return sr2encryption.encryptData(KeyId, someDataThatNeedsToBeEncryptedAndSigned);//Encrypt the data using the retrieved Key ID
    })
    .then((CipherText) => {

        storedCipherText = CipherText;

        return sr2encryption.signThisData(someDataThatNeedsToBeEncryptedAndSigned);//Digitally Sign the unencrypted data to detect any tampering
    })
    .then((Signature) => {

        storedSignature = Signature;

        console.log("Ciphertext - " + storedCipherText);
        console.log("Signature - " + Signature);

        return sr2encryption.decryptData(storedCipherText);//decrypt the data
    })
    .then((PlaintextBuffer) => {

        storedDecryptedBuffer = PlaintextBuffer;

        return sr2encryption.verifyThisSignatureOfThisData(PlaintextBuffer, storedSignature);//check to make sure that the unecrypted data matches the signature
    })
    .then((Verified) => {

        console.log("Verified - " + Verified);
        console.log(storedDecryptedBuffer.toString('utf8'));
    })
    .catch((err) => {

        console.log(err);
    });

