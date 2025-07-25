// auth.js

import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  PhoneAuthProvider,
  RecaptchaVerifier,
  multiFactor
} from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signUpForm = document.getElementById("signUpForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          alert(`✅ Welcome ${user.email}`);
        })
        .catch((error) => {
          alert(`❌ ${error.message}`);
        });
    });
  }

  if (signUpForm) {
    signUpForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signUpEmail").value;
      const password = document.getElementById("signUpPassword").value;
      const phone = document.getElementById("signUpPhone").value;

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;
        if (phone) {
          window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container');
          const provider = new PhoneAuthProvider(auth);
          const verificationId = await provider.verifyPhoneNumber(phone, window.recaptchaVerifier);
          const code = prompt('Enter the verification code sent to your phone');
          const phoneCred = PhoneAuthProvider.credential(verificationId, code);
          await multiFactor(user).enroll(phoneCred, 'phone');
        }
        alert('✅ Sign up complete');
      } catch (error) {
        alert(`❌ ${error.message}`);
      }
    });
  }
});
