
export default function GetFuelGastado(fuels) {
  const fuel_vehs = fuels.fuels;
  let total_fuel_gastado = 0;
  let distancia_recorrida = 0;

  fuel_vehs.map((fuel_veh) => {
    if (fuel_veh.diff_fuel > 0) {
      total_fuel_gastado += parseFloat(fuel_veh.diff_fuel);
      distancia_recorrida += parseFloat(fuel_veh.distance);
    }
    return null;
  });

  console.log("total_fuel_gastado=" + total_fuel_gastado + "  distancia_recorrida=" + distancia_recorrida);

  if (distancia_recorrida === 0) {
    return "-";
  }
  // distancia esta en mts, lo convertimos a km y hayamos la media por cada 100km
  const mean_gastado = (total_fuel_gastado * 100) / (distancia_recorrida / 1000);
  return Math.round(mean_gastado) + " l/100km";
}
