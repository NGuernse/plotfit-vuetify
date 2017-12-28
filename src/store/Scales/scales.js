import * as d3 from 'd3';

export default {
  x: {
    x: d3.scaleLinear(),
    'x^2': d3.scalePow(),
    'log(x)': d3.scaleLog(),
  },
  y: {
    y: d3.scaleLinear(),
    'y^2': d3.scalePow(),
    'log(y)': d3.scaleLog(),
  },
};
