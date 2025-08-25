import { buildDatasets } from "./chartsPlugin";

export const datasets = buildDatasets(data, yKeys, colors, colorMode, {
  chartType: 'line',
  datasetStyle: {
    borderWidth: 3,
    tension: 0.45,
    fill: true,            // เติมสีใต้เส้น
    backgroundOpacity: 0.18,
    pointRadius: 5,
    pointHoverRadius: 8
  }
});