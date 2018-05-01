import _ from 'lodash';

export default {
  setCurrentData(state, value) {
    if (value.length === 0) {
      state.selectedData = []; // eslint-disable-line
    } else {
      if (typeof value[0].defaultFields !== 'undefined') {
        state.field = { ...value[0].defaultFields }; // eslint-disable-line
      }

      state.selectedData = _.cloneDeep(value); // eslint-disable-line
    }
  },
  resetAll(state) {
    /* eslint-disable */
    state.selectedData = [];
    state.filesSelected = [];
    /* eslint-enable */
  },
  removePoint(state, payload) {
    const index = payload.index;
    state.selectedData[0].data.splice(index, 1);
  },
  updateFilesSelected(state, payload) {
    state.filesSelected = payload[0]; // eslint-disable-line
  },
};
