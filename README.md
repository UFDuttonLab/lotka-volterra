# Lotka-Volterra Model Explorer

Interactive teaching tool for the two Lotka-Volterra systems, built and maintained by the [Dutton Lab](https://ufduttonlab.github.io/) at the University of Florida.

Live site: https://ufduttonlab.github.io/lotka-volterra/

## Models

Competition with logistic growth:

```
dN1/dt = r1*N1*(1 - (N1 + a12*N2)/K1)
dN2/dt = r2*N2*(1 - (N2 + a21*N1)/K2)
```

Outcomes follow from two comparisons. Coexistence requires a12 < K1/K2 and a21 < K2/K1. Species 1 excludes species 2 when a12 < K1/K2 and a21 > K2/K1, and species 2 excludes species 1 under the reverse pair. Both coefficients above their thresholds gives founder control, with an interior saddle and two stable axis equilibria. The Jacobian at the interior equilibrium has discriminant (A - D)^2 + 4BC > 0 for positive coefficients, so eigenvalues are real and the approach is never oscillatory.

Predator-prey:

```
dN1/dt =  r1*N1 - a*N1*N2
dN2/dt = -r2*N2 + b*N1*N2
```

The equilibrium is (N1*, N2*) = (r2/b, r1/a). The first integral is

```
H = r2*ln(N1) + r1*ln(N2) - b*N1 - a*N2
```

with dH/dt = 0. Note the pairing: b multiplies N1 and a multiplies N2. H is at a maximum at the equilibrium and decreases outward, so orbits farther from equilibrium have smaller H. Linearising gives eigenvalues +/- i*sqrt(r1*r2), so the period of small oscillations is 2*pi/sqrt(r1*r2) and does not depend on a or b. With N1 on the horizontal axis the flow is counterclockwise, which puts the prey peak a quarter cycle ahead of the predator peak.

## Numerics

Classical fourth-order Runge-Kutta at a fixed step h = 0.01, global error O(h^4). The playback speed control sets how many steps run per 50 ms frame and does not change h, so accuracy is independent of how fast the animation runs. Integration error is reported as |dH| against the initial value; RK4 at this step size holds it near 1e-7 over hundreds of time units.

A population falling below 1e-9 is set to zero, which is an absorbing state for both models.

The chart retains at most 2000 samples. On overflow the series is halved in place, keeping the newest sample, so the full time span stays on screen at progressively coarser resolution.

## Development

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # writes dist/
npm run lint
npx tsc -p tsconfig.app.json --noEmit
```

## Deployment

GitHub Pages serves the `docs/` directory. Vite is configured with `base: "/lotka-volterra/"` in `vite.config.ts`, so the bundle must be built with that base and copied into `docs/`:

```sh
npm run build
rm -rf docs/assets            # stale hashed bundles accumulate otherwise
cp -r dist/* docs/
touch docs/.nojekyll
```

Routing uses `HashRouter`, so deep links work on Pages without a rewrite rule.

## Layout

```
src/hooks/useLotkaVolterra.ts   integrator, model equations, conserved quantity, simulation loop
src/components/                 charts, controls, phase planes, teaching content, exercises
src/pages/Index.tsx             tab layout
src/components/ui/              shadcn-ui primitives
```
