
# commit-message-validator

`commit-message-validator` is a custom action used for checking commit messages within a PR against a regex defined in a calling workflow (yml) file.


## Structure

It is implemented in a single `index.js` (JavaScript) file, and uses the [GitHub Actions Toolkit](https://github.com/actions/toolkit) to interact with GitHub and provide us the necessary functionality such as triggering a failure when it detects an invalid commit message.

## Usage

To use this action, create a step in your workflow that references the action from the `.github/actions/` directory. Since the action is configured to use a Node runtime, the only prerequisite is running the `actions/checkout` action beforehand. This ensures `commit-message-validator` can access your commits.

Three inputs are required for this action to work:
| Input | Description |
| ----- | ----------- |
| `pattern` | Defines the regular expression (regex) to match against for a valid commit message. For example, `[a-z]+` will only allow commit messages with lowercase letters, and no symbols or digits. |
| `error-message` | A string that will be printed to the log when an invalid commit is detected. |
| `github-token` | Your GitHub token. This is required for the action to read your commit history and interact with GitHub. |

### Example
```yml
check-commit-messages:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: Validate Commit Messages
      uses: ./.github/actions/commit-message-validator
      with:
        # Match examples: "ABCD-1234 Commit msg", "[Release] Commit msg", "[QA] Commit msg"
        pattern: '^(([A-Z]+\-\d+)|\[CI\]|\[Release\]|\[QA\]|\[Merge\]|\[Automation\]) .+$'
        error-message: "All commit messages must start with a Jira ticket or a valid prefix."
        github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Updating

To update the script, simply make the required changes to the `index.js` file, and run `ncc build index.js`. This uses [ncc](https://github.com/vercel/ncc) to generate a `dist/index.js` file which bundles all required files and dependencies into a single file to run via Node without installing the required dependencies. Ensure you are in the `commit-message-validator` directory, otherwise the bundled file will not generate in the correct directory. In general, you may use `ncc build <source-file> -o <output-directory>` to generate it from outside this directory.

While it may seem strange to commit a build file like this, it is actually recommended by GitHub themselves in their [JavaScript action documentation](https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action). Some additional reasoning behind this is that the actions runner would otherwise need to install all the node dependencies every time it is run.

For more examples of this practice in the wild, see:
- https://github.com/actions/labeler/tree/main/dist
- https://github.com/actions/setup-java/tree/main/dist
- https://github.com/actions/setup-dotnet/tree/main/dist