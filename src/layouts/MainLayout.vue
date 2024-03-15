<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <router-link to="/" class="homelink">Translations App</router-link>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <router-link to="/" >
        <q-btn
          class="q-ma-md"
          label="My Apps"
          color="primary"
        />
      </router-link>

      <q-list>
        <q-item-label
          header
        >
          Applications
        </q-item-label>
        <q-item
          v-for="app in appsList"
          :key="app.id"
          clickable
          v-ripple
        >
        <router-link :to="`/translate/${app.name}`">
          <q-item-section>
              {{ app.name }}
            </q-item-section>
        </router-link>
      </q-item>
    </q-list>
  </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { appsList, fetchAppsList } from '../store'

defineOptions({
  name: 'MainLayout'
})

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  if (appsList.value.length === 0) {
    fetchAppsList()
  }
})
</script>
<style scoped>
.homelink {
  color: white;
  text-decoration: none;
  font-size: 20px;
}
</style>
