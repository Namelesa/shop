import * as CryptoJS from 'crypto-js';

export function encryptCartData(cart: any): string {
  const cartString = JSON.stringify(cart);
  return CryptoJS.AES.encrypt(cartString, 'unique-secret-key').toString();
}

export function decryptCartData(encryptedCart: string): any[] {
  const bytes = CryptoJS.AES.decrypt(encryptedCart, 'unique-secret-key');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  if (!decryptedData) {
    return [];
  }

  try {
    return JSON.parse(decryptedData);
  } catch (e) {
    return [];
  }
}
