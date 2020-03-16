<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="heading">New Group</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Group name"
                required
                v-model="groupName"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Group description"
                v-model="groupDescription"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Initial Message"
                auto-grow
                v-model="firstMessage"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="members"
                :items="users"
                label="Select group members"
                multiple
                chips
                deletable-chips
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="cancel">Cancel</v-btn>
        <v-btn color="green" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { http } from '../plugins/http';

  export default {
    name: 'NewGroup',
    props: ['dialog'],
    data() {
      return {
        groupName: '',
        groupDescription: '',
        firstMessage: '',
        members: null,
        users: null,
        show: false
      };
    },
    methods: {
      save() {
        const newGroup = {
          groupName: this.groupName,
          groupDescription: this.groupDescription,
          users: this.members
        };
        this.$socket.client.emit('roomAdded', {
          group: newGroup,
          message: this.firstMessage,
          senderId: this.$store.state.user.id,
          token: this.$store.state.jwtToken.accessToken
        });
        this.show = false;
        this.groupName = '';
        this.groupDescription = '';
        this.firstMessage = '';
        this.members = null;
      },
      cancel() {
        this.groupName = '';
        this.groupDescription = '';
        this.firstMessage = '';
        this.members = null;
        this.show = false;
      }
    },
    watch: {
      // eslint-disable-next-line no-unused-vars
      dialog(newDialog, oldDialog) {
        if (newDialog !== this.show) {
          this.show = newDialog;
        }
      },
      // eslint-disable-next-line no-unused-vars
      show(newShow, oldShow) {
        if (newShow === false) {
          this.$emit('closed');
        }
      }
    },
    created() {
      http
        .get('chatApi/users', {
          headers: {
            Authorization: `Bearer ${this.$store.state.jwtToken.accessToken}`
          }
        })
        .then(response => {
          this.users = response.data;
        })
        .catch(e => console.log(e));
    }
  };
</script>

<style>
  .container-center {
    z-index: 20 !important;
  }
</style>
