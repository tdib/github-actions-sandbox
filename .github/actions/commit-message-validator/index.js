const core = require("@actions/core")
const { execSync } = require("child_process")

try {
  // Extract inputs from action
  const rawPattern = core.getInput("pattern")
  const errorMessage = core.getInput("error-message")

  // Convert raw regex pattern to usable string for JavaScript
  const pattern = new RegExp(rawPattern.replace(/\\/g, "\\\\")) // Handle single backslashes

  console.log("Pattern:", pattern)
  console.log("Error Message:", errorMessage)

  // Fetch all commit messages
  const commitMessages = execSync("git log --format=%B", { encoding: "utf-8" })
    .split("\n")
    .filter((msg) => msg.trim() !== "") // Remove empty lines

  console.log("Commit Messages:", commitMessages)

  // Check each commit message
  const invalidMessages = []
  for (const message of commitMessages) {
    if (!pattern.test(message)) {
      invalidMessages.push(message)
    }
  }

  // Report results
  if (invalidMessages.length > 0) {
    console.log("Invalid commit messages detected:")
    invalidMessages.forEach((msg) => console.log(`- ${msg}`))
    core.setFailed(
      `${errorMessage}\n\nInvalid commit messages:\n${invalidMessages.join("\n")}`
    )
  } else {
    console.log("All commit messages are valid!")
  }
} catch (error) {
  core.setFailed(error.message)
  console.error("Error validating commit messages:", error)
}
