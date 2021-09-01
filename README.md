# Spunk Phantom Utility
Utility tools to help managing your Splunk Phantom instance

Developed by Harrison Dano <harrisondano@gmail.com>

## Ingestion and Playbook Actions Status Checker

File: ingestion-actions-statuses.js

Usage:

1. Login to your Phantom instance
2. Copy and paste this code to the browser's developer console (usually F12)
3. Populate the labels variable with the target label (e.g. "myevents")
4. Set the number of hours ago you want to include in the checking (e.g. 1)
5. Run the script by pressing ENTER

You will get the total events for each label and if there are errors,
it will show each event id with corresponding error message
