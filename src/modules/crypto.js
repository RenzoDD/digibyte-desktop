const crypto = require('crypto');

/**
 * This function calculates the SHA-256 hash of the provided data.
 * It uses the 'crypto' module for cryptographic operations.
 * 
 * @param {string} data - String of data
 * @returns SHA-256 HEX string 
 */
function SHA256(data) {
    // Create a hash object for SHA-256.
    const sha256Hash = crypto.createHash('sha256');

    // Update the hash with the provided data.
    sha256Hash.update(data);

    // Calculate the hash and return it in hexadecimal format.
    return sha256Hash.digest('hex');
}

/**
 * This function encrypts the provided data using AES-256 encryption with a given password.
 * It uses the 'crypto' module for cryptographic operations.
 * 
 * @param {string} data - String of data
 * @param {string} password - String password
 * @returns Encrypted HEX string 
 */
function EncryptAES256(data, password) {
    // Convert the data to a Buffer.
    var dataBuffer = Buffer.from(data);

    // Calculate the SHA-256 hash of the password and convert it to a Buffer.
    var passwordBuffer = Buffer.from(SHA256(password), 'hex');

    try {
        // Create a cipher object for AES-256 encryption in CBC mode.
        var cipher = crypto.createCipheriv("aes-256-cbc", passwordBuffer, Buffer.alloc(16));
        return cipher.update(dataBuffer, "utf-8", "hex") + cipher.final("hex");
    } catch (e) {
        return null;
    }
}

/**
 * This function decrypts the provided data that was encrypted using AES-256 encryption with a given password.
 * It uses the 'crypto' module for cryptographic operations.
 * 
 * @param {*} data - Encrypted HEX string
 * @param {*} password - String password
 * @returns - String of data
 */
function DecryptAES256(data, password) {
    // Convert the encrypted data from hexadecimal to a Buffer.
    var dataBuffer = Buffer.from(data, 'hex');

    // Calculate the SHA-256 hash of the password and convert it to a Buffer.
    var passwordBuffer = Buffer.from(SHA256(password), 'hex');

    try {
        // Create a decipher object for AES-256 decryption in CBC mode.
        var decipher = crypto.createDecipheriv("aes-256-cbc", passwordBuffer, Buffer.alloc(16));
        return decipher.update(dataBuffer, "hex", "utf-8") + decipher.final("utf-8");
    } catch (e) {
        return null;
    }
}

module.exports = { SHA256, EncryptAES256, DecryptAES256 }