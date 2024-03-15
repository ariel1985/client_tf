<template>
    <q-page class="flex q-ma-md">
      <div class="q-gutter-md">
        <h1 class="text-h4">Apps Page</h1>
        <div class="text-h6 text-red ">{{ msg }}</div>
        <div>
          <!-- create a button to add new app -->
          <q-btn color="primary" @click="showPopup = true">
            Add new app
          </q-btn>
          <q-popup-edit v-model="showPopup" @save="addNewApp" content-class="my-popup" class="popup-new-app">
            <template v-slot:default>
              <q-input v-model="newAppName" dense autofocus counter @keyup.enter="addNewApp" />
              <q-btn
                  label="Save"
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
                :class="{ 'bg-warning': isUpdatedBeforeLoading(app) }"
            >
                <q-item-section class="itembox">

                  <div class="tr-count">
                    <q-badge :label="app.Translations ? app.Translations.length : 1" color="primary" />
                  </div>

                  <div>
                    App name: <router-link :to="`/translate/${app.Name}`" class="appname">
                      <b>{{ app.Name }}</b>
                    </router-link>
                  </div>
                  Last Updated: {{ formatDate(app.Last_updated) }}
                </q-item-section>

                <q-item-section side class="item-btns">
                  <!-- download as xslx button -->
                  <q-btn
                      flat
                      dense
                      round
                      title="Download"
                      icon="get_app"
                      aria-label="Download"
                      @click.stop="downloadAsXlsx(app)"
                  />
                  <!-- deploy button -->
                  <q-btn
                      flat
                      dense
                      round
                      title="Deploy"
                      icon="cloud_upload"
                      aria-label="Deploy"
                      @click.stop="deployApp(app)"
                  />
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

const addNewApp = () => {
  if (!newAppName.value) {
    msg.value = 'App name is required!'
    return
  }
  fetch('/api/Apps', {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newAppName.value)
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          msg.value = `Error adding app! ${errorData.message}`
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      } else {
        return response.json().then(responseData => {
          console.log('response', responseData)
          console.log('appsList', appsList.value)
          appsList.value.push(responseData)
          console.log('App added successfully', newAppName.value)
          console.log('appsList', appsList.value)

          newAppName.value = ''
          msg.value = 'App added successfully'
        })
      }
    })
    .catch(error => {
      console.error(error)
    })
    .finally(() => {
    // hide the popup-new-app with css after adding new app
    // since it's not working with showPopup.value = false
      document.querySelector('.popup-new-app').style.display = 'none'
    })
}

// download as xlsx - send to api/Apps/AppName/download
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

// deploy app - send to api/Apps/AppName/deploy
const deployApp = async (app) => {
  if (newAppName.value === '') {
    msg.value = 'App name is required!'
    return
  }
  fetch(`/api/Apps/${app.name}/deploy`, {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appsList.value.find(app => app.name === newAppName.value))
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          msg.value = `Error adding app! ${errorData.message}`
          throw new Error(`HTTP error! status: ${response.status}`)
        })
      } else {
        return response.json().then(() => {
          console.log('App added successfully', newAppName.value)
          newAppName.value = ''
          msg.value = 'App added successfully'
        })
      }
    })
    .catch(error => {
      console.error(error)
    })
    .finally(() => {
      showPopup.value = false
    })
}

const isUpdatedBeforeLoading = (app) => {
  const lastUpdated = new Date(app.lastUpdated)
  const loadingTime = ref(new Date())
  return lastUpdated < loadingTime.value
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}
</script>

<style>
.appname {
  color: #1976d2;
  text-decoration: none;
}
.itembox {
  display: flex;
  justify-content: space-between;
  width: 350px;
  border: 2px solid black;
  border-radius: 10px;
  padding: 20px;
}
.item-btns {
  margin: 5px;
  justify-content: left;
  align-items: left;
}
.tr-count {
  display: flex;
  justify-content: right;
  align-items: right;
}
</style>
