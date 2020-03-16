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
                v-if="groupMode"
                label="Group name"
                required
                v-model="groupName"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-if="groupMode"
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
              <v-radio-group v-model="groupMode" row>
                <v-radio label="Private" :value="false"></v-radio>
                <v-radio label="Group" :value="true"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="members"
                :items="users"
                :label="memberSelectLabel"
                :multiple="groupMode"
                :chips="groupMode"
                :deletable-chips="groupMode"
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
  import { http } from '../../plugins/http';

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
        show: false,
        groupMode: false
      };
    },
    computed: {
      memberSelectLabel() {
        if (this.groupMode) return 'Select group members';
        else return 'Select another member';
      }
    },
    methods: {
      save() {
        if (!this.groupMode) {
          let name = '';
          this.members.forEach(member => {
            name += member;
          });
          this.groupName = name;
        }
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
        this.clearFields();
      },
      cancel() {
        this.clearFields();
      },
      getUsers() {
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
      },
      clearFields() {
        this.show = false;
        this.groupName = '';
        this.groupDescription = '';
        this.firstMessage = '';
        this.members = null;
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
        } else {
          this.getUsers();
        }
      },
      // eslint-disable-next-line no-unused-vars
      groupMode(newMode, oldMode) {
        if (newMode === false) this.members = null;
      }
    },
    created() {
      this.getUsers();
    }
  };
</script>

<style>
  .container-center {
    z-index: 20 !important;
  }
</style>
