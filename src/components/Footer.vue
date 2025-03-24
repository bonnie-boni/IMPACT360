<template>
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
  
          <div class="footer-section">
            <img :src="logo" alt="Impact360 Logo" class="logo" />
            <p class="description">
              Empowering communities through technology and entrepreneurship.
            </p>
          </div>
  
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul class="footer-links">
              <li><RouterLink to="/about">About</RouterLink></li>
              <li><RouterLink to="/events">Events</RouterLink></li>
              <li><RouterLink to="/i3-launchpad">I3 Launchpad</RouterLink></li>
              <li><RouterLink to="/blog">Blog</RouterLink></li>
              <li><RouterLink to="/contact">Contact</RouterLink></li>
            </ul>
          </div>
  
          <div class="footer-section">
            <h3>Contact</h3>
            <p>Nakuru County, Kenya</p>
            <p><a href="mailto:impact360.i3@gmail.com">impact360.i3@gmail.com</a></p>
            <p><a href="tel:+254113569079">+254113569079</a></p>
          </div>
  
          <div class="footer-section">
            <h3>Follow Us</h3>
            <div class="social-links">
              <a href="https://www.linkedin.com/company/impact360%E2%80%A2/"><i class="fab fa-linkedin"></i></a>
              <a href="https://www.instagram.com/impac_t360/?hl=en"><i class="fab fa-instagram"></i></a>
              <a href="https://www.tiktok.com/@impact360_"><i class="fab fa-tiktok"></i></a>
            </div>
          </div>
        </div>
  
        <hr class="divider" />
  
        <div class="footer-bottom">
          <p>© 2025 Impact360. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import logo from '@/assets/logo.png';
  </script>
  
  <style scoped>
  .footer {
    background-color: #333;
    color: #ccc;
    padding: 20px 0;
    text-align: center;
  }
  
  .container {
    width: 80%;
    margin: 0 auto;
  }
  
  .footer-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
  }
  
  .footer-section {
    flex: 1;
    min-width: 200px;
  }
  
  .logo {
    height: 50px;
    margin-bottom: 10px;
  }
  
  .description {
    font-size: 14px;
  }
  
  .footer-links {
    list-style: none;
    padding: 0;
  }
  
  .footer-links li {
    margin: 5px 0;
  }
  
  .footer-links a {
    color: #ccc;
    text-decoration: none;
  }
  
  .footer-links a:hover {
    color: white;
  }
  
  .social-links {
    display: flex;
    gap: 10px;
  }
  
  .social-links a {
    color: #ccc;
    font-size: 18px;
  }
  
  .social-links a:hover {
    color: white;
  }
  
  .divider {
    border: 1px solid #444;
    margin: 20px 0;
  }
  
  .footer-bottom {
    font-size: 14px;
    margin-top: 10px;
  }
  </style>
  
