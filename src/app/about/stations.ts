/** Original reading order; positions and Euler angles are in world pixels/radians. */
export const stations = [
  { id: "division", label: "NEET DIVISION", x: -1050, y: 680, z: -1850, rx: -.24, ry: .38, rz: -.12 },
  { id: "flex", label: "RANKED FLEX", x: 1050, y: -700, z: -3480, rx: .32, ry: -.44, rz: .19 },
  { id: "scrim", label: "SCRIM", x: -1050, y: -1900, z: -5730, rx: -.25, ry: .38, rz: -.15 },
  { id: "events", label: "SUB EVENTS", x: 1050, y: -2900, z: -7860, rx: .22, ry: -.36, rz: .15 },
  { id: "boss", label: "k4sen", x: -1180, y: -3720, z: -10800, rx: -.18, ry: .26, rz: -.09 },
] as const;
export type StationId = typeof stations[number]["id"];
