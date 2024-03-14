import { ref } from 'vue'

export const appsList = ref([])

export async function fetchAppsList () {
  try {
    const response = await fetch('/api/apps')
    const data = await response.json()
    appsList.value = data
  } catch (error) {
    console.error('Failed to fetch applications:', error)
  }
}
