async function dummy() {
  try {
    await console.log("dummy");
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(dummy, 1 * 60 * 1000);
  }
}

// -----------------------------------------------------------------------------
export default function () {
  console.log("cronjob is started");

  // dont wait for async functions
  // each function has its own cycle
  dummy();
}
