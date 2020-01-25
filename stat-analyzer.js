function analyzer(data) {
  const sumNCount = data.reduce(averageReducer, {
    overall: [0, 0],
    service: [0, 0],
    price: [0, 0],
    product: [0, 0],
    share: [0, 0]
  });
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
  ['overall', 'service', 'price', 'product', 'share'].forEach(prop => {
    if (current[prop]) {
      acc[prop][0] += Number(current[prop]);
      acc[prop][1] += 1;
    }
  });
  return acc;
}

module.exports = analyzer;
