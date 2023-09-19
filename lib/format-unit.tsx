export function formatUnit(number: number, suffix: string = ''): string {
  const unit = number;
  const kilo = unit / 1024;
  const mega = kilo / 1024;
  const giga = mega / 1024;
  const tera = giga / 1024;

  let val: string;

  if (tera >= 1) {
    val = `${tera.toFixed(0)} T`;
  } else if (giga >= 1) {
    val = `${giga.toFixed(0)} G`;
  } else if (mega >= 1) {
    val = `${mega.toFixed(0)} M`;
  } else if (kilo >= 1) {
    val = `${kilo.toFixed(0)} K`;
  } else {
    val = unit.toFixed(0);
  }

  return `${val}${suffix}`;
}
