<template>
    <q-page class="flex flex-center">
        <div>
            <h1>Translate {{ app }}</h1>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const app = ref(route.params.app)
const translations = ref([])

// get app translations from url api in localhost : /api/Apps/:app/translations
const fetchTranslations = () => {
  fetch(`/api/Apps/${app.value}/translations`, {
    method: 'GET',
    headers: {
      Accept: '*/*'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      } else {
        return response.json()
      }
    })
    .then(data => {
      translations.value = data
      console.log(data)
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

// Watch for changes in the route params and re-fetch translations
watch(() => route.params.app, () => {
  app.value = route.params.app
  fetchTranslations()
})

onMounted(fetchTranslations)
</script>
