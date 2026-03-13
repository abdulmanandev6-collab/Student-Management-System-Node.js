import { Resend } from 'resend';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config/env.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function mustHaveEmailConfig() {
    if (!config.resendApiKey)
        throw new Error('RESEND_API_KEY not configured');
    if (!config.emailFrom)
        throw new Error('EMAIL_FROM not configured');
}
function renderTemplate(html, vars) {
    return Object.entries(vars).reduce((acc, [k, v]) => acc.split(`{{${k}}}`).join(v), html);
}
async function loadTemplate(name) {
    const templatePath = path.join(__dirname, '..', 'templates', 'email', name);
    return fs.readFile(templatePath, 'utf-8');
}
export async function sendWelcomeEmail(params) {
    mustHaveEmailConfig();
    const resend = new Resend(config.resendApiKey);
    const html = await loadTemplate('welcome.html');
    const rendered = renderTemplate(html, { name: params.name, loginUrl: params.loginUrl });
    await resend.emails.send({
        from: config.emailFrom,
        to: params.to,
        subject: 'Welcome to Student Management System',
        html: rendered
    });
}
export async function sendPasswordResetEmail(params) {
    mustHaveEmailConfig();
    const resend = new Resend(config.resendApiKey);
    const html = await loadTemplate('password-reset.html');
    const rendered = renderTemplate(html, { name: params.name, resetUrl: params.resetUrl });
    await resend.emails.send({
        from: config.emailFrom,
        to: params.to,
        subject: 'Reset your password',
        html: rendered
    });
}
