let ctx;

function init(data) {
  const props = ['overall', 'service', 'price', 'product', 'share'];
  const averageRating = props.map(prop => data[prop][0]);
  ctx = document.querySelector("#myChart");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: props,
      datasets: [
        {
          label: "# of Votes",
          data: averageRating,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)"
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

fetch('../api/stats')
  .then(res => res.json())
  .then(data => {
    init(data.stats);
    data.comments.map(comment =>
      document.body.insertAdjacentHTML(
        "beforeend",
        `<div class="card m-1"><div class="card-body">${comment}</div></div>`
      )
    );
  })
