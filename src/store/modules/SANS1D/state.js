import * as d3 from 'd3';
import settings from '../../fits/settings';
import fits from '../../fits/SANS1D';
import scales from '../../Scales/scales';

export default {
  ID: 'SANS1D',
  fetched: {},
  uploaded: {},
  saved: {},
  filesSelected: [],
  deleteKeys: [],
  filters: [],
  selectedData: [],
  filteredData: [],
  browseData: [],
  fittedData: [],
  fileToFit: null,
  previousFit: '',
  colorDomain: [],
  scale: {
    x: { ...scales.x },
    y: { ...scales.y },
  },
  plotScale: {
    x: { label: 'x', value: d3.scaleLinear() },
    y: { label: 'y', value: d3.scaleLinear() },
  },
  fitType: 'Linear',
  defaultFitSettings: { ...settings },
  fitSettings: {
    damping: settings.damping.value,
    errorTolerance: settings.errorTolerance.value,
    gradientDifference: settings.gradientDifference.value,
    maxIterations: settings.maxIterations.value,
  },
  fitEquation: undefined,
  fitError: null,
  fitInitialValues: [],
  fitNote: '',
  label: {
    x: 'q = x',
    y: 'I(q) = y',
  },
  transformations: {
    x: 'x',
    y: 'y',
    error: 'error',
  },
  fits: { ...fits },
  field: {
    x: 'x',
    y: 'y',
  },
  selectionLimits: [],
  brushSelection: [],
  brushLimits: [],
  brushFile: undefined,
};
