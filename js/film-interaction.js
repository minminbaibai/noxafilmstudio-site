// Film card interaction
document.addEventListener('DOMContentLoaded', () => {
  const filmCards = document.querySelectorAll('.film-card');
  
  filmCards.forEach(card => {
    const overlay = card.querySelector('.film-overlay');
    
    // Show overlay on click
    card.addEventListener('click', () => {
      // Make sure overlay is visible
      overlay.style.display = 'flex';
      overlay.classList.add('active');
    });
    
    // Hide overlay when clicking on it
    overlay.addEventListener('click', (e) => {
      // Don't hide if clicking on the CTA button (allow navigation)
      if (!e.target.classList.contains('film-cta')) {
        overlay.classList.remove('active');
        e.stopPropagation();
      }
    });
  });
});
