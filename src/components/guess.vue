<template>
  <div class="container">
    <div class="row">
      <div class="col s12 l8 offset-l2 center big-size">
        <form action="" v-if="!submitted">
          <h1>Win a Trip to Hong Kong Disneyland</h1>
          <div class="input-field">
            <i class="material-icons prefix">send</i>
            <input type="text" id="guess" v-model.lazy="guess.guessThing" required>
            <label for="guess">Who is Dorothy?</label>
          </div>

          <div class="input-field">
            <i class="material-icons prefix">email</i>
            <input type="text" id="email" v-model.lazy="guess.email" required>
            <label for="email">Your Email</label>
          </div>

          <div class="input-field center">
            <button class="btn blue" v-on:click.prevent="post">Submit</button>
          </div>
        </form>
        <div v-if="submitted">
          <h3>Thank you for participating</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
    guess: {
      guessThing: "",
      email: ""
    },
    submitted: false
  }
  },
    methods: {
      update: function(guessThing) {
        db.doc('guess/pollresults').get().then((doc) => {
          let data = doc.data();
          if (data == null)
              data = {};
            if (!data.hasOwnProperty(guessThing)) {
              data[guessThing] = 1;
            } else {
              data[guessThing] += 1;
            }
            db.doc('guess/pollresults').set(data);
        })
      },
      post: function () {
        this.update(this.guess.guessThing);
        db.collection('guess').add(
          this.guess
        ).then((data) => {
          // console.log(data);
          this.submitted = true;
        });
      }
    }
  }
</script>

<style scoped>
</style>
