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

  outputs.ccMotor.textContent = ccMotor !== null ? `${round(ccMotor)} cc` : "-";
  outputs.strokeIvc.textContent = strokeIvc !== null ? `${round(strokeIvc)} mm` : "-";
  outputs.strokeDcr.textContent = strokeDcr !== null ? `${round(strokeDcr)} mm` : "-";
  outputs.ccDcr.textContent = ccDcr !== null ? `${round(ccDcr)} cc` : "-";
  outputs.dcr.textContent = formatRatio(dcr);
  outputs.cr.textContent = formatRatio(cr);
}

form.addEventListener("input", calculate);

resetButton.addEventListener("click", () => {
  form.reset();
  calculate();
  inputs.bore.focus();
});

calculate();
