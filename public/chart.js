
document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from the server
    fetch('/barChartData')
        .then(response => response.json())
        .then(chartData => {
            // Create the bar chart
            const ctx = document.getElementById('barChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    indexAxis: 'y',
                    width: 300,
                    height: 1,
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 1,
                        },
                    }],
                    responsive: true,
                    maintainAspectRatio: true
                }
                
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});