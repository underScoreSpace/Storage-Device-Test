let speedChart;
let selectedFileSize = null;
let selectedBufferSize = null;

document.querySelectorAll('.file-size-btn').forEach(button => {
  button.addEventListener('click', function() {
    selectedFileSize = this.dataset.size;
    document.querySelector('.file-size-btn.selected')?.classList.remove('selected');
    this.classList.add('selected');
  });
});

document.querySelectorAll('.buffer-size-btn').forEach(button => {
  button.addEventListener('click', function() {
    selectedBufferSize = this.getAttribute('data-size');
    document.querySelectorAll('.buffer-size-btn').forEach(btn => btn.classList.remove('selected'));
    this.classList.add('selected');
  });
});
document.getElementById('startTestButton').addEventListener('click', function() {
  const directoryPath = document.getElementById('filePath').value;
  const filename = "testfile.bin";
  const filePath = directoryPath.endsWith('/') ? directoryPath + filename : directoryPath + '/' + filename;

  if (!directoryPath || !selectedFileSize || !selectedBufferSize) {
    alert('Please enter all fields');
    return;
  }

  // Clear previous results
  document.getElementById('writeSpeed').innerText = '';
  document.getElementById('writeLatency').innerText = '';
  document.getElementById('readSpeed').innerText = '';
  document.getElementById('readLatency').innerText = '';

  // Show loader
  document.getElementById('loader').style.display = 'block';

  if (speedChart) {
    speedChart.destroy();
  }

  fetch('http://127.0.0.1:5000/run_speed_test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filePath: filePath, dataSize: selectedFileSize, bufferSize: selectedBufferSize })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('writeSpeed').innerText = 'Write Speed: ' + data.writeSpeed + ' MB/s';
      document.getElementById('writeLatency').innerText = 'Write Latency: ' + data.writeLatency + ' ms';
      document.getElementById('readSpeed').innerText = 'Read Speed: ' + data.readSpeed + ' MB/s';
      document.getElementById('readLatency').innerText = 'Read Latency: ' + data.readLatency + ' ms';

      // Update the chart with the new data
      updateChart(data.writeSpeed, data.readSpeed);
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => {
      // Hide loader
      document.getElementById('loader').style.display = 'none';
    });
});

function updateChart(writeSpeed, readSpeed) {
  const ctx = document.getElementById('speedChart').getContext('2d');
  if (speedChart) {
    speedChart.destroy();
  }
  speedChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Write Speed', 'Read Speed'],
      datasets: [{
        label: 'Speed (MB/s)',
        data: [writeSpeed, readSpeed],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
