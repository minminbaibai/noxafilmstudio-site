/**
 * NOXA FILM - Email Subscription Handler (Mailto Version with Confirmation)
 * 
 * This script handles the email subscription functionality for the NOXA FILM website
 * using a simple mailto link approach with a confirmation popup.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the subscription form elements
    const subscribeBtn = document.getElementById('subscribe-btn');
    const emailInput = document.getElementById('subscriber-email');
    
    if (subscribeBtn && emailInput) {
        // Add click event listener to the subscribe button
        subscribeBtn.addEventListener('click', function() {
            // Get the email input value
            const email = emailInput.value.trim();
            
            // Validate email format
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            subscribeBtn.textContent = 'PROCESSING...';
            subscribeBtn.disabled = true;
            
            // Create mailto link
            const subject = encodeURIComponent('Newsletter Subscription');
            const body = encodeURIComponent(`Please add me to the NOXA FILM newsletter.\n\nEmail: ${email}`);
            const mailtoLink = `mailto:subscribe@noxafilmstudio.com?subject=${subject}&body=${body}`;
            
            // Show confirmation popup
            showThankYouPopup();
            
            // Open email client after a short delay
            setTimeout(function() {
                window.location.href = mailtoLink;
                
                // Reset form after a delay
                setTimeout(function() {
                    emailInput.value = '';
                    subscribeBtn.textContent = 'SUBSCRIBE';
                    subscribeBtn.disabled = false;
                }, 1000);
            }, 500);
        });
    }
    
    // Create popup elements if they don't exist
    if (!document.getElementById('thank-you-popup')) {
        createThankYouPopup();
    }
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

/**
 * Creates the thank you popup elements
 */
function createThankYouPopup() {
    // Create popup container
    const popupContainer = document.createElement('div');
    popupContainer.id = 'thank-you-popup';
    popupContainer.className = 'thank-you-popup';
    popupContainer.style.display = 'none';
    
    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    
    // Create close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
        document.getElementById('thank-you-popup').style.display = 'none';
    };
    
    // Create thank you message
    const thankYouMessage = document.createElement('h3');
    thankYouMessage.textContent = 'Thank You!';
    
    const subscriptionMessage = document.createElement('p');
    subscriptionMessage.textContent = 'Thank you for subscribing to our newsletter. We appreciate your interest in NOXA FILM.';
    
    // Append elements
    popupContent.appendChild(closeBtn);
    popupContent.appendChild(thankYouMessage);
    popupContent.appendChild(subscriptionMessage);
    popupContainer.appendChild(popupContent);
    
    // Add popup to body
    document.body.appendChild(popupContainer);
    
    // Add CSS for popup
    const popupStyle = document.createElement('style');
    popupStyle.textContent = `
        .thank-you-popup {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            overflow: auto;
        }
        
        .popup-content {
            background-color: #121212;
            border: 1px solid #333;
            margin: 15% auto;
            padding: 30px;
            width: 80%;
            max-width: 500px;
            border-radius: 8px;
            position: relative;
            color: #fff;
            text-align: center;
        }
        
        .close-btn {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            position: absolute;
            right: 15px;
            top: 10px;
        }
        
        .close-btn:hover {
            color: #fff;
        }
        
        .popup-content h3 {
            color: #fff;
            margin-top: 10px;
            font-size: 24px;
        }
        
        .popup-content p {
            margin: 20px 0;
            font-size: 16px;
            line-height: 1.6;
        }
    `;
    document.head.appendChild(popupStyle);
}

/**
 * Shows the thank you popup
 */
function showThankYouPopup() {
    const popup = document.getElementById('thank-you-popup');
    if (popup) {
        popup.style.display = 'block';
        
        // Close popup when clicking outside
        window.onclick = function(event) {
            if (event.target === popup) {
                popup.style.display = 'none';
            }
        };
        
        // Auto-close popup after 30 seconds
        setTimeout(function() {
            popup.style.display = 'none';
        }, 30000);
    }
}
