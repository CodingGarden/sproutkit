import * as Vue from 'vue';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends Vue.VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue.Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
