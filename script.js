const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX - 10 + 'px';
  cursor.style.top = e.clientY - 10 + 'px';
});

document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// Update Year
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const icon = menuToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.querySelector('i').classList.add('fa-bars');
    menuToggle.querySelector('i').classList.remove('fa-times');
  });
});

// Typing Effect
const typedSpan = document.getElementById('typed');
const phrases = ['Cybersecurity Developer', 'Frontend Developer', 'Tech Enthusiast', 'Problem Solver'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typedSpan.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedSpan.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }
  
  let typeSpeed = isDeleting ? 50 : 100;
  
  if (!isDeleting && charIndex === current.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500;
  }
  
  setTimeout(typeEffect, typeSpeed);
}
typeEffect();

// Counter Animation
const counters = document.querySelectorAll('.stat h3');
const animateCounter = (el) => {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const increment = target / 50;
  const updateCounter = () => {
    if (current < target) {
      current += increment;
      el.textContent = Math.ceil(current) + '+';
      requestAnimationFrame(updateCounter);
    } else {
      el.textContent = target + '+';
    }
  };
  updateCounter();
};

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Animate skill bars
      if (entry.target.classList.contains('skill-card')) {
        entry.target.querySelectorAll('.skill-progress').forEach(bar => {
          bar.style.width = bar.dataset.progress + '%';
        });
      }
      
      // Animate counters
      if (entry.target.classList.contains('hero-text')) {
        counters.forEach(animateCounter);
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Trigger counter on hero load
window.addEventListener('load', () => {
  setTimeout(() => counters.forEach(animateCounter), 500);
});

// Project Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => card.style.display = 'none', 300);
      }
    });
  });
});

// Form Submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  const originalHTML = btn.innerHTML;
  
  // Show loading state
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  
  const formData = new FormData(form);
  const action = form.getAttribute('action');
  
  try {
    const response = await fetch(action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
      form.reset();
      
      // Optional: Redirect if _next is provided and not the placeholder
      const nextUrl = form.querySelector('input[name="_next"]').value;
      if (nextUrl && !nextUrl.includes('yourdomain.com')) {
        setTimeout(() => {
          window.location.href = nextUrl;
        }, 2000);
      }
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
    btn.style.background = 'linear-gradient(135deg, #ef4444, #f59e0b)';
    console.error('Error:', error);
  } finally {
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      btn.style.background = '';
    }, 3000);
  }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});