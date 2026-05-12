import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

const bodyPath = path.join(process.cwd(), "content", "body.html");
const bodyHtml = fs.readFileSync(bodyPath, "utf8");

const interactionScript = `
(() => {
  const syncLanguageFormState = (lang) => {
    document.querySelectorAll('.sk-only, .en-only').forEach((element) => {
      const isFormControl =
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLButtonElement;

      if (!isFormControl) return;

      const isActive = element.classList.contains(lang + '-only');
      if (element.dataset.apwRequired === undefined) {
        element.dataset.apwRequired = String(element.required);
      }
      element.disabled = !isActive;
      if (element.dataset.apwRequired === 'true') {
        element.required = isActive;
      }
    });
  };

  window.setLang = function setLang(lang) {
    document.body.className = 'lang-' + lang;
    document.getElementById('btn-sk')?.classList.toggle('active', lang === 'sk');
    document.getElementById('btn-en')?.classList.toggle('active', lang === 'en');
    syncLanguageFormState(lang);
  };

  window.handleForm = async function handleForm(e) {
    e.preventDefault();
    const form = e.target;
    const btn =
      Array.from(form.querySelectorAll('.btn-submit')).find(
        (candidate) => window.getComputedStyle(candidate).display !== 'none'
      ) || form.querySelector('.btn-submit');
    if (!btn) return;

    const isEn = document.body.className.includes('en');
    const inputs = form.querySelectorAll('input, textarea');
    const [nameEl, emailEl, companyEl] = inputs;
    const messageEl = Array.from(form.querySelectorAll('textarea')).find(
      (el) => window.getComputedStyle(el).display !== 'none'
    );

    btn.disabled = true;
    btn.textContent = isEn ? 'Sending…' : 'Odosielam…';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameEl?.value || '',
          email: emailEl?.value || '',
          company: companyEl?.value || '',
          message: messageEl?.value || '',
        }),
      });

      const orig = btn.textContent;
      if (res.ok) {
        btn.textContent = isEn ? 'Sent! ✓' : 'Odoslané! ✓';
        btn.style.background = '#27ae60';
        form.reset();
      } else {
        btn.textContent = isEn ? 'Error — try again' : 'Chyba — skúste znova';
        btn.style.background = '#e74c3c';
      }
      window.setTimeout(() => {
        btn.textContent = isEn ? (orig.includes('Send') ? orig : 'Send Message') : 'Odoslať správu';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    } catch {
      btn.textContent = isEn ? 'Error — try again' : 'Chyba — skúste znova';
      btn.style.background = '#e74c3c';
      window.setTimeout(() => { btn.style.background = ''; btn.disabled = false; }, 3000);
    }
  };

  const setupNavHighlight = () => {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const onScroll = () => {
      let current = '';
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 100) current = section.id;
      });
      navLinks.forEach((link) => {
        link.style.color = link.getAttribute('href') === '#' + current ? '#fff' : '';
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  const bindInteractions = () => {
    document.getElementById('btn-sk')?.addEventListener('click', () => window.setLang('sk'));
    document.getElementById('btn-en')?.addEventListener('click', () => window.setLang('en'));
    document.querySelectorAll('form').forEach((form) => {
      if (form.dataset.apwBound === 'true') return;
      form.dataset.apwBound = 'true';
      form.addEventListener('submit', window.handleForm);
    });
    syncLanguageFormState(document.body.className.includes('lang-en') ? 'en' : 'sk');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindInteractions();
      setupNavHighlight();
    }, { once: true });
  } else {
    bindInteractions();
    setupNavHighlight();
  }
})();
`;

export default function HomePage() {
  return (
    <>
      <main dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <Script id="apwtech-interactions" strategy="afterInteractive">
        {interactionScript}
      </Script>
    </>
  );
}
