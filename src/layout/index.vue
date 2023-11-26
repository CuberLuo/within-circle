<template>
  <header>
    <NavBar />
  </header>
  <main>
    <AppMain />
  </main>
  <footer>
    <Tabbar />
  </footer>
</template>

<script setup>
import AppMain from './components/AppMain.vue'
import Tabbar from './components/Tabbar.vue'
import NavBar from './components/NavBar.vue'
</script>

<style scoped>
footer {
  height: var(--van-tabbar-height);
}
</style>
