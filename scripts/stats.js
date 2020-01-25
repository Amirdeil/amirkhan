let ctx;

function init(data) {
  const props = Object.keys(data);
  const averageRating = props.map(prop => data[prop][0]);
  ctx = document.querySelector('#myChart');
  // eslint-disable-next-line no-undef
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: props,
      datasets: [
        {
          label: '# of Votes',
          data: averageRating,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

const shopId = window.location.pathname.split('/').slice(-1);

fetch(`../api/stats/${shopId}`)
  .then(res => res.json())
  .then(data => {
    init(data.stats);
    data.comments.map(comment =>
      document.body.insertAdjacentHTML(
        'beforeend',
        `<div class="card m-1"><div class="card-body">${comment}</div></div>`
      )
    );
  });
