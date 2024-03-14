import { ref } from 'vue'

export const appsList = ref([])

export async function fetchAppsList () {
  let id = 0
  try {
    const response = await fetch('/api/apps')
    const appNames = await response.json()
    // Fetch translations for each app
    for (const appName of appNames) {
      const translationsResponse = await fetch(`/api/Apps/${appName}/translations`)
      const translationsData = await translationsResponse.json()
      const formattedTranslations = Object.entries(translationsData.Translations).map(([keyword, Translation]) => ({ id: id++, keyword, ...Translation }))
      // Add the app to the store with its translations
      appsList.value.push({ name: appName, translations: formattedTranslations, last_updated: new Date() })
    }
    console.log('fetched data', appsList.value)
  } catch (error) {
    console.error('Failed to fetch applications:', error)
  }
}
