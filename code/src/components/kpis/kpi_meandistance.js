
export default function GetMeanDistance({vehicles}) {
  const vehs = vehicles.features;
  if (vehs.length === 0) {
    return "-";
  } else {
    let lookup = new Set();
    let contador = 0;
    let totalDistance = 0;
    vehs.map(vehicle => {
      const uniquevalue = vehicle.id + '-' + vehicle.date; 
      //console.log(uniquevalue);
      if (!lookup.has(uniquevalue)) {
        lookup.add(uniquevalue);
        totalDistance += vehicle.distance;
        contador += 1;
      }
      return null;
    });

    //console.log("totalDistance=" + totalDistance + "  contador=" + contador);
    return Math.round(totalDistance/contador) + " km";
  }
}
  