import CryptoJS from 'crypto-js';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const AutoFillLogin = ({ setFieldValue }) => {

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return value;
    }
    return null;
  };

  useEffect(() => {
    const savedEmail = getCookie("email");
    const encryptedPassword = getCookie("password");

    if (savedEmail && encryptedPassword) {
      try {
        const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, "secretKey").toString(CryptoJS.enc.Utf8);

        setFieldValue("email", savedEmail);
        setFieldValue("password", decryptedPassword);
      } catch (error) {
        toast.error("Error decrypting password", error);
      }
    }
  }, [setFieldValue]);

  return null;
};

export default AutoFillLogin;
