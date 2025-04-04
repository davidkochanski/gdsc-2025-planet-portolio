export function polarToCartesian(rho, theta, phi) {
    const x = rho * Math.sin(phi) * Math.cos(theta);
    const y = rho * Math.sin(phi) * Math.sin(theta);
    const z = rho * Math.cos(phi);

    return [x,y,z];
}

export function randomRange(min, max) {
    return (max - min) * Math.random() + min;
}


export function generatePolarCoords(rhoMin, rhoMax) {
    const theta = randomRange(0, 2*Math.PI);
    // const phi = randomRange(0, Math.PI);

    const phi = Math.acos(randomRange(-1, 1));

    const rho = randomRange(rhoMin, rhoMax);

    return [rho, theta, phi];
}

