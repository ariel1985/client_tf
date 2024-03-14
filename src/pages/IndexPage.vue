<template>
    <q-page class="flex flex-center">
      <div>
        <h1 class="text-h4">Apps Page</h1>
        <div class="text-h6 text-red ">{{ msg }}</div>

          <!-- create a button to add new app -->
          <q-btn
              label="Add new app"
              color="primary"
              @click="showPopup = true"
          />
          <q-popup-edit v-model="showPopup" @save="addNewApp" content-class="my-popup">
            <template v-slot:default>
              <q-input v-model="newAppName" dense autofocus counter @keyup.enter="addNewApp" />
              <q-btn
              label="Add"
              color="primary"
              @click="addNewApp"
              />
              <!-- show errors -->
              <q-input v-model="msg" dense readonly />
            </template>
          </q-popup-edit>

          <!-- list of apps -->
          <q-list>
              <q-item
                  v-for="app in appsList"
                  :key="app.id"
                  clickable
                  v-ripple
              >
                  <q-item-section>
                      App name: <b>{{ app }}</b>

                      <!-- download as xslx button -->
                      <q-btn
                          flat
                          dense
                          round
                          icon="get_app"
                          aria-label="Download"
                          @click="downloadAsXlsx(app)"
                      />

                  </q-item-section>
              </q-item>
          </q-list>
      </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { appsList, fetchAppsList } from '../store'

const showPopup = ref(false)
const newAppName = ref('')
const msg = ref('')

// download as xlsx - send to api/
const downloadAsXlsx = async (app) => {
  const response = await fetch(`/api/Apps/${app}/download`, {
    method: 'GET',
    headers: {
      Accept: '*/*'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  } else {
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${app}.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const addNewApp = async () => {
  const response = await fetch('/api/Apps', {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newAppName.value)
  })

  if (!response.ok) {
    msg.value = 'Error adding app!  '
    throw new Error(`HTTP error! status: ${response.status}`)
  } else {
    appsList.value.push(newAppName.value)
    showPopup.value = false
    newAppName.value = ''
    msg.value = 'App added successfully'
  }
}

onMounted(fetchAppsList)
</script>
