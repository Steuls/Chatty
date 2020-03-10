<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Chatty Logo"
          class="shrink mr-2"
          contain
          src="@/assets/Chatty_Logo.png"
          transition="scale-transition"
          width="80"
        />

        <v-img
          alt="Chatty Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="@/assets/Chatty_Name.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="logStuff" text>
        <span class="mr-2">Test Button</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <transition name="fade">
        <template v-if="!loggedIn && !override">
          <login @register="loginMode = false" v-if="loginMode" />
          <register @login="loginMode = true" v-else />
        </template>
        <chat-page v-else />
      </transition>
    </v-content>
    <statusbar />
  </v-app>
</template>

<script>
  import login from './components/login';
  import register from './components/register';
  import statusbar from './components/statusbar';
  import ChatPage from './components/ChatPage';

  export default {
    name: 'App',
    components: {
      login,
      register,
      statusbar,
      ChatPage
    },
    sockets: {
      connect() {
        this.$socket.client.emit('login', this.$store.state.user.id);
      },
      newMessage({ roomId, message }) {
        this.$store.commit('updateLatestMessage', { roomId, message });
        if (this.$store.state.currentRoom === roomId) {
          this.$store.commit('updateCurrentMessages', message);
        }
      },
      testReceived(data) {
        console.log(data.message);
      }
    },
    data() {
      return {
        loginMode: true,
        override: false,
        timedTaskRef: null
      };
    },
    methods: {
      doNotification() {
        this.$store.commit('changeStatusbar', {
          mode: 'success',
          text: 'This was a test',
          on: true
        });
      },
      doOverride() {
        this.override = true;
      },
      testSend() {
        this.$socket.client.emit('test', {
          token: this.$store.state.jwtToken.accessToken,
          message: 'this was a test'
        });
        console.log('Test sent');
      },
      doTokenRefresh() {
        if (this.loggedIn) this.$store.dispatch('refreshToken');
      },
      logStuff() {
        console.log(this.$store.state.messages.latest);
      }
    },
    computed: {
      loggedIn() {
        return this.$store.getters.loggedIn;
      }
    },
    created() {
      this.timedTaskRef = setInterval(this.doTokenRefresh, 8 * 60000);
    },
    beforeDestroy() {
      clearInterval(this.timedTaskRef);
    }
  };
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
