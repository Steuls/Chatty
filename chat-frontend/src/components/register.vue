<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Register</v-toolbar-title>
            <v-spacer />
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn @click="$emit('login')" icon large v-on="on">
                  <v-icon>mdi-lock-open</v-icon>
                </v-btn>
              </template>
              <span>Sign in</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Username"
                name="username"
                :rules="[rules.required, rules.min]"
                type="text"
                v-model="details.username"
              />
              <v-text-field
                label="FirstName"
                name="firstname"
                :rules="[rules.required]"
                type="text"
                v-model="details.firstName"
              />
              <v-text-field
                label="LastName"
                name="lastname"
                :rules="[rules.required]"
                type="text"
                v-model="details.lastName"
              />
              <v-text-field
                :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                id="password"
                label="Password"
                name="password"
                :type="showPwd ? 'text' : 'password'"
                :rules="[rules.complexity, rules.min, rules.required]"
                hint="At least 8 characters, uppercase and a number"
                @click:append="showPwd = !showPwd"
                v-model="details.password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="register" color="primary">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'register',
    data() {
      return {
        // Rules are vuetify specific error checking
        rules: {
          required: value => !!value || 'Required',
          min: v => (!!v && v.length >= 8) || 'Min 8 characters',
          complexity: text =>
            /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
              text
            ) || 'At least 8 characters, uppercase and a number'
        },
        showPwd: false,
        details: {
          username: '',
          lastName: '',
          firstName: '',
          password: ''
        }
      };
    },
    methods: {
      register() {
        this.$store.dispatch('register', this.details);
      }
    }
  };
</script>

<style scoped></style>
