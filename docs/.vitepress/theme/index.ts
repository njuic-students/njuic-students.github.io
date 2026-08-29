import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'
import ContributorShowcase from './components/ContributorShowcase.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ContributorShowcase', ContributorShowcase)
  }
}
