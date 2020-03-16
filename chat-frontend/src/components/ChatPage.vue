<template>
  <div>
    <chat-window
      :rooms="rooms"
      :messages="messages"
      :messagesLoaded="messagesLoaded"
      :currentUserId="currentUserId.toString()"
      :menuActions="menuActions"
      height="800px"
      @fetchMessages="fetchMessages"
      @menuActionHandler="menuActionHandler"
      @sendMessage="sendMessage"
      @addRoom="dialog = true"
    />
    <new-group :dialog="dialog" @closed="dialog = false"></new-group>
  </div>
</template>

<script>
  import ChatWindow from 'vue-advanced-chat';
  import 'vue-advanced-chat/dist/vue-advanced-chat.css';
  import NewGroup from './NewGroup';

  export default {
    name: 'ChatPage',
    components: {
      ChatWindow,
      NewGroup
    },
    data() {
      return {
        pagination: 0,
        menuActions: [
          {
            name: 'changeName',
            title: 'Change Room Name'
          },
          {
            name: 'leaveGroup',
            title: 'Leave Group'
          },
          {
            name: 'inviteGroup',
            title: 'Invite to Group'
          },
          {
            name: 'deleteGroup',
            title: 'Delete Group'
          }
        ],
        dialog: false
      };
    },
    computed: {
      currentUserId() {
        return this.$store.state.user.id;
      },
      messages() {
        return this.$store.state.messages ? this.$store.state.messages.all : [];
      },
      rooms() {
        return this.$store.state.messages
          ? this.$store.state.messages.latest
          : [];
      },
      messagesLoaded: {
        set(newVal) {
          this.$store.commit('setMessagesLoaded', newVal);
        },
        get() {
          return this.$store.state.messagesLoaded;
        }
      }
    },
    methods: {
      fetchMessages({ room, options }) {
        if (options && options.reset) {
          this.pagination = 0;
          this.$store.commit('resetMessages');
        }
        this.$store.dispatch('loadMessages', {
          loaded: this.pagination,
          roomId: room.roomId
        });
        this.pagination += 100;
      },
      menuActionHandler({ roomId, action }) {
        switch (action.name) {
          case 'changeName':
            break;
          case 'leaveGroup':
            this.$socket.client.emit('leaveGroup', {
              groupId: roomId,
              token: this.$store.state.jwtToken.accessToken
            });
            this.$store.commit('removeRoom', roomId);
            break;
          case 'inviteGroup':
            break;
          case 'deleteGroup':
            this.$socket.client.emit('deleteGroup', {
              groupId: roomId,
              token: this.$store.state.jwtToken.accessToken
            });
            this.$store.commit('removeRoom', roomId);
            break;
        }
      },
      sendMessage({ roomId, content }) {
        this.$socket.client.emit('sendMessage', {
          token: this.$store.state.jwtToken.accessToken,
          roomId: roomId,
          content: content,
          userId: this.$store.state.user.id
        });
      }
    },
    created() {
      this.$socket.client.emit('login', {
        token: this.$store.state.jwtToken.accessToken,
        id: this.$store.state.user.id
      });
    }
  };
</script>
<style>
  .box-footer > textarea {
    height: 40px !important;
  }
</style>
