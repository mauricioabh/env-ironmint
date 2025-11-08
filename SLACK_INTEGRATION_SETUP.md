# Slack Integration Setup Guide

This document provides instructions for setting up Slack integration with this GitHub repository.

## Overview

The Slack integration workflow (`.github/workflows/slack-integration.yml`) enables automatic notifications to a Slack channel for various GitHub events:

- Pull Request events (opened, closed, reopened, edited)
- Pull Request reviews and comments
- Issue events (opened, closed, reopened, edited)
- Issue comments
- Push events to main branches

## Prerequisites

1. A Slack workspace with admin permissions
2. Access to GitHub repository settings (to add secrets)

## Setup Steps

### 1. Create a Slack App

1. Go to [Slack API](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From scratch"
4. Name your app (e.g., "GitHub Notifications for env-ironmint")
5. Select your workspace

### 2. Enable Incoming Webhooks

1. In your Slack app settings, go to "Incoming Webhooks"
2. Toggle "Activate Incoming Webhooks" to **On**
3. Click "Add New Webhook to Workspace"
4. Select the channel where you want notifications
5. Click "Allow"
6. Copy the Webhook URL (it should look like: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX`)

### 3. Add Webhook URL to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Name: `SLACK_WEBHOOK_URL`
5. Value: Paste the webhook URL from step 2
6. Click "Add secret"

### 4. Test the Integration

To test the Slack integration, you can:

1. **Create or update a Pull Request**: Open/edit a PR and check if Slack receives a notification
2. **Create an Issue**: Create a new issue in the repository
3. **Add a comment**: Comment on a PR or issue
4. **Push to main/develop**: Push changes to trigger push notifications

## Workflow Events

The integration currently monitors these events:

### Pull Request Events
- `opened`: When a new PR is created
- `closed`: When a PR is closed or merged
- `reopened`: When a closed PR is reopened
- `edited`: When PR details are edited

### Issue Events
- `opened`: When a new issue is created
- `closed`: When an issue is closed
- `reopened`: When a closed issue is reopened
- `edited`: When issue details are edited

### Comment Events
- `created`: When a comment is added to an issue or PR

### Push Events
- Triggers on pushes to `main` and `develop` branches

## Customization

### Changing Notification Channels

To send notifications to different channels based on event type:

1. Create multiple webhooks in Slack (one per channel)
2. Add multiple secrets to GitHub (e.g., `SLACK_WEBHOOK_PR`, `SLACK_WEBHOOK_ISSUES`)
3. Update the workflow file to use the appropriate webhook for each job

### Modifying Message Format

The notification payload is defined in the workflow file using Slack's Block Kit format. You can customize:

- Message text
- Formatting (bold, italic, links)
- Additional information fields
- Color schemes

Example of adding more fields:
```yaml
"fields": [
  {
    "title": "Status",
    "value": "${{ github.event.pull_request.state }}",
    "short": true
  },
  {
    "title": "Labels",
    "value": "${{ join(github.event.pull_request.labels.*.name, ', ') }}",
    "short": true
  }
]
```

### Adding More Events

To monitor additional events, update the `on:` section in the workflow file:

```yaml
on:
  pull_request_review:
    types: [submitted, edited, dismissed]
  deployment:
    types: [created, completed]
  release:
    types: [published]
```

## Troubleshooting

### No notifications received

1. Verify the `SLACK_WEBHOOK_URL` secret is set correctly
2. Check GitHub Actions logs for errors
3. Ensure the Slack app has proper permissions
4. Verify the webhook URL is still valid in Slack settings

### Webhook URL expired

If you need to regenerate the webhook:
1. Go to your Slack app settings
2. Navigate to "Incoming Webhooks"
3. Delete the old webhook
4. Create a new one
5. Update the GitHub secret with the new URL

### Rate limiting

If you're receiving too many notifications:
1. Reduce the number of events being monitored
2. Add filters to the workflow (e.g., only specific branches)
3. Consider batching notifications

## Security Notes

- Never commit the webhook URL directly to the repository
- Use GitHub Secrets to store sensitive information
- Regularly rotate webhook URLs
- Review Slack app permissions periodically
- Limit webhook access to specific channels

## Additional Resources

- [Slack API Documentation](https://api.slack.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Slack Block Kit Builder](https://app.slack.com/block-kit-builder)
- [slack-github-action Repository](https://github.com/slackapi/slack-github-action)

## Testing This PR

This pull request includes:
- A test markdown file (`test-slack-integration.md`)
- The Slack integration workflow (`.github/workflows/slack-integration.yml`)
- This setup guide

To test:
1. Set up the Slack webhook as described above
2. Merge or close this PR
3. Check your Slack channel for notifications
4. Try creating issues or commenting on PRs

## Rollback Instructions

If you need to disable Slack notifications:

### Temporary Disable
1. Go to `.github/workflows/slack-integration.yml`
2. Comment out the workflow or add `if: false` to the job

### Permanent Removal
1. Delete `.github/workflows/slack-integration.yml`
2. Optionally remove the `SLACK_WEBHOOK_URL` secret from repository settings
3. Deactivate the webhook in Slack app settings
