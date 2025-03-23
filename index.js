const { Octokit } = require('@octokit/rest');
const { GiphyFetch } = require('@giphy/js-fetch-api');
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
      const githubToken = core.getInput('github-token');
      const giphyApiKey = core.getInput('giphy-api-key');
  
      const octokit = new Octokit({ auth: githubToken });
      const giphy = new GiphyFetch(giphyApiKey);
  
      const context = github.context;
      const { owner, repo, number } = context.issue;
      const prComment = await giphy.random({ tag: 'thank you', rating: 'g' });
  
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: number,
        body: `### PR - ${number} \n ### Thank you for the contribution! \n ![Giphy](${prComment.data.images.downsized.url})`,
      });
  
      core.setOutput('comment-url', `${prComment.data.images.downsized.url}`);
      console.log(`Giphy GIF comment added successfully! Comment URL: ${prComment.data.images.downsized.url}`);
    } catch (error) {
      console.error('Error:', error);
      Process.exit(1);
    }
  }
  
  run();
