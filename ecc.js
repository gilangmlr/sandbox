function gcd(a, b) {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
}

function mod(x, y) {
  return x - y * Math.floor(x / y);
}

function modDivision(x, y, m) {
  // console.log("modDivision", arguments);
  if (!y) return Infinity;
  const gcdXY = Math.abs(gcd(x, y));
  x /= gcdXY;
  y /= gcdXY;
  p = mod(x, m);
  yInvCounter = 1;
  while (mod(y * yInvCounter, m) !== p) {
    yInvCounter++;
  }
  const res = mod(yInvCounter, m)
  // console.log("modDivision returns", res);
  return res;
}

function eccLambda({ P, Q, p, a }) {
  // console.log("eccLambda", arguments);
  let res;
  if (P[0] !== Q[0] || P[1] !== Q[1]) {
    res = modDivision(Q[1] - P[1], Q[0] - P[0], p);
  } else {
    res = modDivision(mod(3 * Math.pow(P[0], 2) + a, p), mod(2 * P[1], p), p);
  }
  // console.log("eccLambda returns", res);
  return res;
}

function eccAdd({ P, Q, p, a }) {
  // console.log("eccAdd", arguments);
  const lambda = eccLambda({ P, Q, p, a });
  const R = [];
  R.push(mod(Math.pow(lambda, 2) - P[0] - Q[0], p));
  R.push(mod(lambda * (P[0] - R[0]) - P[1], p));
  const res = R;
  // console.log("eccAdd returns", res);
  return res;
}

function eccAddInv({ P, p, a }) {
  return eccAdd({ P, Q: [P[0], -P[1]], p, a });
}

function eccMultConst({ n, G, p, a }) {
  if (n === 1) return G;
  R = G;
  console.log("n:", 1, "nG:", R);
  for (let i = 0; i < n - 1; i++) {
    R = eccAdd({ P: R, Q: G, p, a });
    console.log("n:", i + 2, "nG:", R);
    // if (R[0] === 7 && R[1] === 8) break;
  }
  return R;
}

function numOne({ a, b, p }) {
  console.log("======== numOne ========");
  const points = [
    [2, 2],
    [2, 9],
    [3, 1],
    [3, 10],
    [4, 4],
    [4, 7],
    [5, 0],
    [6, 5],
    [6, 6],
    [7, 3],
    [7, 8],
  ];

  const rows = [];
  for (let i = 0; i < points.length; i++) {
    const row = [];
    for (let j = 0; j < points.length; j++) {
      row.push(eccAdd({ P: points[i], Q: points[j], a, b, p }));
    }
    rows.push(row);
  }
  console.log("x,x ", points.join(" "));
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    console.log(points[i] + "", row.join(" "));
  }
}

function numTwo({ a, b, p }) {
  console.log("======== numTwo ========");
  const G = [4, 4];
  const n = 15;
  eccMultConst({ n, G, p, a });
}

function numThree({ a, b, p }) {
  console.log("======== numThree ========");
  const G = [2, 1];
  const n = 4;
  eccMultConst({ n, G, p, a });
  console.log(eccAdd({ P: [5, 0], Q: [0, 2], p, a }))
  console.log(eccMultConst({ n: 5, G: [2, 2], p, a }));
}

(function main() {
  const a = 0,
    b = 7,
    p = 11;
  numOne({ a, b, p });
  numTwo({ a, b, p });
  numThree({ a, b, p });
})();
