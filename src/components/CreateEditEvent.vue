<template>
  <div class="create-event">
    <div class="page-header">
      <h1>{{ isEditing ? 'Edit Event' : 'Create New Event' }}</h1>
      <router-link to="/admin/events" class="back-btn">
        <i class="fas fa-arrow-left"></i> Back to Events
      </router-link>
    </div>

    <div class="event-form-container">
      <form @submit.prevent="saveEvent" class="event-form">
        <div class="form-columns">
          <div class="form-column">
            <div class="form-group">
              <label for="title">Event Title <span class="required">*</span></label>
              <input
                type="text"
                id="title"
                v-model="event.title"
                placeholder="Enter event title"
                required
              />
            </div>

            <div class="form-group">
              <label for="date">Event Date & Time <span class="required">*</span></label>
              <input
                type="datetime-local"
                id="date"
                v-model="event.date"
                required
              />
            </div>

            <div class="form-group">
              <label for="price">Ticket Price (KSH) <span class="required">*</span></label>
              <input
                type="number"
                id="price"
                v-model="event.price"
                placeholder="Enter ticket price in KSH"
                min="0"
                step="100"
                required
              />
            </div>

            <div class="form-group">
              <label for="location">Event Location <span class="required">*</span></label>
              <input
                type="text"
                id="location"
                v-model="event.location"
                placeholder="Enter event location"
                required
              />
            </div>

            <div class="form-group">
              <label for="capacity">Event Capacity</label>
              <input
                type="number"
                id="capacity"
                v-model="event.capacity"
                placeholder="Maximum number of attendees"
                min="1"
              />
            </div>
          </div>

          <div class="form-column">
            <div class="form-group">
              <label for="thumbnail">Event Thumbnail <span class="required">*</span></label>
              <div class="thumbnail-upload-container">
                <div
                  class="thumbnail-preview"
                  :style="{ backgroundImage: thumbnailPreview ? `url(${thumbnailPreview})` : 'none' }"
                >
                  <div class="upload-placeholder" v-if="!thumbnailPreview">
                    <i class="fas fa-image"></i>
                    <p>Click to upload image</p>
                  </div>
                  <input
                    type="file"
                    id="thumbnail"
                    @change="handleThumbnailUpload"
                    accept="image/*"
                    class="file-input"
                    :required="!isEditing"
                  />
                </div>
                <p class="file-instructions">Recommended size: 800 x 600px. Max size: 2MB</p>
              </div>
            </div>

            <div class="form-group">
              <label for="category">Event Category</label>
              <select id="category" v-model="event.category">
                <option value="">Select a category</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="concert">Concert</option>
                <option value="exhibition">Exhibition</option>
                <option value="seminar">Seminar</option>
                <option value="networking">Networking</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label>Featured Event</label>
              <div class="switch-container">
                <label class="switch">
                  <input type="checkbox" v-model="event.isFeatured">
                  <span class="slider"></span>
                </label>
                <span class="switch-label">{{ event.isFeatured ? 'Yes' : 'No' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="description">Event Description <span class="required">*</span></label>
          <textarea
            id="description"
            v-model="event.description"
            placeholder="Enter detailed event description"
            required
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$router.push('/admin/events')">Cancel</button>
          <button type="submit" class="save-btn">{{ isEditing ? 'Update Event' : 'Create Event' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  name: 'CreateEditEvent',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const eventId = computed(() => route.params.id);
    const isEditing = computed(() => !!eventId.value);
    const thumbnailPreview = ref(null);

    // Initialize empty event object
    const event = ref({
      title: '',
      date: '',
      description: '',
      price: '',
      location: '',
      capacity: '',
      category: '',
      isFeatured: false,
      thumbnail: null,
      ticketsSold: 0,
      isPostponed: false,
      originalDate: null
    });

    // Load event data if editing
    onMounted(() => {
      if (isEditing.value) {
        // In a real app, you would fetch from API using eventId
        // This is mock data for demonstration
        fetchEventData(eventId.value);
      } else {
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        event.value.date = tomorrow.toISOString().slice(0, 16);
      }
    });

    // Fetch event data from Supabase
    const fetchEventData = async (id) => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching event:', error)
        alert('Error fetching event')
        router.push('/admin/events')
      } else {
        event.value = { ...data }
        event.value.date = event.value.date.substring(0, 16) // Format for datetime-local input
        thumbnailPreview.value = data.thumbnail
      }
    }

    // Handle thumbnail upload
    const handleThumbnailUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit');
        return;
      }

      // Create preview URL
      thumbnailPreview.value = URL.createObjectURL(file);
      event.value.thumbnail = file;
    };

    const uploadEvent = async () => {
      const eventData = {
        title: event.value.title,
        date: event.value.date,
        description: event.value.description,
        price: event.value.price,
        location: event.value.location,
        capacity: event.value.capacity,
        category: event.value.category,
        isFeatured: event.value.isFeatured,
        image: event.value.thumbnail ? event.value.thumbnail.name : null, // Store image name
      };

      let query = supabase.from('events');

      if (isEditing.value) {
        query = query.update(eventData).eq('id', eventId.value);
      } else {
        query = query.insert([eventData]);
      }

      const { data, error } = await query.select();

      if (error) {
        console.error('Error saving event:', error);
        alert('Error saving event');
      } else {
        console.log('Event saved successfully:', data);
        alert('Event saved successfully');
      }
    };

    // Save event
    const saveEvent = async () => {
      // Validate required fields
      if (!event.value.title || !event.value.date || !event.value.price ||
        !event.value.description || !event.value.location) {
        alert('Please fill in all required fields');
        return;
      }

      if (!isEditing.value && !event.value.thumbnail) {
        alert('Please upload a thumbnail image');
        return;
      }

      // Here you would typically send data to your API
      console.log('Saving event:', event.value);

      await uploadEvent();

      // Simulate API call
      setTimeout(() => {
        // Navigate back to events list on success
        router.push('/admin/events');
      }, 500);
    };

    return {
      event,
      isEditing,
      thumbnailPreview,
      handleThumbnailUpload,
      saveEvent
    }
  },
}
</script>

<style scoped>
.create-event {
  padding: 10px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.page-header h1 {
  font-size: 24px;
  color: #2c3e50;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.event-form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.form-columns {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.form-column {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.required {
  color: #e74c3c;
}

input[type="text"],
input[type="number"],
input[type="datetime-local"],
select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

textarea {
  min-height: 150px;
  resize: vertical;
}

.thumbnail-upload-container {
  width: 100%;
}

.thumbnail-preview {
  width: 100%;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 5px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #95a5a6;
}

.upload-placeholder i {
  font-size: 40px;
  margin-bottom: 10px;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-instructions {
  margin-top: 8px;
  font-size: 12px;
  color: #95a5a6;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2ecc71;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.switch-label {
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.cancel-btn {
  padding: 12px 25px;
  background-color: #f5f7fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
}

.save-btn {
  padding: 12px 25px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background-color: #27ae60;
}

@media (max-width: 768px) {
  .form-columns {
    flex-direction: column;
    gap: 0;
  }
}
</style>
