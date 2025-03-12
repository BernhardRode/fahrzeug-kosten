import React from 'react';
import { useSelector } from 'react-redux';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ResultsSection = () => {
  const leasing = useSelector((state) => state.leasing);
  
  // Format number as currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Calculate all costs
  const calculateCosts = () => {
    const duration = parseInt(leasing.leasingDuration) || 0;
    const oneTime = parseFloat(leasing.oneTimePayment) || 0;
    const monthly = parseFloat(leasing.monthlyCost) || 0;
    const included = parseInt(leasing.includedKm) || 0;
    const extraCost = parseFloat(leasing.extraKmCost) || 0;
    const office = parseFloat(leasing.officeKm) || 0;
    const days = parseInt(leasing.officeDays) || 0;
    const taxDays = parseInt(leasing.taxOfficeDays) || 0;
    const fixedKmPerYear = parseInt(leasing.fixedKmPerYear) || 0;
    const tax = parseFloat(leasing.taxReturn) || 0;
    const energyConsumption = parseFloat(leasing.energyConsumption) || 0; // kWh per 100km
    const energyCost = parseFloat(leasing.energyCost) || 0; // € per kWh
    const insuranceCostPerYear = parseFloat(leasing.insuranceCostPerYear) || 0; // € per year
    
    // Calculate values
    const totalLeasing = oneTime + (duration * monthly);
    
    // Calculate yearly office kilometers (actual driven)
    const yearlyOfficeKm = office * 2 * days; // round trip * days per year
    
    // Calculate yearly office kilometers (for tax purposes)
    const yearlyTaxOfficeKm = office * 2 * taxDays; // round trip * tax days per year
    
    // Calculate total kilometers over leasing period (including fixed kilometers)
    const totalFixedKm = fixedKmPerYear * (duration / 12);
    const totalOfficeKm = yearlyOfficeKm * (duration / 12) + totalFixedKm;
    const totalTaxOfficeKm = yearlyTaxOfficeKm * (duration / 12); // Fixed km not included for tax
    
    // Calculate energy costs
    // Energy consumption is in kWh per 100km, so we need to convert to kWh per km
    const energyPerKm = energyConsumption / 100;
    const energyCostPerKm = energyPerKm * energyCost;
    const totalOfficeEnergyCost = yearlyOfficeKm * (duration / 12) * energyCostPerKm;
    const totalFixedEnergyCost = totalFixedKm * energyCostPerKm;
    const totalEnergyCost = totalOfficeEnergyCost + totalFixedEnergyCost;
    
    // Calculate insurance costs over the leasing period
    const totalInsuranceCost = insuranceCostPerYear * (duration / 12);
    
    // Calculate extra kilometers on a yearly basis
    const leasingYears = Math.ceil(duration / 12);
    let totalExtraKm = 0;
    let totalExtraKmCosts = 0;
    
    for (let year = 0; year < leasingYears; year++) {
      // Calculate months in this year (12 or remaining months for last year)
      const monthsInYear = Math.min(12, duration - (year * 12));
      
      // Calculate kilometers driven in this year (including fixed km)
      const kmDrivenThisYear = yearlyOfficeKm * (monthsInYear / 12) + fixedKmPerYear * (monthsInYear / 12);
      
      // Calculate included kilometers for this year (prorated for partial years)
      const includedKmThisYear = included * (monthsInYear / 12);
      
      // Calculate extra kilometers for this year
      const extraKmThisYear = Math.max(0, kmDrivenThisYear - includedKmThisYear);
      totalExtraKm += extraKmThisYear;
      
      // Calculate extra kilometer costs for this year
      totalExtraKmCosts += extraKmThisYear * extraCost;
    }
    
    // Calculate tax return
    const taxReturnAmount = totalTaxOfficeKm * tax;
    
    // Calculate effective costs
    const effectiveTotal = totalLeasing + totalExtraKmCosts + totalEnergyCost + totalInsuranceCost - taxReturnAmount;
    const effectiveMonthly = effectiveTotal / duration;

    return {
      totalLeasing,
      extraKmCosts: totalExtraKmCosts,
      taxReturnAmount,
      effectiveTotal,
      effectiveMonthly,
      duration,
      oneTime,
      monthly,
      totalOfficeKm,
      totalTaxOfficeKm,
      totalFixedKm,
      totalIncludedKm: included * (duration / 12),
      extraKm: totalExtraKm,
      yearlyTaxOfficeKm,
      yearlyTaxReturn: yearlyTaxOfficeKm * tax,
      energyCostPerKm,
      totalEnergyCost,
      totalOfficeEnergyCost,
      totalFixedEnergyCost,
      totalInsuranceCost
    };
  };

  const costs = calculateCosts();

  // Create chart data for combined chart
  const createChartData = () => {
    const { duration, oneTime, monthly } = costs;
    
    // Calculate monthly values for chart
    const monthsPerYear = 12;
    const yearlyIncludedKm = parseInt(leasing.includedKm) || 0;
    const yearlyOfficeKm = parseFloat(leasing.officeKm) * 2 * parseInt(leasing.officeDays);
    const monthlyOfficeKm = yearlyOfficeKm / monthsPerYear;
    const monthlyFixedKm = (parseInt(leasing.fixedKmPerYear) || 0) / monthsPerYear;
    const yearlyTaxOfficeKm = parseFloat(leasing.officeKm) * 2 * parseInt(leasing.taxOfficeDays);
    const extraKmCostPerKm = parseFloat(leasing.extraKmCost) || 0;
    const yearlyTaxReturn = (yearlyTaxOfficeKm * parseFloat(leasing.taxReturn)) || 0;
    const monthlyInsuranceCost = (parseFloat(leasing.insuranceCostPerYear) || 0) / monthsPerYear;
    
    // Energy cost calculations
    const energyConsumption = parseFloat(leasing.energyConsumption) || 0; // kWh per 100km
    const energyCost = parseFloat(leasing.energyCost) || 0; // € per kWh
    const energyPerKm = energyConsumption / 100;
    const energyCostPerKm = energyPerKm * energyCost;
    
    // Extend chart to show tax returns after leasing ends
    // We'll show at least 1 year after leasing ends to capture tax returns
    const extraMonthsAfterLeasing = 12;
    const totalMonths = duration + extraMonthsAfterLeasing;
    
    // Create monthly data points
    const months = [];
    const monthlyCosts = []; // Regular monthly payment
    const extraKmCosts = []; // Extra km costs
    const oneTimeCosts = []; // One-time payment
    const taxReturns = []; // Tax returns (negative values for income)
    const workEnergyCosts = []; // Energy costs for work commute
    const privateEnergyCosts = []; // Energy costs for private driving
    const insuranceCosts = []; // Insurance costs
    const effectiveCosts = []; // Cumulative effective costs for line chart
    
    // Track yearly kilometers to properly calculate when extra costs kick in
    let yearTracker = {};
    let cumulativeCost = 0;
    
    // Generate data for each month
    for (let i = 0; i <= totalMonths; i++) {
      // Add month label
      const monthInYear = i % 12;
      const year = Math.floor(i / 12);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
      months.push(`${monthNames[monthInYear]} ${year + 1}`);
      
      // Calculate monthly leasing cost (only during leasing period)
      let monthlyLeasingCost = i > 0 && i <= duration ? monthly : 0;
      
      // One-time payment only in first month
      let oneTimePayment = i === 0 ? oneTime : 0;
      
      // Calculate current year and month within year
      const currentYear = Math.floor(i / 12);
      
      // Initialize year tracker if needed
      if (!yearTracker[currentYear]) {
        yearTracker[currentYear] = {
          kmDriven: 0,
          includedKm: yearlyIncludedKm,
          extraKmCost: 0
        };
      }
      
      // Add this month's kilometers to the yearly total (only during leasing period)
      if (i > 0 && i <= duration) {
        yearTracker[currentYear].kmDriven += monthlyOfficeKm + monthlyFixedKm;
      }
      
      // Calculate extra kilometers for this year (only if we've exceeded the yearly limit)
      let extraKmCostThisMonth = 0;
      if (i <= duration && yearTracker[currentYear].kmDriven > yearTracker[currentYear].includedKm) {
        // Only charge for kilometers that exceed the limit this month
        const kmOverLimitThisMonth = Math.min(
          monthlyOfficeKm + monthlyFixedKm,
          yearTracker[currentYear].kmDriven - Math.max(yearTracker[currentYear].includedKm, yearTracker[currentYear].kmDriven - (monthlyOfficeKm + monthlyFixedKm))
        );
        extraKmCostThisMonth = kmOverLimitThisMonth * extraKmCostPerKm;
      }
      
      // Calculate energy costs for this month (only during leasing period)
      let workEnergyCostThisMonth = 0;
      let privateEnergyCostThisMonth = 0;
      if (i > 0 && i <= duration) {
        workEnergyCostThisMonth = monthlyOfficeKm * energyCostPerKm;
        privateEnergyCostThisMonth = monthlyFixedKm * energyCostPerKm;
      }
      
      // Calculate insurance cost for this month (only during leasing period)
      let insuranceCostThisMonth = 0;
      if (i > 0 && i <= duration) {
        insuranceCostThisMonth = monthlyInsuranceCost;
      }
      
      // Tax returns come in March of the following year
      let taxReturnThisMonth = 0;
      if (monthInYear === 2) { // March (0-indexed, so 2 is March)
        // Tax return for previous year (if there was leasing activity)
        if (currentYear > 0 && currentYear - 1 < Math.ceil(duration / 12)) {
          // Calculate how many months of the previous year were part of the leasing
          const leasingMonthsLastYear = Math.min(12, Math.max(0, duration - (currentYear - 1) * 12));
          // Prorate the tax return based on actual leasing months
          taxReturnThisMonth = yearlyTaxReturn * (leasingMonthsLastYear / 12);
        }
      }
      
      // Calculate this month's net cost
      const thisMonthCost = oneTimePayment + monthlyLeasingCost + extraKmCostThisMonth + 
                           workEnergyCostThisMonth + privateEnergyCostThisMonth + 
                           insuranceCostThisMonth - taxReturnThisMonth;
      cumulativeCost += thisMonthCost;
      
      // Add to arrays
      monthlyCosts.push(monthlyLeasingCost);
      oneTimeCosts.push(oneTimePayment);
      extraKmCosts.push(extraKmCostThisMonth);
      workEnergyCosts.push(workEnergyCostThisMonth);
      privateEnergyCosts.push(privateEnergyCostThisMonth);
      insuranceCosts.push(insuranceCostThisMonth);
      taxReturns.push(-taxReturnThisMonth); // Negative because it's income
      effectiveCosts.push(cumulativeCost);
    }

    return {
      labels: months,
      datasets: [
        {
          label: 'Einmalige Anzahlung',
          data: oneTimeCosts,
          backgroundColor: 'rgba(153, 102, 255, 0.7)',
          stack: 'stack0',
          type: 'bar'
        },
        {
          label: 'Monatliche Rate',
          data: monthlyCosts,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          stack: 'stack0',
          type: 'bar'
        },
        {
          label: 'Mehrkilometer-Kosten',
          data: extraKmCosts,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          stack: 'stack0',
          type: 'bar'
        },
        {
          label: 'Energiekosten (Arbeit)',
          data: workEnergyCosts,
          backgroundColor: 'rgba(255, 205, 86, 0.7)',
          stack: 'stack0',
          type: 'bar'
        },
        {
          label: 'Energiekosten (Privat)',
          data: privateEnergyCosts,
          backgroundColor: 'rgba(255, 159, 64, 0.7)',
          stack: 'stack0',
          type: 'bar'
        },
        {
          label: 'Versicherungskosten',
          data: insuranceCosts,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          stack: 'stack0',
          type: 'bar'
        },
        {
          label: 'Steuerrückerstattung',
          data: taxReturns,
          backgroundColor: 'rgba(201, 203, 207, 0.7)',
          stack: 'stack0',
          type: 'bar'
        },
        {
          label: 'Kumulative Effektive Kosten',
          data: effectiveCosts,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.1)',
          borderWidth: 2,
          tension: 0.1,
          fill: false,
          type: 'line',
          yAxisID: 'y1'
        }
      ]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Monat'
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Monatliche Kosten (€)'
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Kumulative Kosten (€)'
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        },
        grid: {
          drawOnChartArea: false
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          },
          footer: function(tooltipItems) {
            // Only calculate sum for bar items
            let barItems = tooltipItems.filter(item => item.datasetIndex < 4);
            if (barItems.length > 0) {
              let sum = 0;
              barItems.forEach(function(tooltipItem) {
                sum += tooltipItem.parsed.y;
              });
              return 'Monatlich Gesamt: ' + formatCurrency(sum);
            }
            return '';
          }
        }
      },
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Kosten und Steuerrückerstattungen über Zeit'
      }
    }
  };

  return (
    <div className="results-section">
      <h2>Kostenübersicht</h2>
      
      <div className="summary">
        <div className="summary-item">
          <span>Einmalige Anzahlung:</span>
          <span>{formatCurrency(costs.oneTime)}</span>
        </div>
        <div className="summary-item">
          <span>Gesamtkosten (Leasing):</span>
          <span>{formatCurrency(costs.totalLeasing)}</span>
        </div>
        <div className="summary-item">
          <span>Gefahrene Kilometer:</span>
          <span>{Math.round(costs.totalOfficeKm).toLocaleString('de-DE')} km</span>
        </div>
        <div className="summary-item">
          <span>Davon zusätzliche Kilometer:</span>
          <span>{Math.round(costs.totalFixedKm).toLocaleString('de-DE')} km</span>
        </div>
        <div className="summary-item">
          <span>Kilometer für Steuer:</span>
          <span>{Math.round(costs.totalTaxOfficeKm).toLocaleString('de-DE')} km</span>
        </div>
        <div className="summary-item">
          <span>Inklusive Kilometer:</span>
          <span>{Math.round(costs.totalIncludedKm).toLocaleString('de-DE')} km</span>
        </div>
        <div className="summary-item">
          <span>Mehrkilometer:</span>
          <span>{Math.round(costs.extraKm).toLocaleString('de-DE')} km</span>
        </div>
        <div className="summary-item">
          <span>Mehrkilometer-Kosten:</span>
          <span>{formatCurrency(costs.extraKmCosts)}</span>
        </div>
        <div className="summary-item">
          <span>Energiekosten (Arbeit):</span>
          <span>{formatCurrency(costs.totalOfficeEnergyCost)}</span>
        </div>
        <div className="summary-item">
          <span>Energiekosten (Privat):</span>
          <span>{formatCurrency(costs.totalFixedEnergyCost)}</span>
        </div>
        <div className="summary-item">
          <span>Versicherungskosten:</span>
          <span>{formatCurrency(costs.totalInsuranceCost)}</span>
        </div>
        <div className="summary-item">
          <span>Steuerrückerstattung:</span>
          <span>{formatCurrency(costs.taxReturnAmount)}</span>
        </div>
        <div className="summary-item total">
          <span>Effektive Gesamtkosten:</span>
          <span>{formatCurrency(costs.effectiveTotal)}</span>
        </div>
        <div className="summary-item">
          <span>Effektive monatliche Kosten:</span>
          <span>{formatCurrency(costs.effectiveMonthly)}</span>
        </div>
      </div>
      <div className="chart-container">
        <h3>Kosten und Steuerrückerstattungen</h3>
        <Chart type="bar" data={createChartData()} options={chartOptions} />
      </div>
    </div>
  );
};

export default ResultsSection;