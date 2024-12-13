document.addEventListener('DOMContentLoaded', function () {
    const nSlider = document.getElementById('nSlider');
    const nValue = document.getElementById('nValue');

    // Function to calculate the derivative
    function derivative(X, t, n) {
        const H = X[0];
        const P = X[1];
        const G = X[2];

        const k1 = 0.2;
        const k2 = 0.2;
        const k3 = 0.2;

        const dotH = -k1 * H + (1.0 / (1 + Math.pow(G, n)));
        const dotP = H - k2 * P;
        const dotG = P - k3 * G;

        return [dotH, dotP, dotG];
    }

    // Function to run the Euler simulation
    function runEulerSimulation(n, tmax = 300, steps = 1500) {
        const dt = tmax / steps;
        const t = Array.from({ length: steps + 1 }, (_, i) => i * dt);
        const X0 = [0.2, 0.9, 2.0];
        let X = X0;

        let results = {
            H: [],
            P: [],
            G: [],
            t: []
        };

        for (let i = 0; i < t.length; i++) {
            const dX = derivative(X, t[i], n);
            X = X.map((x, idx) => x + dX[idx] * dt);

            results.H.push(X[0]);
            results.P.push(X[1]);
            results.G.push(X[2]);
            results.t.push(t[i]);
        }

        return results;
    }

    // Function to update the plot
    function updatePlot(n) {
        const results = runEulerSimulation(n);

        const data = [
            { x: results.t, y: results.H, mode: 'lines', name: 'Hypothalamus' },
            { x: results.t, y: results.P, mode: 'lines', name: 'Pituitary', line: { dash: 'dash' } },
            { x: results.t, y: results.G, mode: 'lines', name: 'Gonad' }
        ];

        const layout = {
            title: `Oscillation Model (n = ${n})`,
            xaxis: { title: 'Time (t)' },
            yaxis: { title: 'H, P, G Levels' },
            yaxis: { range: [0, 5] },
        };

        Plotly.newPlot('plot', data, layout);
    }

    // Slider input changes 'n' value
    nSlider.addEventListener('input', function () {
        nValue.textContent = nSlider.value;
        updatePlot(nSlider.value);
    });

    // Initial plot
    updatePlot(nSlider.value);
});
