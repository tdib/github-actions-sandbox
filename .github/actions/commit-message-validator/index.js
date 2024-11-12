const core = require("@actions/core")
const github = require("@actions/github")

async function validateCommitMessages() {
  try {
    // Inputs
    const patternInput = core.getInput("pattern")
    const pattern = new RegExp(patternInput)
    const errorMessage = core.getInput("error-message")

    console.log("Pattern:", pattern)
    console.log("Error Message:", errorMessage)

    // Get PR context
    const { context } = github
    const pullNumber = context.payload.pull_request?.number

    if (!pullNumber) {
      core.setFailed("This action only runs on pull requests.")
    }

    // Get commits in the PR
    const octokit = github.getOctokit(core.getInput("github-token"))
    const { owner, repo } = context.repo
    const commits = await octokit.rest.pulls.listCommits({
      owner: owner,
      repo: repo,
      pull_number: pullNumber,
    })

    // Validate each commit message
    const invalidMessages = []
    for (const commit of commits.data) {
      const message = commit.commit.message
      if (!pattern.test(message)) {
        invalidMessages.push(message)
      }
    }

    // Report results
    if (invalidMessages.length > 0) {
      console.log("Invalid commit messages detected:")
      invalidMessages.forEach((msg) => console.log(`- ${msg}`))
      core.setFailed(`${errorMessage}\n\nInvalid commit messages:\n${invalidMessages.join("\n")}`)
    } else {
      console.log("All commit messages are valid!")
    }
  } catch (error) {
    core.setFailed(error.message)
    console.error("Error validating commit messages:", error)
  }
}

(async () => {
  await validateCommitMessages()
})()
