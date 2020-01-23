function analyzer(data) {
  const sumNCount = data.reduce(averageReducer, {
    overall: [0,0],
    service: [0,0],
    price: [0,0],
    product: [0,0],
    share: [0,0]
  });
  for (prop in sumNCount) {
    const [sum, count] = sumNCount[prop];
    if (count > 0) {
      sumNCount[prop] = [sum / count, count];
    };
  }
  const comments = data.reduce((acc, cur) => {
    if (cur.quote) {
      acc.push(cur.quote);
    };
    return acc;
  }, []);
  return { comments, stats: sumNCount };
}

function averageReducer(acc, current) {
  ['overall', 'service', 'price', 'product', 'share'].forEach((prop) => {
    if (current[prop]) {
      acc[prop][0] += Number(current[prop]);
      acc[prop][1]++;
    }
  })
  return acc;
}

module.exports = analyzer;
