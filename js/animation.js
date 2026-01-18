/* Animation Script for NOXA FILM Hero Section */

// Particle animation system
class ParticleSystem {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.options = {
      count: options.count || 100,
      color: options.color || '#d4af37',
      minSize: options.minSize || 1,
      maxSize: options.maxSize || 3,
      speed: options.speed || 0.5,
      opacity: options.opacity || 0.7
    };
    
    this.init();
  }
  
  init() {
    // Set canvas to full screen
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Create particles
    this.createParticles();
    
    // Start animation
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    for (let i = 0; i < this.options.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize,
        speedX: (Math.random() - 0.5) * this.options.speed,
        speedY: (Math.random() - 0.5) * this.options.speed,
        opacity: Math.random() * this.options.opacity
      });
    }
  }
  
  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.options.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
      
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
    });
  }
  
  animate() {
    this.drawParticles();
    requestAnimationFrame(() => this.animate());
  }
}

// Sigil animation
class SigilAnimation {
  constructor(element) {
    this.element = element;
    this.sigil = document.createElement('div');
    this.sigil.className = 'sigil';
    this.element.appendChild(this.sigil);
    
    this.init();
  }
  
  init() {
    // Create sigil circles
    this.createCircles();
    
    // Start animation sequence
    this.animate();
  }
  
  createCircles() {
    // Create outer circle
    const outerCircle = document.createElement('div');
    outerCircle.className = 'sigil-circle outer';
    outerCircle.style.width = '500px';
    outerCircle.style.height = '500px';
    this.sigil.appendChild(outerCircle);
    
    // Create middle circle
    const middleCircle = document.createElement('div');
    middleCircle.className = 'sigil-circle middle';
    middleCircle.style.width = '350px';
    middleCircle.style.height = '350px';
    this.sigil.appendChild(middleCircle);
    
    // Create inner circle
    const innerCircle = document.createElement('div');
    innerCircle.className = 'sigil-circle inner';
    innerCircle.style.width = '200px';
    innerCircle.style.height = '200px';
    this.sigil.appendChild(innerCircle);
    
    // Create symbols
    for (let i = 0; i < 24; i++) {
      const symbol = document.createElement('div');
      symbol.className = 'sigil-symbol';
      symbol.style.transform = `rotate(${i * 15}deg) translateY(-250px)`;
      this.sigil.appendChild(symbol);
    }
  }
  
  animate() {
    // Fade in and scale up
    setTimeout(() => {
      this.element.style.opacity = '1';
      this.element.style.animation = 'scaleIn 2s forwards';
    }, 1000);
    
    // Start rotation
    setTimeout(() => {
      const circles = this.element.querySelectorAll('.sigil-circle');
      circles.forEach((circle, index) => {
        circle.style.animation = `rotate${index % 2 ? 'Clockwise' : 'CounterClockwise'} ${30 + index * 10}s linear infinite`;
      });
      
      const symbols = this.element.querySelectorAll('.sigil-symbol');
      symbols.forEach((symbol, index) => {
        symbol.style.animation = `pulse 3s ${index * 0.1}s infinite`;
      });
    }, 3000);
  }
}

// Text animation
class TextAnimation {
  constructor(element) {
    this.element = element;
    this.title = this.element.querySelector('.hero-title');
    this.subtitle = this.element.querySelector('.hero-subtitle');
    
    this.init();
  }
  
  init() {
    // Hide elements initially
    this.title.style.opacity = '0';
    this.subtitle.style.opacity = '0';
    
    // Start animation sequence
    this.animate();
  }
  
  animate() {
    // Animate title
    setTimeout(() => {
      this.title.style.animation = 'fadeIn 1.5s forwards';
    }, 4000);
    
    // Animate subtitle
    setTimeout(() => {
      this.subtitle.style.animation = 'fadeIn 1.5s forwards';
    }, 5500);
    
    // Animate CTA buttons
    const ctaContainer = this.element.querySelector('.cta-container');
    if (ctaContainer) {
      ctaContainer.style.opacity = '0';
      setTimeout(() => {
        ctaContainer.style.animation = 'fadeIn 1.5s forwards';
      }, 7000);
    }
  }
}

// Main animation controller
class HeroAnimation {
  constructor() {
    this.heroElement = document.querySelector('.hero');
    this.particlesCanvas = document.createElement('canvas');
    this.particlesCanvas.className = 'particles-canvas';
    this.sigilContainer = document.createElement('div');
    this.sigilContainer.className = 'sigil-container';
    this.contentContainer = document.querySelector('.hero-content');
    
    this.heroElement.appendChild(this.particlesCanvas);
    this.heroElement.appendChild(this.sigilContainer);
    
    this.init();
  }
  
  init() {
    // Initialize particle system
    this.particles = new ParticleSystem(this.particlesCanvas, {
      count: 150,
      color: '#d4af37',
      minSize: 1,
      maxSize: 3,
      speed: 0.2,
      opacity: 0.7
    });
    
    // Initialize sigil animation
    this.sigil = new SigilAnimation(this.sigilContainer);
    
    // Initialize text animation
    this.text = new TextAnimation(this.contentContainer);
  }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const heroAnimation = new HeroAnimation();
  
  // Navigation scroll effect
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
});
