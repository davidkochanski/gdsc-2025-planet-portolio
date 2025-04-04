
export function randomRange(a, b) {
    return Math.random() * (b - a) + a;
}

export function randomSign() {
    return Math.random() > 0.5 ? 1 : -1;
}

export function generateSphericalCoords(rMin, rMax) {
    const rho = randomRange(rMin, rMax);
    const theta = randomRange(0, 2 * Math.PI);
    // const phi = randomRange(0, 1 * Math.PI);

    // https://dornsife.usc.edu/sergey-lototsky/wp-content/uploads/sites/211/2023/06/UniformOnTheSphere.pdf
    const phi = Math.acos(randomRange(0, 1));

    return [rho, theta, phi];
}

export function polarToCartesian(rho, theta, phi) {
    const x = rho * Math.sin(phi) * Math.cos(theta); 
    const y = rho * Math.sin(phi) * Math.sin(theta);
    const z = rho * Math.cos(phi);
    return [x,y,z];
}

