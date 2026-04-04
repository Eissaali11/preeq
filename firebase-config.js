// firebase-config.js — Bareeq Agency Firebase Integration
// يربط نموذج التواصل بـ Firestore ويُعد Firebase Hosting

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSUCoFmhu4_LIKr4C3dg-MKlo_WNR1WOc",
  authDomain: "breeq-6f5ac.firebaseapp.com",
  projectId: "breeq-6f5ac",
  storageBucket: "breeq-6f5ac.firebasestorage.app",
  messagingSenderId: "250477337335",
  appId: "1:250477337335:web:9bd9dc11fa168c314991f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── Contact Form Handler ─────────────────────────────────────────────────────
const contactForm = document.getElementById("contactForm");
const formNote    = document.getElementById("formNote");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector(".btn-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "جارٍ الإرسال...";

    const data = {
      name:      contactForm.name.value.trim(),
      email:     contactForm.email.value.trim(),
      phone:     contactForm.phone.value.trim() || null,
      service:   contactForm.service.value,
      message:   contactForm.message.value.trim(),
      createdAt: serverTimestamp(),
      source:    "bareeq-website"
    };

    try {
      await addDoc(collection(db, "leads"), data);

      // Success state
      formNote.textContent = "✦ تم إرسال طلبك بنجاح! سنتواصل معك قريباً.";
      formNote.style.color = "#4ade80";
      contactForm.reset();
    } catch (err) {
      console.error("Firestore error:", err);
      formNote.textContent = "حدث خطأ أثناء الإرسال. حاول مرة أخرى.";
      formNote.style.color = "#f87171";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'إرسال الطلب <span class="btn-icon" aria-hidden="true">✦</span>';
    }
  });
}
