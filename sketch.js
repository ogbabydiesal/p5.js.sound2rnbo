let osc, context, filter

const { createDevice } = RNBO

//semi-standard p5.js setup
async function setup() {
  let cnv = createCanvas(140, 140)
  cnv.mousePressed(startOscillator)
  background(220)
  //get/set the context before creating p5.sound.js objects
  context = getAudioContext()

  //create an oscillator and a filter
  osc = new p5.SawOsc()
  osc.disconnect()
  filter = new p5.Biquad(1000, "bandpass")
  filter.disconnect()
  //pass the context to the RNBO setup function
  await startRNBO(context)
}

async function startRNBO(context) {
  const gainNode = context.createGain()
  gainNode.connect(context.destination)

  let rawPatcher = await fetch("rnbo.filterdelay.json");
  let patcher = await rawPatcher.json();
  let device = await createDevice({ context, patcher });
  // This connects the device to audio output, but you may still need to call context.resume()
  // from a user-initiated function.
  device.node.connect(gainNode);
  osc.connect(filter)
  filter.disconnect()
  filter.connect(device.node)
}

function startOscillator() {
  osc.start()
}

function draw() {
  background(220)
  let freq = map(mouseX, 0, width, 10, 20000)
  let hz = map(mouseY, 0, height, 200, 2000)
  filter.freq(freq)
  osc.freq(hz)
}