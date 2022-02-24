<template>
  <div id="app">
    <div v-if="isSignedIn">
      <amplify-greetings></amplify-greetings>
      <router-rink custom v-slot="{ navigate }" :to="{ name: 'AlbumIndex'}">
        <button @click="navigate">TOP</button>
      </router-rink>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    isSignedIn () {
      return this.$store.state.user !== null
    }
  }
}
</script>
