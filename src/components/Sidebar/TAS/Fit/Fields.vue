<template>
<v-expansion-panel flat>
  <v-expansion-panel-content :value='!collapse'>
    <div slot='header' class='title'>Axes</div>

    <v-container>
      <v-layout row wrap>

        <v-flex xs12>
          <v-select label='X Axes' :items='getFields' v-model='selectX' hint='Select X Variable'>
          </v-select>

          <v-select label='Y Axes' :items='getFields' v-model='selectY' hint='Select Y Variable'>
          </v-select>
        </v-flex>
        
      </v-layout>
    </v-container>
  </v-expansion-panel-content>
</v-expansion-panel>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Fields',
  props: {
    collapse: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters('TAS/Fit', [
      'getFields',
    ]),
    ...mapState('TAS/Fit', {
      field: state => state.field,
    }),
    selectX: {
      get() {
        return this.field.x;
      },
      set(value) {
        this.setXField(value);
        this.changeFields();
      },
    },
    selectY: {
      get() {
        return this.field.y;
      },
      set(value) {
        this.setYField(value);
        this.changeFields();
      },
    },
  },
  methods: {
    ...mapMutations('TAS/Fit', [
      'setXField',
      'setYField',
      'changeFields',
    ]),
  },
};
</script>

<style lang='scss' scoped>
</style>
