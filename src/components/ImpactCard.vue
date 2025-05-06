<template>
   <div class="card-container">
    <div class="icon">
      <slot name="icon"></slot>
    </div>
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-description">{{ description }}</p>
   </div>
</template>
<script setuo>
export default {
    name: 'ImpactCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
}
</script>
<style scoped lang="scss">
.card-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: left;

  width: 100%; /* Make the card take up full width */
  max-width: 300px; /* Set a maximum width */


  margin: 10px;
  font-family: sans-serif;
}

.icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Media query for larger screens */
@media screen and (min-width: 768px) {
  .card-container {
    width: 150px; /* Restore original width on larger screens */
  }
}
</style>
