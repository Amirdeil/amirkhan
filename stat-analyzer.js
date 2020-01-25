const shops = require('./shops/shops');

let criteria;

function analyzer(shopid, data) {
  criteria = shops[shopid].map(criterion =>
    criterion.split(' ')[0].toLowerCase()
  );
  const initial = criteria.reduce((acc, criterion) => {
    acc[criterion] = [0, 0];
    return acc;
  }, {});
  const sumNCount = data.reduce(averageReducer, initial);
  // eslint-disable-next-line array-callback-return
  Object.keys(sumNCount).map(criterion => {
    const [sum, count] = sumNCount[criterion];
    if (count > 0) {
      sumNCount[criterion] = [sum / count, count];
    }
  });
  const comments = data.reduce((acc, cur) => {
    if (cur.quote) {
      acc.push(cur.quote);
    }
    return acc;
  }, []);
  return { comments, stats: sumNCount };
}

function averageReducer(acc, current) {
  criteria.forEach(prop => {
    if (current[prop]) {
      acc[prop][0] += Number(current[prop]);
      acc[prop][1] += 1;
    }
  });
  return acc;
}

module.exports = analyzer;
