<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="heading">Group Name</span>
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
  export default {
    name: 'ChangeGroupName',
    props: ['dialog', 'name', 'groupId'],
    data() {
      return {
        groupName: '',
        show: false
      };
    },
    methods: {
      save() {
        this.$socket.client.emit('changeGroupName', {
          token: this.$store.state.jwtToken.accessToken,
          groupName: this.groupName,
          groupId: this.groupId
        });
        this.show = false;
        this.groupName = '';
      },
      cancel() {
        this.show = false;
        this.groupName = '';
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
          this.groupName = this.name; // set the current group name in the v-model
        }
      }
    },
    created() {
      this.groupName = this.name; // set the current group name in the v-model
    }
  };
</script>

<style scoped>
  .container-center {
    z-index: 20 !important;
  }
</style>
