<template>
  <div class="hello">
    <a v-if="!loggedIn" href="/login">Log in</a>
    <a v-if="loggedIn" href="/logout">Log out</a>
    <div v-if="!!user">
      <h3>Welcome {{ user.nickname }}!!</h3>
      <h3>Email: {{ user.emails[0].value }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data: () => ({
    loggedIn: false,
    user: null,
  }),
  async mounted() {
    await this.session();
  },
  methods: {
    async session() {
      const response = await axios.get("/session");
      this.loggedIn = response.data.loggedIn;
      this.user = response.data.user;
    },

  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
