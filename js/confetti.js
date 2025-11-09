// confetti.js - Magiczne confetti!
class ConfettiManager {
  constructor() {
    this.canvas = document.getElementById('confettiCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.isActive = false;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  launch(particleCount = 150) {
    this.isActive = true;
    this.particles = [];
    
    const colors = ['#ff6b6b', '#4ecdc4', '#ffd54f', '#6b5b95', '#88d8b0', '#ffaa85'];
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height - this.canvas.height,
        size: Math.random() * 12 + 4,
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 360,
        spin: Math.random() * 10 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
        wobble: Math.random() * 2
      });
    }
    
    this.animate();
  }

  animate() {
    if (!this.isActive) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    let particlesAlive = false;
    
    this.particles.forEach(particle => {
      particle.y += particle.speed;
      particle.x += Math.sin(particle.angle) * particle.wobble;
      particle.angle += 0.1;
      
      if (particle.shape === 'rect') {
        particle.spin += 0.1;
      }
      
      this.ctx.save();
      this.ctx.translate(particle.x, particle.y);
      
      if (particle.shape === 'rect') {
        this.ctx.rotate(particle.spin);
        this.ctx.fillStyle = particle.color;
        this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size/2, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
      }
      
      this.ctx.restore();
      
      if (particle.y < this.canvas.height) {
        particlesAlive = true;
      }
    });
    
    if (particlesAlive) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.isActive = false;
    }
  }
}

function launchConfetti() {
  const confetti = new ConfettiManager();
  confetti.launch(200);
  
  // Dodatkowe mini eksplozje
  setTimeout(() => confetti.launch(50), 800);
  setTimeout(() => confetti.launch(30), 1200);
}