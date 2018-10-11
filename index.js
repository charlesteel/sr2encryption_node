const https = require('https');

function simpleAuthenticatedPost(host, port, path, headers, requestBody) {

    return new Promise(function(resolve, reject) {

        var options = {
            hostname: host,
            port: port,
            path: path,
            method: 'POST',
            headers: headers
        };
        
        var req = https.request(options, function(res) {
            var body = '';
    
            res.setEncoding('utf8');
            
            res.on('data', function(chunk) {
                body += chunk;
            });
            
            res.on('end', function() {
                console.log('Successfully processed HTTPS response');
                // If we know it's JSON, parse it
                if (res.headers['content-type'] === 'application/json') {
                    body = JSON.parse(body);
                }

                resolve(JSON.parse(body));
            });
        });
        req.write(JSON.stringify(requestBody));
        req.end();
    });
}

class Sr2Encryption {

    hostStorage = "";
    hostPort = 443;
    licenseIdStorage = "";
    licenseKeyStorage = "";
    

    constructor(host, licenseId, licenseKey) {

        this.hostStorage = host;
        this.licenseIdStorage = licenseId;
        this.licenseKeyStorage = licenseKey;
    }

    createKey(additionalAuth=undefined) {

        return new Promise(function(resolve, reject) {

            var headers = {

                'x-licenseid': this.licenseId,
                'x-licensesecret': this.licenseKey,
                'Content-Type': 'application/json'
            }

            var body = {};

            if(additionalAuth != undefined && additionalAuth.length > 0) {

                body['AdditionalAuth'] = additionalAuth;
            }

            simpleAuthenticatedPost(this.hostStorage, this.hostPort, '/aes/createkey', headers, body)
                .then(function(response) {

                    if(response.status == 'success') {

                        resolve(response['KeyId']);
                    }
                    else {

                        reject(response);
                    }
                })
                .catch(function(err) {

                    resolve(err);
                });
        })
    }

    listKeys() {

        return new Promise(function(resolve, reject) {

            var headers = {

                'x-licenseid': this.licenseId,
                'x-licensesecret': this.licenseKey,
                'Content-Type': 'application/json'
            }

            var body = {};

            simpleAuthenticatedPost(this.hostStorage, this.hostPort, '/aes/listkeys', headers, body)
                .then(function(response) {

                    if(response.status == 'success') {

                        resolve(response['Keys']);
                    }
                    else {

                        reject(response);
                    }
                })
                .catch(function(err) {

                    resolve(err);
                });
        })
    }

    deactivateKey(KeyId) {

        return new Promise(function(resolve, reject) {

            var headers = {

                'x-licenseid': this.licenseId,
                'x-licensesecret': this.licenseKey,
                'Content-Type': 'application/json'
            }

            var body = {
                KeyId: KeyId
            };

            simpleAuthenticatedPost(this.hostStorage, this.hostPort, '/aes/deactivatekey', headers, body)
                .then(function(response) {

                    if(response.status == 'success') {

                        resolve();
                    }
                    else {

                        reject(response);
                    }
                })
                .catch(function(err) {

                    resolve(err);
                });
        })
    }

    deleteKey(KeyId) {

        return new Promise(function(resolve, reject) {

            var headers = {

                'x-licenseid': this.licenseId,
                'x-licensesecret': this.licenseKey,
                'Content-Type': 'application/json'
            }

            var body = {
                KeyId: KeyId
            };

            simpleAuthenticatedPost(this.hostStorage, this.hostPort, '/aes/deletekey', headers, body)
                .then(function(response) {

                    if(response.status == 'success') {

                        resolve();
                    }
                    else {

                        reject(response);
                    }
                })
                .catch(function(err) {

                    resolve(err);
                });
        })
    }

    encryptData(KeyId, PlaintextBuffer, AdditionalAuth=undefined) {

        return new Promise(function(resolve, reject) {

            var headers = {

                'x-licenseid': this.licenseId,
                'x-licensesecret': this.licenseKey,
                'Content-Type': 'application/json'
            }

            if(AdditionalAuth != undefined && AdditionalAuth.length > 0) {

                headers['x-additionalauth'] = AdditionalAuth
            }

            var body = {
                KeyId: KeyId,
                Plaintext: PlaintextBuffer.toString('base64')
            };

            simpleAuthenticatedPost(this.hostStorage, this.hostPort, '/aes/encrypt', headers, body)
                .then(function(response) {

                    if(response.status == 'success') {

                        resolve(response['CipherText']);
                    }
                    else {

                        reject(response);
                    }
                })
                .catch(function(err) {

                    resolve(err);
                });
        })
    }

    decryptData(KeyId, CipherTextString, AdditionalAuth=undefined) {

        return new Promise(function(resolve, reject) {

            var headers = {

                'x-licenseid': this.licenseId,
                'x-licensesecret': this.licenseKey,
                'Content-Type': 'application/json'
            }

            if(AdditionalAuth != undefined && AdditionalAuth.length > 0) {

                headers['x-additionalauth'] = AdditionalAuth
            }

            var body = {
                KeyId: KeyId,
                CipherText: CipherTextString
            };

            simpleAuthenticatedPost(this.hostStorage, this.hostPort, '/aes/decrypt', headers, body)
                .then(function(response) {

                    if(response.status == 'success') {

                        resolve(Buffer.from(response['Plaintext'], 'base64'));
                    }
                    else {

                        reject(response);
                    }
                })
                .catch(function(err) {

                    resolve(err);
                });
        })
    }

    reEncryptData(CipherTextString, DestinationKeyId, DestinationAdditionalAuth=undefined, SourceAdditionalAuth=undefined) {

        return new Promise(function(resolve, reject) {

            var headers = {

                'x-licenseid': this.licenseId,
                'x-licensesecret': this.licenseKey,
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

            simpleAuthenticatedPost(this.hostStorage, this.hostPort, '/aes/reencrypt', headers, body)
                .then(function(response) {

                    if(response.status == 'success') {

                        resolve(response['CipherText']);
                    }
                    else {

                        reject(response);
                    }
                })
                .catch(function(err) {

                    resolve(err);
                });
        })
    }

    generateRandomData(DataLength) {

        return new Promise(function(resolve, reject) {

            var headers = {

                'x-licenseid': this.licenseId,
                'x-licensesecret': this.licenseKey,
                'Content-Type': 'application/json'
            }

            var body = {
                DataLength: DataLength
            };

            simpleAuthenticatedPost(this.hostStorage, this.hostPort, '/aes/generateRandomData', headers, body)
                .then(function(response) {

                    if(response.status == 'success') {

                        resolve(Buffer.from(response['RandomData'], 'base64'));
                    }
                    else {

                        reject(response);
                    }
                })
                .catch(function(err) {

                    resolve(err);
                });
        })
    }

    generateKeyData(KeyId, AdditionalAuth=undefined) {

        return new Promise(function(resolve, reject) {

            var headers = {

                'x-licenseid': this.licenseId,
                'x-licensesecret': this.licenseKey,
                'Content-Type': 'application/json'
            }

            if(AdditionalAuth != undefined && AdditionalAuth.length > 0) {

                headers['x-additionalauth'] = AdditionalAuth
            }

            var body = {
                KeyId: KeyId
            };

            simpleAuthenticatedPost(this.hostStorage, this.hostPort, '/aes/generateKeyData', headers, body)
                .then(function(response) {

                    if(response.status == 'success') {

                        resolve({ CipherText: response['CipherText'], Plaintext: response['CipherText'] });
                    }
                    else {

                        reject(response);
                    }
                })
                .catch(function(err) {

                    resolve(err);
                });
        })
    }

    generateKeyDataWithoutPlaintext(KeyId, AdditionalAuth=undefined) {

        return new Promise(function(resolve, reject) {

            var headers = {

                'x-licenseid': this.licenseId,
                'x-licensesecret': this.licenseKey,
                'Content-Type': 'application/json'
            }

            if(AdditionalAuth != undefined && AdditionalAuth.length > 0) {

                headers['x-additionalauth'] = AdditionalAuth
            }

            var body = {
                KeyId: KeyId
            };

            simpleAuthenticatedPost(this.hostStorage, this.hostPort, '/aes/generateKeyDataWithoutPlaintext', headers, body)
                .then(function(response) {

                    if(response.status == 'success') {

                        resolve(response['CipherText']);
                    }
                    else {

                        reject(response);
                    }
                })
                .catch(function(err) {

                    resolve(err);
                });
        })
    }

    //*****************************************
    
    signThisData(PlaintextBuffer) {

        return new Promise(function(resolve, reject) {

            var headers = {

                'x-licenseid': this.licenseId,
                'x-licensesecret': this.licenseKey,
                'Content-Type': 'application/json'
            }

            var body = {
                Plaintext: PlaintextBuffer.toString('base64')
            };

            simpleAuthenticatedPost(this.hostStorage, this.hostPort, '/des/sign', headers, body)
                .then(function(response) {

                    if(response.status == 'success') {

                        resolve(response['Signature']);
                    }
                    else {

                        reject(response);
                    }
                })
                .catch(function(err) {

                    resolve(err);
                });
        })
    }

    verifyThisSignatureOfThisData(PlaintextBuffer, SignatureString) {

        return new Promise(function(resolve, reject) {

            var headers = {

                'Content-Type': 'application/json'
            }

            var body = {
                Plaintext: PlaintextBuffer.toString('base64'),
                Signature: SignatureString
            };

            simpleAuthenticatedPost(this.hostStorage, this.hostPort, '/des/verify', headers, body)
                .then(function(response) {

                    if(response.status == 'success') {

                        resolve(response['Verified']);
                    }
                    else {

                        reject(response);
                    }
                })
                .catch(function(err) {

                    resolve(err);
                });
        })
    }
}

module.exports = Sr2Encryption;