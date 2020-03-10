<template>
  <v-snackbar
    top
    :color="snackbarSettings.mode"
    :timeout="snackbarSettings.timeout"
    v-model="snackbarOn"
  >
    {{ snackbarSettings.text }}
    <v-btn color="white" text @click="resetNotification">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    name: 'statusbar',
    computed: {
      snackbarSettings() {
        return this.$store.state.notification;
      },
      snackbarOn: {
        get() {
          return this.$store.state.launchNotification;
        },
        set() {
          this.$store.commit('statusbarOff');
        }
      }
    },
    methods: {
      resetNotification() {
        this.$store.commit('statusbarOff');
      }
    }
  };
</script>

<style scoped></style>
