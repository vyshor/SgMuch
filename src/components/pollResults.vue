<template>
  <div class="container">
    <div class="row">
      <div class="col s12 l8 offset-l2 center big-size">
        <div id="myChart">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";
  ZC.LICENSE = ["569d52cefae586f634c54f86dc99e6a9", "ee6b7db5b51705a13dc2339db3edaf6d"];

  export default {
    data() {
      return {
        myConfig: {
          "graphset": [
            {
              "type": "wordcloud",
              "options": {
                "style": {
                  "tooltip": {
                    visible: true,
                    text: '%text: %hits'
                  }
                },
                "words": []
              }
            }
          ]
        }
    }
    },
    methods: {},
    created() {
      db.doc('guess/pollresults').get().then((doc) => {
        let data = doc.data();
        for (let key in data) {
          let toBeAdded = {"text": key, "count": data[key]};
          this.myConfig.graphset[0].options.words.push(toBeAdded);
        }

        zingchart.render({
          id: 'myChart',
          data: this.myConfig,
          height: '100%',
          width: '100%'
        });
      });
    }
  }
</script>

<style scoped>
  #myChart {
    height: 100%;
    width: 100%;
    min-height: 150px;
  }
</style>
