import CryptoJS from "crypto-js";
const encryptionKey = process.env.REACT_APP_ENCRYPTION_DECRYPTION_KEY;

// Helper function to encrypt data
export const encryptData = (data) => {
  // Ensure the key is properly formatted
  const key = CryptoJS.enc.Utf8.parse(encryptionKey);

  // Encrypt the data using AES-256-ECB
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Convert to Base64 string
  return encrypted.toString();
};

export const decryptData = (encryptedData) => {
  try {
    // Decrypt using AES-256-ECB with the correct key
    const decryptedBytes = CryptoJS.AES.decrypt(
      encryptedData,
      CryptoJS.enc.Utf8.parse(encryptionKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    // Convert decrypted bytes to UTF-8 string
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedText);
  } catch (error) {
    console.error("Error during decryption:", error.message); // Log any errors
    return null;
  }
};
