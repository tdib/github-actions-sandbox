const core = require("@actions/core")

try {
  // Get inputs
  const pattern = new RegExp(core.getInput("pattern"))
  console.log("Pattern", pattern)
  const errorMessage = core.getInput("error-message")
  console.log("Error", errorMessage)
} catch (error) {
  core.setFailed(error.message)
  console.log("Something failed", error)
}