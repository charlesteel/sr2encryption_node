var request = require('request');

function simpleAuthenticatedPost(scheme, host, path, headers, requestBody) {

    return new Promise((resolve, reject) => {

        var options = {
            uri: scheme + host + path,
            method: 'POST',
            headers: headers,
            json: requestBody
          };

        request(options, (error, response, body) => {

            if (!error && response.statusCode == 200) {
                
                resolve(JSON.parse(body));
            }
            else if(error) {

                reject(error);
            }
            else {

                reject(response);
            }
        });
    });
}

var method = Sr2Encryption.prototype;

function Sr2Encryption(host, licenseId, licenseKey) {

    this._scheme = "https://";
    this._host = host;
    this._licenseId = licenseId;
    this._licenseKey = licenseKey;
}

method.createKey = function(additionalAuth=undefined) {

    return new Promise((resolve, reject) => {

        var headers = {

            'x-licenseid': this._licenseId,
            'x-licensesecret': this._licenseKey,
            'Content-Type': 'application/json'
        }

        var body = {};

        if(additionalAuth != undefined && additionalAuth.length > 0) {

            body['AdditionalAuth'] = additionalAuth;
        }

        simpleAuthenticatedPost(this._scheme, this._host, '/aes/createkey', headers, body)
            .then((response) => {

                if(response.status == 'success') {

                    resolve(response['KeyId']);
                }
                else {

                    reject(response);
                }
            })
            .catch((err) => {

                resolve(err);
            });
    })
}

method.listKeys = function() {

    return new Promise((resolve, reject) => {

        var headers = {

            'x-licenseid': this._licenseId,
            'x-licensesecret': this._licenseKey,
            'Content-Type': 'application/json'
        }

        var body = {};

        simpleAuthenticatedPost(this._scheme, this._host, '/aes/listkeys', headers, body)
            .then((response) => {

                if(response.status == 'success') {

                    resolve(response['Keys']);
                }
                else {

                    reject(response);
                }
            })
            .catch((err) => {

                resolve(err);
            });
    })
}

method.deactivateKey = function(KeyId) {

    return new Promise((resolve, reject) => {

        var headers = {

            'x-licenseid': this._licenseId,
            'x-licensesecret': this._licenseKey,
            'Content-Type': 'application/json'
        }

        var body = {
            KeyId: KeyId
        };

        simpleAuthenticatedPost(this._scheme, this._host, '/aes/deactivatekey', headers, body)
            .then((response) => {

                if(response.status == 'success') {

                    resolve();
                }
                else {

                    reject(response);
                }
            })
            .catch((err) => {

                resolve(err);
            });
    })
}

method.deleteKey = function(KeyId) {

    return new Promise((resolve, reject) => {

        var headers = {

            'x-licenseid': this._licenseId,
            'x-licensesecret': this._licenseKey,
            'Content-Type': 'application/json'
        }

        var body = {
            KeyId: KeyId
        };

        simpleAuthenticatedPost(this._scheme, this._host, '/aes/deletekey', headers, body)
            .then((response) => {

                if(response.status == 'success') {

                    resolve();
                }
                else {

                    reject(response);
                }
            })
            .catch((err) => {

                resolve(err);
            });
    })
}

method.encryptData = function(KeyId, PlaintextBuffer, AdditionalAuth=undefined) {

    return new Promise((resolve, reject) => {

        var headers = {

            'x-licenseid': this._licenseId,
            'x-licensesecret': this._licenseKey,
            'Content-Type': 'application/json'
        }

        if(AdditionalAuth != undefined && AdditionalAuth.length > 0) {

            headers['x-additionalauth'] = AdditionalAuth
        }

        var body = {
            KeyId: KeyId,
            Plaintext: PlaintextBuffer.toString('base64')
        };

        simpleAuthenticatedPost(this._scheme, this._host, '/aes/encrypt', headers, body)
            .then((response) => {

                if(response.status == 'success') {

                    resolve(response['CipherText']);
                }
                else {

                    reject(response);
                }
            })
            .catch((err) => {

                resolve(err);
            });
    })
}

method.decryptData = function(KeyId, CipherTextString, AdditionalAuth=undefined) {

    return new Promise((resolve, reject) => {

        var headers = {

            'x-licenseid': this._licenseId,
            'x-licensesecret': this._licenseKey,
            'Content-Type': 'application/json'
        }

        if(AdditionalAuth != undefined && AdditionalAuth.length > 0) {

            headers['x-additionalauth'] = AdditionalAuth
        }

        var body = {
            KeyId: KeyId,
            CipherText: CipherTextString
        };

        simpleAuthenticatedPost(this._scheme, this._host, '/aes/decrypt', headers, body)
            .then((response) => {

                if(response.status == 'success') {

                    resolve(Buffer.from(response['Plaintext'], 'base64'));
                }
                else {

                    reject(response);
                }
            })
            .catch((err) => {

                resolve(err);
            });
    })
}

method.reEncryptData = function(CipherTextString, DestinationKeyId, DestinationAdditionalAuth=undefined, SourceAdditionalAuth=undefined) {

    return new Promise((resolve, reject) => {

        var headers = {

            'x-licenseid': this._licenseId,
            'x-licensesecret': this._licenseKey,
            'Content-Type': 'application/json'
        }

        if(SourceAdditionalAuth != undefined && SourceAdditionalAuth.length > 0) {

            headers['x-additionalauth'] = SourceAdditionalAuth
        }

        var body = {
            CipherText: CipherTextString,
            DestinationKeyId: DestinationKeyId
        };

        if(DestinationAdditionalAuth != undefined && DestinationAdditionalAuth.length > 0) {

            body['DestinationAdditionalAuth'] = DestinationAdditionalAuth;
        }

        simpleAuthenticatedPost(this._scheme, this._host, '/aes/reencrypt', headers, body)
            .then((response) => {

                if(response.status == 'success') {

                    resolve(response['CipherText']);
                }
                else {

                    reject(response);
                }
            })
            .catch((err) => {

                resolve(err);
            });
    })
}

method.generateRandomData = function(DataLength) {

    return new Promise((resolve, reject) => {

        var headers = {

            'x-licenseid': this._licenseId,
            'x-licensesecret': this._licenseKey,
            'Content-Type': 'application/json'
        }

        var body = {
            DataLength: DataLength
        };

        simpleAuthenticatedPost(this._scheme, this._host, '/aes/generateRandomData', headers, body)
            .then((response) => {

                if(response.status == 'success') {

                    resolve(Buffer.from(response['RandomData'], 'base64'));
                }
                else {

                    reject(response);
                }
            })
            .catch((err) => {

                resolve(err);
            });
    })
}

method.generateKeyData = function(KeyId, AdditionalAuth=undefined) {

    return new Promise((resolve, reject) => {

        var headers = {

            'x-licenseid': this._licenseId,
            'x-licensesecret': this._licenseKey,
            'Content-Type': 'application/json'
        }

        if(AdditionalAuth != undefined && AdditionalAuth.length > 0) {

            headers['x-additionalauth'] = AdditionalAuth
        }

        var body = {
            KeyId: KeyId
        };

        simpleAuthenticatedPost(this._scheme, this._host, '/aes/generateKeyData', headers, body)
            .then((response) => {

                if(response.status == 'success') {

                    resolve({ CipherText: response['CipherText'], Plaintext: response['CipherText'] });
                }
                else {

                    reject(response);
                }
            })
            .catch((err) => {

                resolve(err);
            });
    })
}

method.generateKeyDataWithoutPlaintext = function(KeyId, AdditionalAuth=undefined) {

    return new Promise((resolve, reject) => {

        var headers = {

            'x-licenseid': this._licenseId,
            'x-licensesecret': this._licenseKey,
            'Content-Type': 'application/json'
        }

        if(AdditionalAuth != undefined && AdditionalAuth.length > 0) {

            headers['x-additionalauth'] = AdditionalAuth
        }

        var body = {
            KeyId: KeyId
        };

        simpleAuthenticatedPost(this._scheme, this._host, '/aes/generateKeyDataWithoutPlaintext', headers, body)
            .then((response) => {

                if(response.status == 'success') {

                    resolve(response['CipherText']);
                }
                else {

                    reject(response);
                }
            })
            .catch((err) => {

                resolve(err);
            });
    })
}

method.signThisData = function(PlaintextBuffer) {

    return new Promise((resolve, reject) => {

        var headers = {

            'x-licenseid': this._licenseId,
            'x-licensesecret': this._licenseKey,
            'Content-Type': 'application/json'
        }

        var body = {
            Plaintext: PlaintextBuffer.toString('base64')
        };

        simpleAuthenticatedPost(this._scheme, this._host, '/des/sign', headers, body)
            .then((response) => {

                if(response.status == 'success') {

                    resolve(response['Signature']);
                }
                else {

                    reject(response);
                }
            })
            .catch((err) => {

                resolve(err);
            });
    })
}

method.verifyThisSignatureOfThisData = function(PlaintextBuffer, SignatureString) {

    return new Promise((resolve, reject) => {

        var headers = {

            'Content-Type': 'application/json'
        }

        var body = {
            Plaintext: PlaintextBuffer.toString('base64'),
            Signature: SignatureString
        };

        simpleAuthenticatedPost(this._scheme, this._host, '/des/verify', headers, body)
            .then((response) => {

                if(response.status == 'success') {

                    resolve(response['Verified']);
                }
                else {

                    reject(response);
                }
            })
            .catch((err) => {

                resolve(err);
            });
    })
}

module.exports = function(host, licenseId, licenseKey) {

    return new Sr2Encryption(host, licenseId, licenseKey);
}