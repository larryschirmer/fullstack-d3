import React from 'react';

import BarChart from 'BarChart';

import { processBounds } from 'core/d3Helpers';

import dataset from './hourlyWeather.json';

const width = 600;
export const dimensions = processBounds({
  width: width,
  height: width * 0.6,
  margin: {
    top: 30,
    right: 10,
    bottom: 50,
    left: 50,
  },
});

const WeatherHistograms = () => {
  return (
    <div>
      <div>
        <h1>Wind speed</h1>
        <BarChart<'wind_speed'>
          {...{ dataset, dimensions }}
          showMean
          datasetKey="wind_speed"
          title="Histogram looking at the distribution of wind speeds over a 48 hour period"
        />
      </div>
      <div>
        <h1>Dew Point</h1>
        <BarChart<'dew_point'> showMean datasetKey="dew_point" {...{ dataset, dimensions }} />
      </div>
      <div>
        <h1>Humidity</h1>
        <BarChart<'humidity'> showMean datasetKey="humidity" {...{ dataset, dimensions }} />
      </div>
      <div>
        <h1>Clouds</h1>
        <BarChart<'clouds'> showMean datasetKey="clouds" {...{ dataset, dimensions }} />
      </div>
      <div>
        <h1>Wind Direction</h1>
        <BarChart<'wind_deg'> showMean datasetKey="wind_deg" {...{ dataset, dimensions }} />
      </div>
      <div>
        <h1>Temp</h1>
        <BarChart<'temp'> showMean datasetKey="temp" {...{ dataset, dimensions }} />
      </div>
    </div>
  );
};

export default WeatherHistograms;
