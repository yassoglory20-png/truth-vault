import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export async function sendContactEmail(formData) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured');
    return { success: false, error: 'Email service not configured' };
  }
  try {
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      from_name: formData.name, from_email: formData.email,
      subject: formData.subject, message: formData.message, to_name: 'Truth Vault Team',
    }, PUBLIC_KEY);
    return { success: true, result };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error: error.message };
  }
}

export async function sendNewsletterConfirmation(email, name = '') {
  if (!SERVICE_ID || !PUBLIC_KEY) return { success: false };
  try {
    const result = await emailjs.send(SERVICE_ID, 'newsletter_template', {
      to_email: email, to_name: name || 'Subscriber', from_name: 'Truth Vault',
    }, PUBLIC_KEY);
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
