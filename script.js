const form = document.querySelector("#calculator-form");
const resetButton = document.querySelector("#reset");

const inputs = {
  bore: document.querySelector("#bore"),
  stroke: document.querySelector("#stroke"),
  ivc: document.querySelector("#ivc"),
  volume: document.querySelector("#volume"),
};

const outputs = {
  ccMotor: document.querySelector("#cc-motor"),
  strokeIvc: document.querySelector("#stroke-ivc"),
  strokeDcr: document.querySelector("#stroke-dcr"),
  ccDcr: document.querySelector("#cc-dcr"),
  dcr: document.querySelector("#dcr"),
  cr: document.querySelector("#cr"),
  injectorSize: document.querySelector("#injector-size"),
  throttleBody: document.querySelector("#throttle-body"),
  intakeValve: document.querySelector("#intake-valve"),
  exhaustValve: document.querySelector("#exhaust-valve"),
};

function valueOf(input) {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) ? value : null;
}

function round(value, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : "-";
}

function formatRatio(value) {
  return Number.isFinite(value) ? `${value.toFixed(2)} : 1` : "-";
}

function sweptCc(bore, stroke) {
  return (Math.PI * (bore / 2) ** 2 * stroke) / 1000;
}

function roundToStep(value, step) {
  return Math.round(value / step) * step;
}

function formatRange(range, unit) {
  return range ? `${range[0]}-${range[1]} ${unit}` : "-";
}

function injectorRange(cc) {
  if (!Number.isFinite(cc)) {
    return null;
  }

  const center = roundToStep(cc, 20);
  const low = Math.max(0, center - 20);
  const high = center + 20;

  return [low, high];
}

function throttleBodyRange(cc) {
  if (!Number.isFinite(cc)) {
    return null;
  }

  let base;

  if (cc < 125) base = 22;
  else if (cc < 150) base = 24;
  else if (cc < 180) base = 26;
  else if (cc < 220) base = 28;
  else if (cc < 260) base = 30;
  else if (cc < 320) base = 34;
  else if (cc < 400) base = 38;
  else base = 42;

  const low = base + 2;
  return [low, low + 6];
}

function valveSize(bore, multiplier) {
  return Number.isFinite(bore) ? (bore / 2) * multiplier : null;
}

function calculate() {
  const bore = valueOf(inputs.bore);
  const stroke = valueOf(inputs.stroke);
  const ivc = valueOf(inputs.ivc);
  const volume = valueOf(inputs.volume);

  const hasBoreStroke = bore !== null && stroke !== null;
  const ccMotor = hasBoreStroke ? sweptCc(bore, stroke) : null;
  const strokeIvc = stroke !== null && ivc !== null ? (ivc / 180) * stroke : null;
  const strokeDcr = stroke !== null && strokeIvc !== null ? stroke - strokeIvc : null;
  const ccDcr = bore !== null && strokeDcr !== null ? sweptCc(bore, strokeDcr) : null;
  const hasVolume = volume !== null && volume > 0;
  const dcr = ccDcr !== null && hasVolume ? (ccDcr + volume) / volume : null;
  const cr = ccMotor !== null && hasVolume ? (ccMotor + volume) / volume : null;
  const injector = injectorRange(ccMotor);
  const throttleBody = throttleBodyRange(ccMotor);
  const intakeValve = valveSize(bore, 0.765);
  const exhaustValve = valveSize(bore, 0.665);

  outputs.ccMotor.textContent = ccMotor !== null ? `${round(ccMotor)} cc` : "-";
  outputs.strokeIvc.textContent = strokeIvc !== null ? `${round(strokeIvc)} mm` : "-";
  outputs.strokeDcr.textContent = strokeDcr !== null ? `${round(strokeDcr)} mm` : "-";
  outputs.ccDcr.textContent = ccDcr !== null ? `${round(ccDcr)} cc` : "-";
  outputs.dcr.textContent = formatRatio(dcr);
  outputs.cr.textContent = formatRatio(cr);
  outputs.injectorSize.textContent = formatRange(injector, "cc/min");
  outputs.throttleBody.textContent = formatRange(throttleBody, "mm");
  outputs.intakeValve.textContent = intakeValve !== null ? `${round(intakeValve)} mm` : "-";
  outputs.exhaustValve.textContent = exhaustValve !== null ? `${round(exhaustValve)} mm` : "-";
}

form.addEventListener("input", calculate);

resetButton.addEventListener("click", () => {
  form.reset();
  calculate();
  inputs.bore.focus();
});

calculate();
