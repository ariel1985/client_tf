<template>
    <q-page class="flex q-ma-md">
        <div class="q-gutter-md">
            <h1>Translate :{{ app }}</h1>
            <div class="q-gutter-md full-width">
                <q-btn label="Add new translation" color="primary" @click="addNewTranslation" />
                <q-btn label="Save" color="primary" @click="saveTranslations" />
                <q-table
                    full-width
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
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { appsList } from '../store.js'

const route = useRoute()
const app = ref(route.params.app)
const tableData = ref([])

const columns = ref([
  { name: 'keyword', required: true, label: 'Keyword', align: 'left', field: 'keyword' },
  { name: 'en', required: true, label: 'English', align: 'left', field: 'en' },
  { name: 'fr', required: true, label: 'French', align: 'left', field: 'fr' },
  { name: 'es', required: true, label: 'Spanish', align: 'left', field: 'es' }
])

let id = 0

const fetchTranslations = () => {
  const appIndex = appsList.value.findIndex(a => a.Name === app.value)
  if (appIndex !== -1 && appsList.value[appIndex].Translations) {
    // App is in the store and has translations, use the translations from the store
    tableData.value = appsList.value[appIndex].Translations
  } else {
    console.error('Error: Translations for this app are not available in the store.')
  }
}

const saveTranslations = () => {
  const appIndex = appsList.value.findIndex(a => a.Name === app.value)
  if (appIndex !== -1) {
    appsList.value[appIndex].Translations = tableData.value
    // update the app last_updated field
    appsList.value[appIndex].Last_updated = new Date().toISOString()
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
