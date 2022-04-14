import crypto from 'crypto';
import EncryptionKeys from './encryptionKeys';
const algorithm: $TSFixMe = EncryptionKeys.algorithm;
const key: $TSFixMe = EncryptionKeys.key;

export default {
    encrypt: (plainText: $TSFixMe, iv: $TSFixMe) => {
        const promise = new Promise((resolve, reject): $TSFixMe => {
            try {
                const cipher: $TSFixMe = crypto.createCipheriv(
                    algorithm,
                    key,
                    iv
                );
                let encoded = cipher.update(plainText, 'utf8', 'hex');
                encoded += cipher.final('hex');
                resolve(encoded);
            } catch (error) {
                reject(error);
            }
        });
        return promise;
    },

    decrypt: (encText: $TSFixMe, iv = EncryptionKeys.iv) => {
        const promise = new Promise((resolve, reject): $TSFixMe => {
            try {
                const decipher: $TSFixMe = crypto.createDecipheriv(
                    algorithm,
                    key,
                    iv
                );
                let decoded = decipher.update(encText, 'hex', 'utf8');
                decoded += decipher.final('utf8');
                resolve(decoded);
            } catch (error) {
                reject(error);
            }
        });
        return promise;
    },
};
