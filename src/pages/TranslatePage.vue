<template>
    <q-page class="flex flex-center">
        <div class="q-gutter-md">
            <h1>Translate {{ app }}</h1>
            <q-btn label="Add new translation" color="primary" @click="addNewTranslation" />
            <q-btn label="Save" color="primary" @click="saveTranslations" />
            <q-table
                :rows="tableData"
                :columns="columns"
                row-key="id"
            >
                <template v-slot:body-cell-keyword="props">
                    <q-td auto-width :props="props">
                        <q-input v-model="props.row.keyword" dense bordered />
                    </q-td>
                </template>
                <template v-slot:body-cell-en="props">
                    <q-td auto-width :props="props">
                        <q-input v-model="props.row.en" dense bordered />
                    </q-td>
                </template>
                <template v-slot:body-cell-fr="props">
                    <q-td auto-width :props="props">
                        <q-input v-model="props.row.fr" dense bordered />
                    </q-td>
                </template>
                <template v-slot:body-cell-es="props">
                    <q-td auto-width :props="props">
                        <q-input v-model="props.row.es" dense bordered />
                    </q-td>
                </template>
            </q-table>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { appsList } from '../store.js'

const route = useRoute()
const app = ref(route.params.app)
const translations = ref([])
const tableData = ref([])
const columns = ref([
  { name: 'keyword', required: true, label: 'Keyword', align: 'left', field: 'keyword' },
  { name: 'en', required: true, label: 'English', align: 'left', field: 'en' },
  { name: 'fr', required: true, label: 'French', align: 'left', field: 'fr' },
  { name: 'es', required: true, label: 'Spanish', align: 'left', field: 'es' }
])

let id = 0

const fetchTranslations = () => {
  const appIndex = appsList.value.findIndex(a => a.name === app.value)
  if (appIndex !== -1 && appsList.value[appIndex].translations.length > 0) {
    // App is in the store and has translations, use the translations from the store
    tableData.value = appsList.value[appIndex].translations
  } else {
    // App is not in the store, fetch the translations
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
        tableData.value = Object.entries(data.Translations).map(([keyword, Translation]) => ({ id: id++, keyword, ...Translation }))
        // Add the app to the store
        appsList.value.push({ name: app.value, translations: tableData.value })
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }
}

const saveTranslations = () => {
  const appIndex = appsList.value.findIndex(a => a.name === app.value)
  if (appIndex !== -1) {
    appsList.value[appIndex].translations = tableData.value
  }
  // show appList (from store) on console
  console.log(appsList.value)
}

// Watch for changes in the route params and re-fetch translations
watch(() => route.params.app, () => {
  app.value = route.params.app
  fetchTranslations()
})

const addNewTranslation = () => {
  tableData.value.push({ id: id++, keyword: '', en: '', fr: '', es: '' })
}
onMounted(fetchTranslations)
</script>
