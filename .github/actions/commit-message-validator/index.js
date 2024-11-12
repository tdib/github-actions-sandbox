const core = require("@actions/core")
const github = require("@actions/github")
const { execSync } = require("child_process")

try {
  // Get inputs
  const pattern = new RegExp(core.getInput("pattern"))
  const errorMessage = core.getInput("error-message")

  // Fetch commit messages
  const commits = execSync("git log --format=%B", { encoding: "utf8" })
    .split("\n")
    .filter(message => message.trim() !== "")

  console.log(`Found ${commits.length} commit messages.`)

  // Validate commit messages
  let invalidMessages = []
  for (const commit of commits) {
    if (!pattern.test(commit)) {
      invalidMessages.push(commit)
    }
  }

  // Report results
  if (invalidMessages.length > 0) {
    core.setFailed(
      `${errorMessage}\n\nInvalid commit messages:\n${invalidMessages.join(
        "\n"
      )}`
    )
  } else {
    console.log("All commit messages adhere to the required format.")
  }
} catch (error) {
  core.setFailed(error.message)
}