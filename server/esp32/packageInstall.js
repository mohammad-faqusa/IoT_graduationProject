const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

(async () => {
  try {
    const { stdout, stderr } = await execPromise(
      `mpremote mip install github:mohammad0faqusa/mip-packages/led/package.json`
    );
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (err) {
    console.error("Error:", err);
  }
})();
