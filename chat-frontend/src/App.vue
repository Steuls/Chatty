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

      <v-btn @click="signOut" text>
        <span class="mr-2">Sign Out</span>
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
        this.$socket.client.emit('login', {
          id: this.$store.state.user.id,
          token: this.$store.state.jwtToken.accessToken
        });
      },
      newMessage(data) {
        const { roomId, message } = data;
        this.$store.commit('updateLatestMessage', { roomId, message });
        if (this.$store.state.currentRoom === roomId) {
          this.$store.commit('updateCurrentMessages', message);
        }
      },
      testReceived(data) {
        console.log(data.message);
      },
      newRoom({ group }) {
        this.$store.commit('addRoom', group);
      },
      error(error) {
        console.log(error);
      },
      forceLeave(room) {
        this.$socket.client.emit('leaveGroup', { groupId: room });
      },
      ChangedGroupName(data) {
        this.$store.commit('updateGroupName', { data });
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
      doTokenRefresh() {
        if (this.loggedIn) this.$store.dispatch('refreshToken');
      },
      signOut() {
        this.$store.commit('restoreState');
      }
    },
    computed: {
      loggedIn() {
        return this.$store.getters.loggedIn;
      }
    },
    watch: {
      // eslint-disable-next-line no-unused-vars
      loggedIn(newVal, oldVal) {
        if (newVal === true) {
          this.$ls.set('token', this.$store.state.jwtToken.accessToken);
        }
      }
    },
    created() {
      // const token = this.$ls.get('token', null);
      // if (token !== null) {
      //
      // }
      this.timedTaskRef = setInterval(this.doTokenRefresh, 8 * 60000); // every 8 minutes refresh JWT
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
