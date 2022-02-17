import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

import { FiBarChart2, FiChevronDown } from 'react-icons/fi';

import './styles.scss';

export function Timeline({ isTimelineVisible, setIsTimelineVisible, reportType, reports }) {
  const [orderedReports, setOrderedReports] = useState([]);
  const [dates, setDates] = useState([]);
  const [reportsData, setReportsData] = useState([]);

  function handleDates() {
    const datesAux = [];

    for (const report of orderedReports) {
      const formattedDate = new Date(report.data_boletim);
      datesAux.push(formattedDate.toLocaleDateString());
    }
    setDates(datesAux);
  }

  function handleReportsData() {
    const reportsDataAux = [];

    for (const report of orderedReports) {
      switch (reportType) {
        case "Casos":
          reportsDataAux.push(report.confirmados_diarios);
          break;
        case "Óbitos":
          reportsDataAux.push(report.obitos_diarios);
          break;
        case "Vacinados":
          reportsDataAux.push(report.vacinados_diarios);
          break;
        default:
          break;
      }
    }

    setReportsData(reportsDataAux);

  }

  useEffect(() => {
    const reportsAux = reports.sort((a, b) => {
      return new Date(a.data_boletim) - new Date(b.data_boletim)
    });
    setOrderedReports(reportsAux);

    handleDates();
    handleReportsData();
  }, [reportType, reports]);

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
      strokeColors: ['#E1E1E6']
    },
    stroke: {
      curve: 'straight',
      colors: ['#5A4B81']
    },
    title: {
      text: reportType ? reportType : "Sem dados",
      align: 'center',
    },
    grid: {
      row: {
        colors: ['transparent'],
      },
    },
    xaxis: {
      categories: dates
    }
  };

  const series = [
    {
      name: reportType,
      data: reportsData
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
          width="480"
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
