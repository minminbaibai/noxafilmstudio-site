/**
 * NOXA FILM - Email Subscription Handler (Frameon API)
 *
 * Posts subscriber data to the Frameon waitlist API and shows inline feedback.
 */

document.addEventListener('DOMContentLoaded', function() {
    const subscribeBtn = document.getElementById('subscribe-btn');
    const emailInput = document.getElementById('subscriber-email');
    const nameInput = document.getElementById('subscriber-name');
    let feedbackEl = document.getElementById('subscription-feedback');

    if (!subscribeBtn || !emailInput) {
        return;
    }

    const ensureFeedback = () => {
        if (feedbackEl) return feedbackEl;
        feedbackEl = document.createElement('div');
        feedbackEl.id = 'subscription-feedback';
        feedbackEl.className = 'subscription-feedback';
        const form = emailInput.closest('.subscription-form') || emailInput.parentElement;
        if (form && form.parentElement) {
            form.parentElement.appendChild(feedbackEl);
        } else {
            emailInput.insertAdjacentElement('afterend', feedbackEl);
        }
        return feedbackEl;
    };

    const setFeedback = (message, type, includeLink) => {
        const target = ensureFeedback();
        target.classList.remove('success', 'error');
        target.classList.add(type);
        if (includeLink) {
            target.innerHTML = `${message} <a href="https://www.frameonfilm.com/" target="_blank" rel="noopener noreferrer">Frameon</a>.`;
        } else {
            target.textContent = message;
        }
    };

    subscribeBtn.addEventListener('click', async function() {
        const email = emailInput.value.trim();

        if (!isValidEmail(email)) {
            setFeedback('Please enter a valid email address.', 'error', false);
            return;
        }

        const rawName = nameInput ? nameInput.value.trim() : '';
        const derivedName = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
        const name = rawName || derivedName || '';

        subscribeBtn.textContent = 'PROCESSING...';
        subscribeBtn.disabled = true;

        try {
            const response = await fetch('https://www.frameonfilm.com/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name,
                    source: 'NOXA_SITE',
                }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.error || 'Subscription failed.');
            }

            setFeedback('Check your email to confirm.', 'success', false);
            emailInput.value = '';
            if (nameInput) nameInput.value = '';
        } catch (error) {
            console.error(error);
            setFeedback('Subscription failed. Please try again or visit', 'error', true);
        } finally {
            subscribeBtn.textContent = 'SUBSCRIBE';
            subscribeBtn.disabled = false;
        }
    });
});

/**
 * Validates email format using regex
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
