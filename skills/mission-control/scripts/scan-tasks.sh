#!/bin/bash
# Mission Control Task Scanner
# Run this periodically (e.g., every 15 minutes via cron or heartbeat)

set -e

API_KEY="${MISSION_CONTROL_API_KEY}"
AGENT_ID="${MISSION_CONTROL_AGENT_ID}"
BASE_URL="${MISSION_CONTROL_URL:-http://localhost:3000}"

if [ -z "$API_KEY" ]; then
  echo "Error: MISSION_CONTROL_API_KEY not set"
  exit 1
fi

if [ -z "$AGENT_ID" ]; then
  echo "Error: MISSION_CONTROL_AGENT_ID not set"
  exit 1
fi

echo "🔍 Scanning Mission Control task board..."

# Get all active tasks
TASKS=$(curl -s "$BASE_URL/api/tasks?status=todo,in_progress" \
  -H "x-api-key: $API_KEY")

# Check if we got valid JSON
if ! echo "$TASKS" | jq -e . >/dev/null 2>&1; then
  echo "Error: Failed to fetch tasks or invalid response"
  exit 1
fi

TASK_COUNT=$(echo "$TASKS" | jq '. | length')

echo "Found $TASK_COUNT active task(s)"

if [ "$TASK_COUNT" -eq 0 ]; then
  echo "No active tasks. All quiet! 🎉"
  exit 0
fi

# Display tasks
echo ""
echo "Active Tasks:"
echo "============="
echo "$TASKS" | jq -r '.[] | "[\(.status)] \(.title) (Priority: \(.priority))"'

echo ""
echo "💡 Tip: Review tasks and add comments if you can help!"
echo "   curl -X POST $BASE_URL/api/tasks/TASK_ID/comments \\"
echo "     -H \"x-api-key: \$MISSION_CONTROL_API_KEY\" \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"content\": \"I can help with this!\"}'"
