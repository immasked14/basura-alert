# Basura Alert

Community-based waste disposal schedule and reminder website (static).

## Purpose
Make garbage disposal schedules easier to access and encourage proper waste disposal.

## Technologies
HTML, CSS, vanilla JavaScript. No backend or build step.

## File structure
- index.html, schedule.html, report.html, about.html
- css/style.css
- js/config.js, js/schedule-core.js, js/main.js, js/schedule.js, js/report.js, js/notifications.js

## Run locally
Open index.html in a browser, or use a simple static server.

## Update community details
Edit js/config.js community fields (placeholders).

## Configure verified schedule
Set verification.status = true and fill schedule days/times/source/verifiedOn.

## DEMO ONLY mode
Open any page with ?demo=1 to test countdown with demo schedule.

## Report storage
Reports saved in localStorage only; demonstration only.

## Notifications
Page-open reminders only; permission requested on button click.

## Limitations
Static site; no background notifications; no official community data by default.

## GitHub Pages
Push to repo, enable Pages on main branch root.