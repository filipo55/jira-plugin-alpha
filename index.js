// File: index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Jira API configuration
const JIRA_BASE_URL = 'https://your-domain.atlassian.net';
const JIRA_API_TOKEN = 'your-api-token';
const JIRA_USER_EMAIL = 'your-email@example.com';

// Function to fetch issue data from Jira
async function getIssueData(issueKey) {
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`, {
      auth: {
        username: JIRA_USER_EMAIL,
        password: JIRA_API_TOKEN
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching issue ${issueKey}:`, error);
    return null;
  }
}

// Function to calculate time in status
function calculateTimeInStatus(issue) {
  // This is a placeholder. You'll need to implement the actual logic
  // based on the issue's history and your specific requirements.
  return {
    issueKey: issue.key,
    timeInStatus: {
      // Example: 'In Progress': 3600000 (milliseconds)
    }
  };
}

// Endpoint to process a set of issues
app.post('/process-issues', async (req, res) => {
  const { issueKeys } = req.body;
  
  if (!issueKeys || !Array.isArray(issueKeys)) {
    return res.status(400).json({ error: 'Invalid input. Please provide an array of issue keys.' });
  }

  const results = [];

  for (const issueKey of issueKeys) {
    const issueData = await getIssueData(issueKey);
    if (issueData) {
      const timeInStatus = calculateTimeInStatus(issueData);
      results.push(timeInStatus);
    }
  }

  res.json({ results });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// File: package.json
{
  "name": "jira-time-in-status-plugin",
  "version": "1.0.0",
  "description": "A Jira Cloud plugin to calculate time in status for issues",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "body-parser": "^1.19.0",
    "axios": "^0.21.1"
  }
}
