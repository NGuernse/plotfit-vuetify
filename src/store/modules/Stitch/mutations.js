import _ from 'lodash';
import * as d3 from 'd3';

import updateFilesSelected from '../../shared/mutations/updateFilesSelected';
import updateFilters from '../../shared/mutations/updateFilters';
import { setXScale, setYScale, resetScales } from '../../shared/mutations/scales';
import removePoint from '../../shared/mutations/removePoint';
import setCurrentData from '../../shared/mutations/setCurrentDataSANS1D';

export default {
  updateFilesSelected,
  updateFilters,
  setXScale,
  setYScale,
  resetScales,
  removePoint,
  setCurrentData,
  resetAll(state) {
    /* eslint-disable */
    state.selectedData = [];
    state.plotScale = {
      x: { label: 'x', value: d3.scaleLinear() },
      y: { label: 'y', value: d3.scaleLinear() },
    };
    state.label = {
      x: 'q = x',
      y: 'I(q) = y',
    };
    state.transformations = {
      x: 'x',
      y: 'y',
    };
    state.isZoomBrush = true;
    state.brushes = [];
    state.brushSelections = {};
    state.brushScale = d3.scaleLinear();
    state.stitchedData = [];
    /* eslint-enable */
  },
  toggleZoomBrush(state, value) {
    // eslint-disable-next-line
    state.isZoomBrush = value;
  },
  setBrushes(state, value) {
    // eslint-disable-next-line
    state.brushes = value;
  },
  addNewBrush(state, value) {
    state.brushes.push(value);
  },
  setBrushSelections(state, value) {
    // eslint-disable-next-line
    state.brushSelections = value;
  },
  addBrushSelections(state, value) {
    // eslint-disable-next-line
    state.brushSelections = Object.assign({}, state.brushSelections, value);
  },
  saveBrushSelections(state) {
    // eslint-disable-next-line
    state.savedBrushSelections = _.cloneDeep(state.brushSelections);
  },
  saveBrushes(state) {
    // eslint-disable-next-line
    state.savedBrushes = _.cloneDeep(state.brushes);
  },
  resetBrushes(state) {
    // eslint-disable-next-line
    state.brushes = [];
  },
  resetBrushSelections(state) {
    // eslint-disable-next-line
    state.brushSelections = {};
  },
  setBrushScale(state, value) {
    // eslint-disable-next-line
    state.brushScale = value;
  },
  reconvertBrushSelections(state) {
    // eslint-disable-next-line
    state.brushSelections = _.mapValues(state.brushSelections, (el) => {
      return {
        raw: el.raw,
        converted: el.raw.map(i => state.brushScale.invert(i)),
      };
    });
  },
  setStitchedData(state, value) {
    // eslint-disable-next-line
    state.stitchedData = value;
  },
  resetStitchedData(state) {
    // eslint-disable-next-line
    state.stitchedData = [];
  },
};
