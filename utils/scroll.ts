"use client";

const HEADER_OFFSET = 100; // Height of sticky header + padding

export function scrollToForm() {
  if (typeof window === "undefined") return;
  const formContainer = document.getElementById("contact-form");
  if (formContainer) {
    const elementPosition = formContainer.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    setTimeout(() => {
      const nameInput = formContainer.querySelector('input[type="text"]') as HTMLInputElement | null;
      nameInput?.focus();
    }, 800);
  }
}
