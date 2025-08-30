import { useLotkaVolterra } from "@/hooks/useLotkaVolterra";
import SimulationControls from "@/components/SimulationControls";
import SimulationChart from "@/components/SimulationChart";
import EquationDisplay from "@/components/EquationDisplay";

const Index = () => {
  const {
    parameters,
    data,
    isRunning,
    currentPopulations,
    currentTime,
    updateParameter,
    toggleSimulation,
    resetSimulation,
  } = useLotkaVolterra();

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="bg-gradient-hero text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Lotka-Volterra Competition Explorer
          </h1>
          <p className="text-lg opacity-90">
            Interactive simulation of species competition dynamics
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Current Status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-6 bg-card px-6 py-3 rounded-lg shadow-card">
            <div className="text-sm">
              <span className="text-muted-foreground">Time:</span>
              <span className="ml-2 font-mono font-medium">{currentTime.toFixed(1)}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Species 1:</span>
              <span className="ml-2 font-mono font-medium text-primary">
                {currentPopulations.N1.toFixed(1)}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Species 2:</span>
              <span className="ml-2 font-mono font-medium text-secondary">
                {currentPopulations.N2.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <SimulationControls
              parameters={parameters}
              onParameterChange={updateParameter}
              isRunning={isRunning}
              onPlayPause={toggleSimulation}
              onReset={resetSimulation}
            />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <SimulationChart data={data} isRunning={isRunning} />
            <EquationDisplay />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-8">
          <SimulationChart data={data} isRunning={isRunning} />
          <SimulationControls
            parameters={parameters}
            onParameterChange={updateParameter}
            isRunning={isRunning}
            onPlayPause={toggleSimulation}
            onReset={resetSimulation}
          />
          <EquationDisplay />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            Educational tool for exploring species competition dynamics through mathematical modeling
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
