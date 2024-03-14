<template>
    <q-page class="flex flex-center">
      <div class="q-gutter-md">
        <h1 class="text-h4">Apps Page</h1>
        <div class="text-h6 text-red ">{{ msg }}</div>
        <div>
          <!-- create a button to add new app -->
          <q-btn color="primary" @click="showPopup = true">
            Add new app
          </q-btn>
          <q-popup-edit v-model="showPopup" @save="addNewApp" content-class="my-popup">
            <template v-slot:default>
              <q-input v-model="newAppName" dense autofocus counter @keyup.enter="addNewApp" />
              <q-btn
                  label="Add & Close"
                  color="primary"
                  @click.stop="addNewApp"
              />
              <!-- show errors -->
              <q-input v-model="msg" dense readonly />
            </template>
          </q-popup-edit>
        </div>
        <!-- list of apps -->
        <q-list>
            <q-item
                v-for="app in appsList"
                :key="app.id"
                v-ripple
            >
                <q-item-section>
                    App name: <b>{{ app.name }}</b>
                    <!-- download as xslx button -->
                    <q-btn
                        flat
                        dense
                        round
                        icon="get_app"
                        aria-label="Download"
                        @click.stop="downloadAsXlsx(app)"
                    >
                      DOWNLOAD
                    </q-btn>
                    <!-- deploy button -->
                    <q-btn
                        flat
                        dense
                        round
                        icon="cloud_upload"
                        aria-label="Deploy"
                        @click.stop="deployApp(app)"
                    >
                      DEPLOY
                    </q-btn>
                </q-item-section>
            </q-item>
        </q-list>
      </div>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { appsList } from '../store'

const showPopup = ref(false)
const newAppName = ref('')
const msg = ref('')

// download as xlsx - send to api/
const downloadAsXlsx = async (app) => {
  const response = await fetch(`/api/Apps/${app.name}/download`, {
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
    link.setAttribute('download', `${app.name}.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const addNewApp = async () => {
  try {
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
      console.log('App added successfully', newAppName.value)
      newAppName.value = ''
      msg.value = 'App added successfully'
    }
  } catch (error) {
    console.error(error)
  } finally {
    showPopup.value = false
  }
}
</script>
