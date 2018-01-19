/* Function to Parse 1D Data Files */
import pp from 'papaparse';
import config from '../configs/TAS';

function extractMetadata(data) {
  const m1 = data.match('# col_headers = ');
  const m2 = data.match('# Sum of Counts');
  const dataTable = data.slice(m1.index + 18, m2.index);
  let metadata = data.slice(0, m1.index).concat(data.slice(m2.index));

  // Remove pounds '#'
  metadata = metadata.replace(/#\s/g, '');
  metadata = metadata.split(/\r\n|\r|\n/);
  metadata = metadata.filter(d => d !== '');

  return {
    metadata,
    data: dataTable,
  };
}

export default {
  methods: {
    parseData(data, filename) {
      // First - extract metadata from data table
      const extractedData = extractMetadata(data);

      // Second - parse data
      extractedData.data = pp.parse(extractedData.data, config).data;

      // eslint-disable-next-line
      extractedData.data.forEach(row => row.name = filename);
      extractedData.filename = filename;

      return extractedData;
    },
  },
};