function rand(min, max) {
  return min + Math.random() * (max - min);
}

export function simulateWeather() {
  const temp = Number(rand(24, 36).toFixed(1));
  const rain = Number(rand(0, 35).toFixed(1));
  return { temp, rain, source: "fallback_simulated" };
}

