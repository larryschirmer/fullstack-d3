import React, { useState } from 'react';

import BarChart from 'BarChart';

import { processBounds } from 'core/d3Helpers';

import dataset from './hourlyWeather.json';
import { Wrapper } from './WeatherHistograms.styles';

type DataPoint = keyof typeof dataset[0];

const charts = {
  temp: {
    title: 'Temperature',
    datasetKey: 'temp' as 'temp',
    description: 'Histogram looking at the distribution of temperature over a 48 hour period',
  },
  pressure: {
    title: 'Pressure',
    datasetKey: 'pressure' as 'pressure',
    description: 'Histogram looking at the distribution of pressure over a 48 hour period',
  },
  dew_point: {
    title: 'Dew Point',
    datasetKey: 'dew_point' as 'dew_point',
    description: 'Histogram looking at the distribution of dew point over a 48 hour period',
  },
  clouds: {
    title: 'Clouds',
    datasetKey: 'clouds' as 'clouds',
    description: 'Histogram looking at the distribution of clouds over a 48 hour period',
  },
  wind_speed: {
    title: 'Wind Speed',
    datasetKey: 'wind_speed' as 'wind_speed',
    description: 'Histogram looking at the distribution of wind speeds over a 48 hour period',
  },
  humidity: {
    title: 'Humidity',
    datasetKey: 'humidity' as 'humidity',
    description: 'Histogram looking at the distribution of humidity over a 48 hour period',
  },
};

const WeatherHistograms = () => {
  const [selectedChart, setSelectedChart] = useState<keyof typeof charts>('wind_speed');
  const width = 600;
  const dimensions = processBounds({
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  });

  return (
    <Wrapper>
      <div className="chart">
        <h1>{charts[selectedChart].title}</h1>
        <BarChart<DataPoint>
          {...{ dataset, dimensions }}
          showMean
          datasetKey={charts[selectedChart].datasetKey}
          title="Histogram looking at the distribution of wind speeds over a 48 hour period"
        />
      </div>
      <div className="chart-toggle">
        {Object.values(charts).map(({ title, datasetKey }, i) => (
          <button key={`btn-key-${i}`} onClick={() => setSelectedChart(datasetKey)}>
            {title}
          </button>
        ))}
      </div>
    </Wrapper>
  );
};

export default WeatherHistograms;
