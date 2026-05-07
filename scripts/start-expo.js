/**
 * Fuerza la IP que Expo anuncia en el manifiesto (REACT_NATIVE_PACKAGER_HOSTNAME).
 * En Windows, si Expo cae en 127.0.0.1 o en la IP de un adaptador virtual (Hyper-V, WSL…),
 * Expo Go en Android no puede descargar el bundle (IOException: failed to download remote update).
 *
 * Override manual (PowerShell): $env:REACT_NATIVE_PACKAGER_HOSTNAME="192.168.1.10"; npm start
 */
const { spawn } = require("child_process");
const os = require("os");
const path = require("path");

function isIPv4(net) {
  return net.family === "IPv4" || net.family === 4;
}

const BAD_IFACE =
  /virtual|vethernet|vmware|vbox|wsl|hyper-v|tap-win|zerotier|tailscale|vpn|ppp|npan|teredo|isatap|bluetooth|only\s*host|docker/i;

const GOOD_IFACE = /wi-?fi|wlan|eth|en0|ethernet|802\.11|wireless|local area connection|rede local/i;

function pickLanIPv4() {
  const nets = os.networkInterfaces();
  const rows = [];
  for (const [name, entries] of Object.entries(nets)) {
    if (!entries) continue;
    for (const net of entries) {
      if (!isIPv4(net) || net.internal) continue;
      const address = net.address;
      if (address.startsWith("169.254.")) continue;
      let ifaceScore = 0;
      if (BAD_IFACE.test(name)) ifaceScore -= 800;
      if (GOOD_IFACE.test(name)) ifaceScore += 80;
      rows.push({ address, name, ifaceScore });
    }
  }

  const ipScore = (ip) => {
    if (ip.startsWith("192.168.")) return 300;
    if (ip.startsWith("10.")) return 200;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return 200;
    return 100;
  };

  rows.sort((a, b) => {
    const sa = a.ifaceScore + ipScore(a.address);
    const sb = b.ifaceScore + ipScore(b.address);
    if (sb !== sa) return sb - sa;
    return a.address.localeCompare(b.address);
  });

  return rows[0]?.address ?? null;
}

const existing = process.env.REACT_NATIVE_PACKAGER_HOSTNAME?.trim();
if (existing) {
  console.log(
    `\n[expo] REACT_NATIVE_PACKAGER_HOSTNAME ya definido: ${existing} (no se sobrescribe)\n`
  );
} else {
  const ip = pickLanIPv4();
  if (ip) {
    process.env.REACT_NATIVE_PACKAGER_HOSTNAME = ip;
    console.log(
      `\n[expo] IP para Expo Go / manifiesto: ${ip} (REACT_NATIVE_PACKAGER_HOSTNAME)\n`
    );
  } else {
    console.warn(
      "\n[expo] No se detectó IPv4 en la LAN. Si Expo Go falla al cargar, prueba: npm run start:tunnel\n"
    );
  }
}

const expoCli = require.resolve("expo/bin/cli");
const passArgs = process.argv.slice(2);
const child = spawn(process.execPath, [expoCli, "start", ...passArgs], {
  stdio: "inherit",
  env: { ...process.env },
  cwd: path.join(__dirname, ".."),
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
