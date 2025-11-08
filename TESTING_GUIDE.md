# Testing Guide for Slack Integration PR

This guide provides step-by-step instructions for testing the Slack integration added in this PR.

## What Was Added

This PR adds the following files:
1. `test-slack-integration.md` - A test markdown file
2. `.github/workflows/slack-integration.yml` - GitHub Actions workflow for Slack notifications
3. `SLACK_INTEGRATION_SETUP.md` - Detailed setup documentation

## Prerequisites for Testing

Before testing, you need to:
1. Have admin access to a Slack workspace
2. Have write access to the GitHub repository
3. Have the ability to add secrets to the repository

## Testing Steps

### Step 1: Set Up Slack Webhook

1. Create a Slack app following the instructions in `SLACK_INTEGRATION_SETUP.md`
2. Get the webhook URL from Slack
3. Add it to GitHub repository secrets as `SLACK_WEBHOOK_URL`:
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `SLACK_WEBHOOK_URL`
   - Value: Your webhook URL

### Step 2: Test PR Events

**Test PR Close:**
- Close this PR without merging
- Check Slack for a "Pull Request closed" notification

**Test PR Reopen:**
- Reopen this PR
- Check Slack for a "Pull Request reopened" notification

**Test PR Merge:**
- Merge this PR
- Check Slack for a "Pull Request closed" notification

### Step 3: Test Comment Events

**Test PR Comment:**
- Add a comment to this PR (e.g., "Testing Slack integration!")
- Check Slack for a "New PR Comment" notification

### Step 4: Test Issue Events (Manual)

Since I cannot create issues programmatically, you'll need to:

**Test Issue Creation:**
- Manually create a new issue in GitHub
- Check Slack for an "Issue opened" notification

**Test Issue Comment:**
- Comment on the issue
- Check Slack for a comment notification

**Test Issue Close:**
- Close the issue
- Check Slack for an "Issue closed" notification

### Step 5: Test Push Events

**Test Push to Main:**
- Merge this PR into main (or develop)
- Check Slack for a "Push to main" notification

## What to Expect in Slack

Each notification should include:
- Event type (PR opened/closed, Issue created, etc.)
- Repository name
- Link to the PR/Issue
- Author username
- Action performed
- For pushes: commit message and compare link

## Rollback Instructions

### If Notifications Are Too Noisy

Edit `.github/workflows/slack-integration.yml` and:
- Remove specific event types from the `on:` section
- Add filters (e.g., only for specific branches)
- Add conditions with `if:` statements

### To Temporarily Disable

Add this to the `notify-slack` job in the workflow:
```yaml
if: false
```

### To Permanently Remove

1. Delete `.github/workflows/slack-integration.yml`
2. Remove the `SLACK_WEBHOOK_URL` secret from repository settings
3. Optionally deactivate the webhook in Slack

## Troubleshooting

### No Notifications Received

1. Check GitHub Actions tab for workflow runs
2. Look for errors in the workflow logs
3. Verify the `SLACK_WEBHOOK_URL` secret is set correctly
4. Ensure the webhook is still active in Slack

### Wrong Channel

- The notification goes to the channel selected when creating the webhook
- To change: create a new webhook for a different channel and update the secret

### Missing Information in Notifications

- Check the workflow file for the payload structure
- Modify the `text` or `blocks` sections to add more fields
- Refer to Slack's Block Kit documentation for formatting

## Success Criteria

The integration is working correctly if:
- [ ] Closing/reopening this PR sends notifications
- [ ] Commenting on this PR sends notifications
- [ ] Creating/closing issues sends notifications
- [ ] Merging to main/develop sends notifications
- [ ] All notifications are properly formatted and readable
- [ ] Links in notifications work correctly

## Additional Notes

- The workflow uses the official Slack GitHub Action (slackapi/slack-github-action)
- Notifications use Slack's Block Kit format for rich formatting
- The workflow is triggered by multiple event types for comprehensive coverage
- All sensitive data (webhook URL) is stored as GitHub secrets

## Support

For issues or questions:
1. Check `SLACK_INTEGRATION_SETUP.md` for detailed setup instructions
2. Review GitHub Actions logs for errors
3. Consult Slack API documentation for webhook issues
4. Check the [slack-github-action repository](https://github.com/slackapi/slack-github-action) for examples

## Clean Up After Testing

Once testing is complete:
1. Decide whether to keep or remove the Slack integration
2. If removing: follow the "Permanently Remove" instructions above
3. Delete `test-slack-integration.md` and this testing guide if no longer needed
4. Keep `SLACK_INTEGRATION_SETUP.md` for future reference
