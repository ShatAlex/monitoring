import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const titleFont = { size: 18, weight: 'bold' };

function DashboardPage({
  chartData, unempData, gdpData, migrationData, giniData, selectedMigrationCountry, setSelectedMigrationCountry, chartOptions, migrationOptions, barOptions, areaOptions, giniOptions, titleFont, protestsDates
}) {
  // Месяцы для русской локализации
  const MONTHS = [
    '', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  // Кастомный tooltip для протестов
  const protestsOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: { display: true, text: 'Численность протестов', font: titleFont },
      tooltip: {
        callbacks: {
          ...((chartOptions.plugins && chartOptions.plugins.tooltip && chartOptions.plugins.tooltip.callbacks) || {}),
          title: (items) => {
            const idx = items[0].dataIndex;
            const raw = chartData.labels[idx];
            let year = '';
            if (protestsDates && protestsDates[idx]) year = protestsDates[idx].split('-')[0];
            const [day, monthNum] = raw.split('.');
            const monthName = MONTHS[parseInt(monthNum, 10)];
            return `${parseInt(day,10)} ${monthName}${year ? ', ' + year : ''}`;
          },
        },
      },
    },
  };
  return (
    <main className="main-content">
      {(chartData && unempData && gdpData && migrationData && giniData) && (
        <div className="charts-container grid-2x2">
          {/* 1. Индекс Gini */}
          <div className="chart-card chart-card-narrow" style={{ gridColumn: '1 / 2', gridRow: '1 / 2' }}>
            <Line data={giniData} options={giniOptions} height={400} />
          </div>
          {/* 2. Миграция */}
          <div className="chart-card chart-card-wide" style={{ gridColumn: '2 / 3', gridRow: '1 / 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, position: 'relative' }}>
              <span style={{ fontWeight: 600, fontSize: '1.1rem', flexGrow: 1, textAlign: 'center' }}>Сальдо миграции, тыс. чел.</span>
              <div style={{ position: 'absolute', right: 0 }}>
                <div className="nav-segment">
                  <button
                    className={selectedMigrationCountry === 'georgia' ? 'active' : ''}
                    onClick={() => setSelectedMigrationCountry('georgia')}
                  >
                    <span className="legend-indicator" style={{ background:'rgba(255,99,132,1)' }} />
                    Грузия
                  </button>
                  <button
                    className={selectedMigrationCountry === 'serbia' ? 'active' : ''}
                    onClick={() => setSelectedMigrationCountry('serbia')}
                  >
                    <span className="legend-indicator" style={{ background:'rgba(54,162,235,1)' }} />
                    Сербия
                  </button>
                </div>
              </div>
            </div>
            <Line
              data={{
                labels: migrationData.labels,
                datasets: [
                  migrationData.datasets[
                    selectedMigrationCountry === 'georgia' ? 0 : 1
                  ],
                ],
              }}
              options={{
                ...migrationOptions,
                plugins: { ...migrationOptions.plugins, title: { display: false } },
                layout: { padding: { left: 10, right: 10, bottom: 32 } },
                interaction: { mode: 'index', intersect: false },
                scales: {
                  ...migrationOptions.scales,
                  x: {
                    ...migrationOptions.scales.x,
                    ticks: {
                      autoSkip: true,
                      maxTicksLimit: 6,
                      padding: 4,
                      maxRotation: 0,
                      minRotation: 0,
                    },
                  },
                },
              }}
              height={370}
            />
          </div>
          {/* 3. ВВП */}
          <div className="chart-card chart-card-narrow" style={{ gridColumn: '1 / 2', gridRow: '2 / 3' }}>
            <Line data={gdpData} options={areaOptions} height={400} />
          </div>
          {/* 4. Безработица */}
          <div className="chart-card chart-card-wide" style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }}>
            <Bar data={unempData} options={barOptions} height={400} />
          </div>
          {/* 5. Численность протестов */}
          <div className="chart-card chart-card-narrow" style={{ gridColumn: '1 / 2', gridRow: '3 / 4' }}>
            <Line
              data={chartData}
              options={protestsOptions}
              height={400}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function IndicatorsPage() {
  return <div style={{padding:'2rem'}}>Показатели (в разработке)</div>;
}
function PracticalPage() {
  return <div style={{padding:'2rem'}}>Практическая значимость (в разработке)</div>;
}

function NavButton({ to, children }) {
  const navigate = useNavigate();
  const isActive = window.location.pathname === to;
  return (
    <button className={`nav-btn${isActive ? ' active' : ''}`} onClick={() => navigate(to)}>{children}</button>
  );
}

export default function App() {
  const [chartData, setChartData] = useState();
  const [unempData, setUnempData] = useState();
  const [gdpData, setGdpData] = useState();
  const [migrationData, setMigrationData] = useState();
  const [giniData, setGiniData] = useState();
  const [selectedMigrationCountry, setSelectedMigrationCountry] = useState('georgia');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [protestsDates, setProtestsDates] = useState([]);

  useEffect(() => {
    const fetchProtests = fetch('http://localhost:8000/api/protests').then((r) => {
      if (!r.ok) throw new Error('protests fetch failed');
      return r.json();
    });

    const fetchUnemp = fetch('http://localhost:8000/api/unemployment').then((r) => {
      if (!r.ok) throw new Error('unemployment fetch failed');
      return r.json();
    });

    const fetchGdp = fetch('http://localhost:8000/api/gdp_ppp').then((r) => {
      if (!r.ok) throw new Error('gdp fetch failed');
      return r.json();
    });

    const fetchMigration = fetch('http://localhost:8000/api/migration').then((r) => {
      if (!r.ok) throw new Error('migration fetch failed');
      return r.json();
    });

    const fetchGini = fetch('http://localhost:8000/api/gini').then((r) => {
      if (!r.ok) throw new Error('gini fetch failed');
      return r.json();
    });

    Promise.all([fetchProtests, fetchUnemp, fetchGdp, fetchMigration, fetchGini])
      .then(([protestsJson, unempJson, gdpJson, migrationJson, giniJson]) => {
        // protests processing
        const labels = protestsJson
          .map((row) => {
            const [year, month, day] = row.date.split('-');
            return `${day}.${month}`;
          })
          .reverse();
        const serbia = protestsJson.map((row) => row.serbia).reverse();
        const georgia = protestsJson.map((row) => row.georgia).reverse();
        // Сохраняем reversed массив дат
        setProtestsDates(protestsJson.map((row) => row.date).reverse());
        setChartData({
          labels,
          datasets: [
            {
              label: 'Сербия',
              data: serbia,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.2,
            },
            {
              label: 'Грузия',
              data: georgia,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.2,
            },
          ],
        });

        // unemployment processing (ascending by period)
        const unempLabels = [...unempJson].reverse().map((row) => row.period);
        const unempGeorgia = [...unempJson].reverse().map((row) => row.georgia);
        const unempSerbia = [...unempJson].reverse().map((row) => row.serbia);

        setUnempData({
          labels: unempLabels,
          datasets: [
            {
              label: 'Грузия',
              data: unempGeorgia,
              backgroundColor: 'rgba(255, 134, 64, 0.5)',
            },
            {
              label: 'Сербия',
              data: unempSerbia,
              backgroundColor: 'rgba(54, 163, 235, 0.48)',
            },
          ],
        });

        // GDP PPP area chart (ascending years)
        const gdpLabels = [...gdpJson].reverse().map((row) => row.year);
        const gdpGeorgia = [...gdpJson].reverse().map((row) => row.georgia);
        const gdpSerbia = [...gdpJson].reverse().map((row) => row.serbia);

        setGdpData({
          labels: gdpLabels,
          datasets: [
            {
              label: 'Грузия',
              data: gdpGeorgia,
              fill: {
                target: 'origin',
              },
              backgroundColor: 'rgba(153, 102, 255, 0.3)',
              borderColor: 'rgba(153, 102, 255, 1)',
              tension: 0.3,
            },
            {
              label: 'Сербия',
              data: gdpSerbia,
              fill: {
                target: 'origin',
              },
              backgroundColor: 'rgba(75, 192, 192, 0.3)',
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.3,
            },
          ],
        });

        

        // migration processing ascending years
        const migLabels = [...migrationJson].reverse().map((row) => row.year);
        const migGeo = [...migrationJson].reverse().map((row) => row.georgia);
        const migSer = [...migrationJson].reverse().map((row) => row.serbia);

        setMigrationData({
          labels: migLabels,
          datasets: [
            {
              label: 'Грузия',
              data: migGeo,
              borderColor: 'rgba(255,99,132,1)',
              backgroundColor: 'rgba(255,99,132,0.2)',
              fill: {
                target: 'origin',
                above: 'rgba(255,99,132,0.2)',
                below: 'rgba(255,99,132,0.2)',
              },
              tension: 0.2,
            },
            {
              label: 'Сербия',
              data: migSer,
              borderColor: 'rgba(54,162,235,1)',
              backgroundColor: 'rgba(54,162,235,0.2)',
              fill: {
                target: 'origin',
                above: 'rgba(54,162,235,0.2)',
                below: 'rgba(54,162,235,0.2)',
              },
              tension: 0.2,
            },
          ],
        });

        // Gini
        const giniLabels = [...giniJson].reverse().map((row) => row.year);
        const giniGeorgia = [...giniJson].reverse().map((row) => row.georgia);
        const giniSerbia = [...giniJson].reverse().map((row) => row.serbia);
        setGiniData({
          labels: giniLabels,
          datasets: [
            {
              label: 'Грузия',
              data: giniGeorgia,
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              tension: 0.2,
            },
            {
              label: 'Сербия',
              data: giniSerbia,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.2,
            },
          ],
        });

        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.title = 'Социальное напряжение в Грузии и Сербии';
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
  };

  // helper to format tick labels
  const barTicks = {
    callback: (value, index, values) => {
      const rawLabel = unempData?.labels?.[index];
      if (!rawLabel) return '';
      const [year, quarter] = rawLabel.split('-');
      switch (quarter) {
        case '1':
          return year; // only year
        case '3':
          return '3Q';
        default:
          return '';
      }
    },
    autoSkip: false,
    maxRotation: 0,
    minRotation: 0,
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Безработица, %',
        font: titleFont,
      },
      tooltip: {
        callbacks: {
          title: (items) => {
            const raw = items[0].label; // period like 2025-1
            const [year, q] = raw.split('-');
            return `Q${q} ${year}`;
          },
          label: (item) => `${item.formattedValue}%`,
        },
      },
    },
    scales: {
      x: {
        ticks: barTicks,
      },
    },
  };

  const areaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'ВВП на душу населения (ППС), тыс. долл.',
        font: titleFont,
      },
      tooltip: {
        callbacks: {
          label: (item) => `${item.formattedValue} тыс. долл.`,
        },
      },
    },
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const migrationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Сальдо миграции, тыс. чел.',
      },
      tooltip: {
        callbacks: {
          label: (item) => `${item.formattedValue} чел.`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const giniOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Индекс Джини',
        font: titleFont,
      },
      tooltip: {
        callbacks: {
          label: (item) => `${item.formattedValue}`,
        },
      },
    },
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <BrowserRouter>
      <header className="header">
        <nav className="nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="logo">Социальное напряжение в Грузии и Сербии</span>
          <div className="nav-buttons">
            <NavButton to="/dashboard">Дашборд</NavButton>
            <NavButton to="/indicators">Показатели</NavButton>
            <NavButton to="/practical">Практическая значимость</NavButton>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage
          chartData={chartData}
          unempData={unempData}
          gdpData={gdpData}
          migrationData={migrationData}
          giniData={giniData}
          selectedMigrationCountry={selectedMigrationCountry}
          setSelectedMigrationCountry={setSelectedMigrationCountry}
          chartOptions={chartOptions}
          migrationOptions={migrationOptions}
          barOptions={barOptions}
          areaOptions={areaOptions}
          giniOptions={giniOptions}
          titleFont={titleFont}
          protestsDates={protestsDates}
        />} />
        <Route path="/indicators" element={<IndicatorsPage />} />
        <Route path="/practical" element={<PracticalPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <footer className="footer">
        <div className="footer-inner">
          <img className="footer-logo" src="/logo1.png" alt="logo1" />
          <span>
            Курсовая работа&nbsp; Группа: КА-20-03&nbsp; Шатурный Александр
          </span>
          <img className="footer-logo" src="/logo2.png" alt="logo2" />
        </div>
      </footer>
    </BrowserRouter>
  );
} 