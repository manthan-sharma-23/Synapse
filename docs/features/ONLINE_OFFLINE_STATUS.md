# Online/Offline Status

The Online/Offline Status feature tracks and updates user availability and last known activity in real-time. It enhances communication by showing current presence and recent activity.

## Key Components

### 1. Online Status

- **Real-Time Updates**:
  - Users are marked as "online" when they log in and "offline" when they disconnect.
  - The `set-alive` event keeps the status updated while users are active.
  - The `disconnect` event updates the status to "offline."

- **Redis**:
  - Stores current online status for quick retrieval and consistency.

### 2. Last Known Status

- **Last Seen**:
  - Records the time of last activity when users go offline.
  - Updates when users log in or interact, reflecting their most recent activity.

## Process

1. **User Logs In**:
   - Status set to "online" and notified to other users in the same room.
   
2. **User Interaction**:
   - Periodic `set-alive` events maintain the online status.

3. **User Disconnects**:
   - `disconnect` event sets status to "offline" and updates last known activity.

4. **Status Display**:
   - Shows both current online status and last known activity.

## Summary

- **Real-Time Presence**: Shows if users are online or offline.
- **Last Known Status**: Indicates when users were last active.
- **Efficient Management**: Uses Socket.IO and Redis for updates and status retrieval.
