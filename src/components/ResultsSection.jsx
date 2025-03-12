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
  Legend,
  BarController,
  LineController
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  LineController,
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
    // Parse input values, defaulting to 0 if invalid
    const duration = parseInt(leasing.leasingDuration) || 0;
    const oneTime = parseFloat(leasing.oneTimePayment) || 0;
    const monthly = parseFloat(leasing.monthlyCost) || 0;
    const included = parseInt(leasing.includedKm) || 0;
    const extraCost = parseFloat(leasing.extraKmCost) || 0;
    const officeKm = parseFloat(leasing.officeKm) || 0;
    const officeDays = parseInt(leasing.officeDays) || 0;
    const taxOfficeDays = parseInt(leasing.taxOfficeDays) || 0;
    const fixedKm = parseInt(leasing.fixedKmPerYear) || 0;
    const taxReturn = parseFloat(leasing.taxReturn) || 0;
    const energyConsumption = parseFloat(leasing.energyConsumption) || 0;
    const energyCost = parseFloat(leasing.energyCost) || 0;
    const insuranceCost = parseFloat(leasing.insuranceCostPerYear) || 0;
    const startMonth = parseInt(leasing.startMonth) || 1;
    const startYear = parseInt(leasing.startYear) || new Date().getFullYear();
    
    // Prevent division by zero
    if (duration === 0) {
      return {
        duration: 0,
        totalKmPerYear: 0,
        totalKmLeasingPeriod: 0,
        includedKmLeasingPeriod: 0,
        extraKm: 0,
        extraKmCost: 0,
        taxOfficeKmPerYear: 0,
        taxReturnPerYear: 0,
        totalTaxReturn: 0,
        energyCostPerKm: 0,
        totalEnergyCost: 0,
        totalInsuranceCost: 0,
        leasingCost: 0,
        totalCostBeforeTax: 0,
        totalCostAfterTax: 0,
        monthlyCostBeforeTax: 0,
        monthlyCostAfterTax: 0,
        costPerKmBeforeTax: 0,
        costPerKmAfterTax: 0,
        monthlyBreakdown: []
      };
    }
    
    // Calculate total kilometers
    const officeKmPerYear = officeKm * officeDays * 2; // Round trip to office
    const totalKmPerYear = fixedKm + officeKmPerYear; // Private usage + office commute
    const durationInYears = duration / 12;
    const totalKmLeasingPeriod = totalKmPerYear * durationInYears;
    
    // Calculate extra kilometers
    const includedKmLeasingPeriod = included * durationInYears;
    const extraKm = Math.max(0, totalKmLeasingPeriod - includedKmLeasingPeriod);
    const extraKmCost = extraKm * extraCost;
    
    // Calculate tax return
    const taxOfficeKmPerYear = officeKm * taxOfficeDays * 2; // Round trip for tax purposes
    const taxReturnPerYear = taxOfficeKmPerYear * taxReturn;
    const totalTaxReturn = taxReturnPerYear * durationInYears;
    
    // Calculate energy costs
    const energyConsumptionPerKm = energyConsumption / 100;
    const energyCostPerKm = energyConsumptionPerKm * energyCost;
    const totalEnergyCost = totalKmLeasingPeriod * energyCostPerKm;
    
    // Calculate insurance costs for the leasing period
    // This will be calculated month by month in the breakdown
    let calculatedTotalInsuranceCost = 0;
    
    // Calculate total costs (without insurance for now)
    const leasingCost = oneTime + (monthly * duration);
    
    // Calculate monthly breakdown with actual dates (including one month after leasing ends)
    const monthlyBreakdown = [];
    let cumulativeCost = 0;
    
    // Calculate one month after leasing ends for chart display
    const chartDuration = duration + 1;
    
    // Calculate end date of leasing
    const endMonth = ((startMonth - 1) + duration) % 12 + 1;
    const endYear = startYear + Math.floor(((startMonth - 1) + duration) / 12);
    
    for (let month = 1; month <= chartDuration; month++) {
      // Calculate actual month and year
      let currentMonth = ((startMonth - 1) + month - 1) % 12 + 1;
      let currentYear = startYear + Math.floor(((startMonth - 1) + month - 1) / 12);
      
      // Monthly leasing cost (only during leasing period)
      const monthlyLeasingCost = month <= duration ? monthly : 0;
      
      // One-time payment (only in first month)
      const oneTimePayment = month === 1 ? oneTime : 0;
      
      // Insurance cost calculation
      let monthlyInsuranceCost = 0;
      
      if (month === 1) {
        // First month: pay proportionate insurance for remaining months of the year
        const remainingMonthsInYear = 13 - startMonth;
        monthlyInsuranceCost = (insuranceCost / 12) * remainingMonthsInYear;
      } else if (currentMonth === 1 && month <= duration) {
        // January of subsequent years (during leasing): pay full annual insurance
        // Check if this is the last year of leasing
        const isLastYear = currentYear === endYear;
        
        if (isLastYear) {
          // In the last year, only pay for months the leasing runs
          const monthsInLastYear = endMonth;
          monthlyInsuranceCost = (insuranceCost / 12) * monthsInLastYear;
        } else {
          // Not the last year, pay full annual insurance
          monthlyInsuranceCost = insuranceCost;
        }
      }
      
      // Add to total insurance cost
      if (month <= duration) {
        calculatedTotalInsuranceCost += monthlyInsuranceCost;
      }
      
      // Tax return (received every March)
      const monthlyTaxReturn = currentMonth === 3 && month <= duration ? taxReturnPerYear : 0;
      
      // Energy cost (distributed evenly, only during leasing period)
      const monthlyEnergyKm = month <= duration ? totalKmPerYear / 12 : 0;
      const monthlyEnergyCost = monthlyEnergyKm * energyCostPerKm;
      
      // Extra km cost (calculated at the end of each year or at the end of leasing)
      let monthlyExtraKmCost = 0;
      
      if ((currentMonth === 12 && month <= duration) || month === duration) {
        // Calculate extra km for the current year or partial year
        const yearFraction = month === duration ? (((startMonth - 1) + duration - 1) % 12 + 1) / 12 : 1;
        const yearlyKm = totalKmPerYear * yearFraction;
        const includedYearlyKm = included * yearFraction;
        const extraYearlyKm = Math.max(0, yearlyKm - includedYearlyKm);
        monthlyExtraKmCost = extraYearlyKm * extraCost;
      }
      
      // Total monthly cost
      const monthlyCost = monthlyLeasingCost + oneTimePayment + monthlyInsuranceCost + monthlyEnergyCost + monthlyExtraKmCost - monthlyTaxReturn;
      
      // Update cumulative cost
      cumulativeCost += monthlyCost;
      
      // Format the date label
      const dateLabel = `${currentMonth}/${currentYear}`;
      
      monthlyBreakdown.push({
        month,
        currentMonth,
        currentYear,
        dateLabel,
        leasingCost: monthlyLeasingCost,
        oneTimePayment,
        insuranceCost: monthlyInsuranceCost,
        energyCost: monthlyEnergyCost,
        extraKmCost: monthlyExtraKmCost,
        taxReturn: monthlyTaxReturn,
        totalCost: monthlyCost,
        cumulativeCost,
        isAfterLeasing: month > duration
      });
    }
    
    // Update total costs with calculated insurance
    const totalInsuranceCost = calculatedTotalInsuranceCost;
    const totalCostBeforeTax = leasingCost + extraKmCost + totalEnergyCost + totalInsuranceCost;
    const totalCostAfterTax = totalCostBeforeTax - totalTaxReturn;
    
    // Calculate monthly costs
    const monthlyCostBeforeTax = totalCostBeforeTax / duration;
    const monthlyCostAfterTax = totalCostAfterTax / duration;
    
    // Calculate cost per kilometer (prevent division by zero)
    const costPerKmBeforeTax = totalKmLeasingPeriod > 0 ? totalCostBeforeTax / totalKmLeasingPeriod : 0;
    const costPerKmAfterTax = totalKmLeasingPeriod > 0 ? totalCostAfterTax / totalKmLeasingPeriod : 0;
    
    return {
      duration,
      totalKmPerYear,
      totalKmLeasingPeriod,
      includedKmLeasingPeriod,
      extraKm,
      extraKmCost,
      taxOfficeKmPerYear,
      taxReturnPerYear,
      totalTaxReturn,
      energyCostPerKm,
      totalEnergyCost,
      totalInsuranceCost,
      leasingCost,
      totalCostBeforeTax,
      totalCostAfterTax,
      monthlyCostBeforeTax,
      monthlyCostAfterTax,
      costPerKmBeforeTax,
      costPerKmAfterTax,
      monthlyBreakdown
    };
  };
  
  const costs = calculateCosts();
  
  // Prepare chart data for cost breakdown (without the total)
  const costBreakdownData = {
    labels: ['Leasing', 'Extra KM', 'Energie', 'Versicherung', 'Steuerrückerstattung'],
    datasets: [
      {
        type: 'bar',
        label: 'Kosten (€)',
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
        data: [
          Math.max(0, costs.leasingCost),
          Math.max(0, costs.extraKmCost),
          Math.max(0, costs.totalEnergyCost),
          Math.max(0, costs.totalInsuranceCost),
          -Math.max(0, costs.totalTaxReturn)
        ],
      }
    ]
  };
  
  // Prepare chart data for monthly costs
  const monthlyLabels = costs.monthlyBreakdown.map(item => item.dateLabel);
  
  // Create a chart for monthly costs
  const monthlyCostsData = {
    labels: monthlyLabels,
    datasets: [
      {
        type: 'bar',
        label: 'Leasing',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        stack: 'stack0',
        data: costs.monthlyBreakdown.map(item => item.leasingCost + item.oneTimePayment)
      },
      {
        type: 'bar',
        label: 'Versicherung',
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        stack: 'stack0',
        data: costs.monthlyBreakdown.map(item => item.insuranceCost)
      },
      {
        type: 'bar',
        label: 'Energie',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        stack: 'stack0',
        data: costs.monthlyBreakdown.map(item => item.energyCost)
      },
      {
        type: 'bar',
        label: 'Extra KM',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        stack: 'stack0',
        data: costs.monthlyBreakdown.map(item => item.extraKmCost)
      },
      {
        type: 'bar',
        label: 'Steuerrückerstattung',
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        stack: 'stack0',
        data: costs.monthlyBreakdown.map(item => -item.taxReturn)
      }
    ]
  };
  
  // Create a separate chart for cumulative costs
  const cumulativeCostsData = {
    labels: monthlyLabels,
    datasets: [
      {
        type: 'line',
        label: 'Kumulative Kosten',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 2,
        pointRadius: 3,
        fill: true,
        tension: 0.1,
        data: costs.monthlyBreakdown.map(item => item.cumulativeCost)
      }
    ]
  };
  
  const costBreakdownOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return formatCurrency(context.parsed.y);
          }
        }
      },
      title: {
        display: false,
        text: `Gesamtkosten: ${formatCurrency(costs.totalCostAfterTax)}`
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };
  
  const monthlyCostsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      },
      title: {
        display: false,
        text: 'Monatliche Kosten'
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          autoSkip: true,
          maxRotation: 90,
          minRotation: 0
        }
      },
      y: {
        stacked: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };
  
  const cumulativeCostsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      },
      title: {
        display: false,
        text: 'Kumulative Kosten'
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Zusammenfassung</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Leasingdauer:</span>
              <span className="font-medium text-gray-900 dark:text-white">{costs.duration} Monate</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Kilometer pro Jahr:</span>
              <span className="font-medium text-gray-900 dark:text-white">{Math.round(costs.totalKmPerYear).toLocaleString('de-DE')} km</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Gesamtkilometer:</span>
              <span className="font-medium text-gray-900 dark:text-white">{Math.round(costs.totalKmLeasingPeriod).toLocaleString('de-DE')} km</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Inkl. Kilometer:</span>
              <span className="font-medium text-gray-900 dark:text-white">{Math.round(costs.includedKmLeasingPeriod).toLocaleString('de-DE')} km</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Extra Kilometer:</span>
              <span className="font-medium text-gray-900 dark:text-white">{Math.round(costs.extraKm).toLocaleString('de-DE')} km</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Kosten</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Leasingkosten:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costs.leasingCost)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Extra-Kilometer Kosten:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costs.extraKmCost)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Energiekosten:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costs.totalEnergyCost)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Versicherungskosten:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costs.totalInsuranceCost)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Steuerrückerstattung:</span>
              <span className="font-medium text-green-600 dark:text-green-400">-{formatCurrency(costs.totalTaxReturn)}</span>
            </div>
            
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between">
              <span className="font-medium text-gray-800 dark:text-gray-200">Gesamtkosten:</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(costs.totalCostAfterTax)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Kostenverteilung</h3>
        <div className="h-80">
          <Chart type="bar" data={costBreakdownData} options={costBreakdownOptions} />
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monatliche Kosten</h3>
        <div className="h-80">
          <Chart type="bar" data={monthlyCostsData} options={monthlyCostsOptions} />
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Kumulative Kosten</h3>
        <div className="h-80">
          <Chart type="line" data={cumulativeCostsData} options={cumulativeCostsOptions} />
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;