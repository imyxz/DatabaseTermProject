import Vue from 'vue'
export default () => {
  Vue.use({
    install:(_vue, options) => {
      _vue.prototype.$eventbus = new Vue({
        name: 'GlobalEventBus',
        data() {
          return {
          }
        },
        created() {
        },
        computed: {
        }
      })
    }
  })
}
