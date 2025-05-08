<template>
    <div class="container">
      <Header />
      <div class="flex-container">
        <!-- Contact Form Section -->
        <div class="contact-form">
          <h2>Get In Touch</h2>
          <p>
            Have questions? We are here to help. Send us a message and we will reply as soon as possible!
          </p>

          <form @submit.prevent="sendEmail">
            <div class="form-group">
              <label for="name">Name</label>
              <input v-model="form.name" type="text" id="name" placeholder="Your name" required class="form-control">
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input v-model="form.email" type="email" id="email" placeholder="your@gmail.com" required class="form-control">
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <input v-model="form.subject" type="text" id="subject" placeholder="How can we help?" required class="form-control">
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea v-model="form.message" id="message" placeholder="Your message" rows="6" required class="form-control"></textarea>
            </div>

            <button type="submit" class="btn">Send Message</button>
          </form>

          <p v-if="responseMessage" class="response-message" :class="{ 'success': success, 'error': !success }">
            {{ responseMessage }}
          </p>
        </div>

        <!-- Contact Information Section -->
        <div class="contact-info">
          <div class="info-card">
            <i class="fas fa-map-marker-alt info-icon"></i>
            <div class="info-content">
              <h3>Visit Us</h3>
              <p>Nakuru, Kenyatta Avenue<br>Kenya, 20100</p>
            </div>
          </div>
          <div class="info-card">
            <i class="fas fa-phone info-icon"></i>
            <div class="info-content">
              <h3>Call Us</h3>
              <p>Mon-Fri, 8am to 5pm<br>+254 113 569 079</p>
            </div>
          </div>
          <div class="info-card">
            <i class="fas fa-envelope info-icon"></i>
            <div class="info-content">
              <h3>Email Us</h3>
              <p class="break-words">impact360.i3@gmail.com</p>
            </div>
          </div>
          <div class="info-card">
            <i class="fas fa-clock info-icon"></i>
            <div class="info-content">
              <h3>Business Hours</h3>
              <p>Monday to Friday<br>24hrs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import Header from "@/components/Header.vue"
  import emailjs from "emailjs-com";

  export default {
    name: "contact",
    data() {
      return {
        form: { name: "", email: "", subject: "", message: "" },
        responseMessage: "",
        success: false,
      };
    },
    methods: {
      sendEmail() {
        emailjs
          .send("service_exl3s82", "template_s5jcnqc", this.form, "axpEegaKN-SXy50vX")
          .then(() => {
            this.responseMessage = "Message sent successfully!";
            this.success = true;
            this.form = { name: "", email: "", subject: "", message: "" }; // Reset form
          })
          .catch(() => {
            this.responseMessage = "Failed to send message.";
            this.success = false;
          });
      },
    },
  };
  </script>

  <style scoped>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .flex-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* Contact Form Section */
  .contact-form {
    width: 100%;
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .contact-form h2 {
    font-size: 2rem;
    font-weight: bold;
    color: black;
    margin-bottom: 1rem;
  }

  .contact-form p {
    color: Black;
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;

  }

  .form-group label {
    display: block;
    color: black;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddddddcc;
    border-radius: 0.5rem;
    background-color: #ffffff;
    transition: all 0.3s;
  }

  .form-control:focus {
    outline: none;
    border-color: #4B67BC;
    box-shadow: 0 0 0 3px #0D2D56;
  }

  textarea.form-control {
    resize: vertical;
  }

  .btn {
    display: block;
    width: 100%;
    background-color:black;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn:hover {
    background-color: #4B67BC;
  }

  .response-message {
    margin-top: 1rem;
    font-weight: 600;
    text-align: center;
  }

  .success {
    color: #16a34a;
  }

  .error {
    color: #dc2626;
  }

  /* Contact Information Section */
  .contact-info {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .info-card {
    background-color: white;
    padding: 1.25rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .info-icon {
    color: #316CE7;
    font-size: 1.5rem;
  }

  .info-content h3 {
    font-size: 1rem;
    font-weight: 600;
  }

  .info-content p {
    color: black;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  .break-words {
    word-break: break-word;
  }

  /* Responsive Design */
  @media (min-width: 640px) {
    .contact-info {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (min-width: 768px) {
    .container {
      padding: 4rem 1rem;
    }

    .contact-form {
      padding: 2.5rem;
    }

    .contact-form h2 {
      font-size: 2.25rem;
    }

    .contact-form p {
      font-size: 1.25rem;
    }

    .form-group label {
      font-size: 1.125rem;
    }

    .form-control, .btn {
      padding: 1rem;
    }

    .info-icon {
      font-size: 1.75rem;
    }

    .info-content h3 {
      font-size: 1.125rem;
    }

    .info-content p {
      font-size: 1rem;
    }
  }

  @media (min-width: 1024px) {
    .container {
      padding: 5rem 1rem;
    }

    .flex-container {
      flex-direction: row;
    }

    .contact-form {
      width: 60%;
      padding: 3rem;
    }

    .contact-form h2 {
      font-size: 2.5rem;
    }

    .contact-info {
      width: 40%;
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: 1280px) {
    .contact-form {
      width: 65%;
    }

    .contact-info {
      width: 35%;
    }
  }
  </style>
