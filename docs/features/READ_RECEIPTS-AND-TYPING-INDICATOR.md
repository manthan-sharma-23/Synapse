# Read Receipts

Read receipts provide feedback on whether messages have been delivered and read. Here’s how the process works in different scenarios:

## 1. User is Online and Viewing the Same Room

- **Process**: When you receive a message in a room you’re currently viewing, your client sends a `read:message` event to the server.
- **Server Action**: The server updates the message status as read and sends a `read:user-message` event back to the sender. This notifies the sender that their message has been read.

## 2. User is Online but Viewing a Different Room

- **Process**: If you’re viewing a different room and then switch to a room with unread messages, your client sends a `read:room` event to the server.
- **Server Action**: The server marks all messages in the new room as read for you and updates the original senders accordingly.

## 3. User is Offline

- **Process**: When you come online or enter a room after being offline, your client sends a `read:room` event for the room you’re in.
- **Server Action**: The server processes this event to mark all messages in the room as read for you, ensuring that messages you missed while offline are updated.

This system helps maintain accurate message status and keeps both senders and recipients informed about read messages.

# Typing Indicator

The typing indicator lets users know when someone is actively typing in a chat room. This feature enhances real-time communication by showing when participants are engaged in typing.

## How It Works

### 1. User Starts Typing

- **Process**: When you start typing in a chat room, your client sends an `event:typing` signal to the server.
- **Server Action**: The server broadcasts this `event:typing` to all other users in the same room. This updates their chat interfaces to show that you are typing.

### 2. User Stops Typing

- **Process**: When you stop typing, the client sends an `event:stop-typing` signal to the server.
- **Server Action**: The server then broadcasts the `event:stop-typing` to all users in the room. This updates their chat interfaces to remove the typing indicator.

### 3. Typing Timeout

- **Process**: If there is a time gap of more than 3 seconds between typing events, the client automatically sends an `event:stop-typing` signal.
- **Server Action**: This ensures that the typing indicator disappears if the user stops typing for more than 3 seconds, even if they don’t manually send the stop typing signal.

## Summary

- **`event:typing`**: Notifies everyone in the room that a user is typing.
- **`event:stop-typing`**: Notifies everyone in the room that a user has stopped typing, either manually or due to inactivity.

This mechanism keeps the chat experience fluid and responsive, providing real-time feedback on user activity in the conversation.
