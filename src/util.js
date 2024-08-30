function progressBarPrint(progress, total, message = undefined) {
  const barLength = 40; // Length of the progress bar
  const percentage = progress / total;
  const filledLength = Math.round(barLength * percentage);
  const bar = "█".repeat(filledLength) + "-".repeat(barLength - filledLength);
  process.stdout.clearLine(); // Clear the current line
  process.stdout.cursorTo(0); // Move cursor to the start of the line
  process.stdout.write(
    `${message || "Progress"}: [${bar}] ${Math.round(percentage * 100)}%`
  );
}

function progressBarDone() {
  process.stdout.write("\n");
}

async function progressBar(callback) {
  var __init = false;
  var __total = 0;
  var __progress = 0;
  var __message = "Progress";

  function init(_total, message) {
    __init = true;
    __total = _total;
    __message = message;
    progressBarPrint(__progress, __total, __message);
  }

  function tick() {
    if (!__init) {
      console.error("Error: progress bar not set up");
      return;
    }
    __progress += 1;
    progressBarPrint(__progress, __total, __message);
  }

  function cleanup() {
    progressBarDone();
  }

  await callback(init, tick, cleanup);
}

module.exports = { progressBar };
