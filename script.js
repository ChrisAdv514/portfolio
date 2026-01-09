// Prevent framing
try {
  if (top !== self) top.location = self.location.href;
} catch {
  // If cross-origin blocks access, at least bust out by navigating self.
  self.location = self.location.href;
}


// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const backdrop = document.querySelector('[data-nav-backdrop]');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!hamburger || !navLinks || !backdrop) return;

  hamburger.setAttribute('aria-haspopup', 'true');

  const firstLink = () => navLinks.querySelector('a[href^="#"]');

  const setOpen = (open) => {
    navLinks.classList.toggle('active', open);
    hamburger.classList.toggle('active', open);
    backdrop.classList.toggle('active', open);
    document.body.classList.toggle('no-scroll', open);

    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

    if (open) {
      const a = firstLink();
      if (a) a.focus();
    } else {
      hamburger.focus();
    }
  };

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!navLinks.classList.contains('active'));
  });

  backdrop.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setOpen(false);
  });

  // Smooth scroll + close menu for in-page anchors
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const targetId = a.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    setOpen(false);

    const y = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: prefersReduced.matches ? 'auto' : 'smooth' });
  });
});


// Animation on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.skill-category, .project-card, .timeline-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item');
    
    animatedElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Trigger once on load
    animateOnScroll();
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// EASTER EGG
document.addEventListener('DOMContentLoaded', () => {
    const eggContainer = document.querySelector('#easter-egg-container');
    const footer = document.querySelector('footer');
    if (!eggContainer || !footer) return;

    let isRevealed = false;
    let scrollDownCounter = 0;
    const scrollThreshold = 1; // How many scroll attempts are needed
    let lastScrollY = window.scrollY; // To track scroll direction

    const handleScroll = () => {
        if (isRevealed) {
            window.removeEventListener('scroll', handleScroll);
            return;
        }

        // Use more reliable properties for height calculation
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Explicitly track the scroll direction
        const isScrollingDown = scrollPosition > lastScrollY;
        lastScrollY = scrollPosition; // Update for the next event

        // A small buffer to ensure the condition is met across browsers
        const atBottom = scrollPosition + windowHeight >= documentHeight - 2;

        // Only trigger when the user is AT the bottom AND is still trying to scroll DOWN
        if (atBottom && isScrollingDown) {
            scrollDownCounter++;
            
            // The "draw back" effect. We push the scroll position up slightly.
            window.scrollTo(0, scrollPosition - 10);

            if (scrollDownCounter > scrollThreshold) {
                isRevealed = true;
                eggContainer.classList.add('revealed');

                // Wait for the CSS transition to start before scrolling
                setTimeout(() => {
                    const firstEggSection = document.querySelector('#cat-easter-egg');
                    if (firstEggSection) {
                        firstEggSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100); // A small delay ensures the element is rendered before we scroll
            }
        } else if (!atBottom) {
            // Reset the counter if the user scrolls back up
            scrollDownCounter = 0;
        }
    };

    window.addEventListener('scroll', handleScroll);
});
