import React from 'react';
import Chart from 'react-apexcharts';

import { FiBarChart2, FiChevronDown } from 'react-icons/fi';

import './styles.scss';

export function Timeline({ isTimelineVisible, setIsTimelineVisible }) {
  function setChosenDate(e) {
    console.log(e);
  }

  const options = {
    chart: {
      height: 200,
      type: 'line',
      zoom: {
        enabled: false
      },
      foreColor: '#E1E1E6',
      toolbar: false
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      colors: ['#5A4B81'],
      strokeColors: ['#E1E1E6'],
      onClick: e => setChosenDate(e)
    },
    stroke: {
      curve: 'straight',
      colors: ['#5A4B81']
    },
    title: {
      text: 'Casos',
      align: 'center',
    },
    grid: {
      row: {
        colors: ['transparent'],
      },
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
    }
  };

  const series = [
    {
      name: "Vacinados",
      data: [30, 40, 45, 50, 49, 60, 70, 91]
    }
  ];

  return (
    <>
      <div className={isTimelineVisible ? "timeline-container" : "invisible-timeline"}>
        <div className="toggle-timeline" onClick={() => setIsTimelineVisible(false)}>
          <FiChevronDown />
        </div>
        <Chart
          options={options}
          series={series}
          type="line"
          width="360"
          className="timeline"
        />
      </div >
      <div
        className={isTimelineVisible ? "invisible-toggle" : "visible-toggle"}
        onClick={() => setIsTimelineVisible(true)}
      >
        <FiBarChart2 />
      </div>
    </>
  );
}
