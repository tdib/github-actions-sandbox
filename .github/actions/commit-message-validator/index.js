const core = require("@actions/core")
const github = require("@actions/github")

async function validateCommitMessages() {
  try {
    // Get inputs from the action.yml file and workflow configuration
    const rawPattern = core.getInput("pattern")
    const errorMessage = core.getInput("error-message")
    const token = core.getInput("github-token")

    const pattern = new RegExp(rawPattern)

    // Get PR context
    const { context } = github
    const pullNumber = context.payload.pull_request?.number
    if (!pullNumber) {
      core.setFailed("This action only runs on pull requests.")
    }

    // Get commits in the PR
    const octokit = github.getOctokit(token)
    const { owner, repo } = context.repo
    const commits = await octokit.rest.pulls.listCommits({
      owner: owner,
      repo: repo,
      pull_number: pullNumber,
    })

    // Validate each commit message
    console.log("Matching commits against:", pattern)
    const invalidMessages = []
    for (const commit of commits.data) {
      const message = commit.commit.message
      if (!pattern.test(message)) {
        invalidMessages.push(message)
      }
    }

    // Report results
    if (invalidMessages.length > 0) {
      core.setFailed(
        [
          errorMessage,
          "Invalid commit messages detected",
          invalidMessages.map((msg) => `"${msg}"`).join("\n")
        ].join("\n")
      )
    } else {
      console.log("Commit message validation successful!")
    }
  } catch (error) {
    core.setFailed(error.message)
    console.error("Error validating commit messages:", error)
  }
}

(async () => {
  await validateCommitMessages()
})()
