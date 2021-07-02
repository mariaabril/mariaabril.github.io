
export default function GetMeanSpeed({vehicles}) {
  const vehs = vehicles.features;
  if (vehs.length === 0) {
    return "-";
  } else {
    let lookup = new Set();
    let contador = 0;
    let totalSpeed = 0;
    vehs.map(vehicle => {
      const uniquevalue = vehicle.id + '-' + vehicle.date; 
      if (!lookup.has(uniquevalue)) {
        totalSpeed += vehicle.speed;
        contador += 1;
      }
      return null;
    });
    //console.log("totalSpeed=" + totalSpeed + "  contador=" + contador);
    return Math.round(totalSpeed/contador) + ' km/h';
  }
}