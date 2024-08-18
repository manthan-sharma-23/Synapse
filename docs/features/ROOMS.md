# Rooms

## Description
The rooms feature in Synapse facilitates communication between users, whether it's direct messaging between two individuals or group conversations. The schema defines how users interact within different types of rooms, including peer-to-peer chats and group chats.

## Communication Between Two Users

### Peer Chat Creation
- **Room Table**: A peer-to-peer chat room is created when two users start a private conversation. This is represented in the `roomTable` with the `type` set to `"peer"`.
- **User Room Association**:
  - **User-Room Relationship**: Both users are added to the `userRoomTable`, which tracks their membership in the chat room.
  - **Schema**: 
    - **`userRoomTable`**: Contains entries for each user and their associated room, including the `userId`, `roomId`, and `joinedAt` timestamp.

### Messaging in Peer Chats
- **Chats Table**: Messages exchanged in a peer chat are stored in the `chatTable`. Each message entry includes the `roomId` to associate it with the correct chat room.
- **Message Processing**: When a message is sent by one user, it is inserted into the `chatTable`, and the message is broadcasted to the recipient through real-time updates.

## Group Chats

### Group Creation
- **Room Table**: A group chat room is created with the `type` set to `"group"`. This room can have a name and is created by a specific user.
- **Schema**:
  - **`roomTable`**: Defines the group room with a unique `roomId`, `name`, and `createdBy` user.

### Adding Users to a Group
- **User Group Association**:
  - **`userRoomTable`**: Tracks which users are part of the group chat room, with each entry linking a `userId` to a `roomId`.
- **Invites**:
  - **`groupInviteTable`**: Manages group invites, including the `roomId`, `userId` being invited, and the status of the invite (e.g., "pending", "accepted", "rejected").

### Messaging in Groups
- **Chats Table**: Messages within a group are stored in the `chatTable`, similarly to peer chats, but associated with a group `roomId`.
- **Message Processing**: When a message is sent in a group, it is saved in the `chatTable` and broadcasted to all users in the group room.

### Bundling Messages
In group chats, the client-side application performs a process called **bundling** to organize and display messages more effectively. Bundling groups messages based on two key factors: the time gap between messages and the user who sent them.

1. **Time-Based Bundling**
   - **Concept**: Messages are grouped together if they are sent within a short time span from each other. This helps in presenting a continuous conversation flow, avoiding visual clutter from separate messages sent in quick succession.
   - **Implementation**: Messages sent within a predefined time interval are bundled together into a single message block. The time interval can be configured to suit different chat scenarios (e.g., 1 minute, 5 minutes).

2. **User-Based Bundling**
   - **Concept**: Messages from the same user are grouped together. This makes it easier to follow conversations by the same participant without frequent name changes or visual breaks.
   - **Implementation**: Messages from the same user, sent within the bundling time interval, are combined into a single block. This block includes all the messages from that user during the interval, with a single display name and timestamp.

3. **Display and UI**
   - **Message Blocks**: Each bundled message block is displayed with a combined timestamp and sender's name. This provides a cleaner, more cohesive view of the conversation.
   - **Separators**: Bundled messages are separated by visual dividers or time stamps to denote the end of one bundle and the beginning of another, especially when transitioning between different users or significant time gaps.

### Example
If User A sends a message at 10:00 AM, another at 10:01 AM, and User B sends a message at 10:02 AM, followed by another message from User A at 10:05 AM:
- The messages from User A at 10:00 AM and 10:01 AM are bundled together.
- User B’s message at 10:02 AM appears as a separate block.
- The message from User A at 10:05 AM is shown as a new block, separated from the previous bundle.

## Key Tables
- **`roomTable`**: Defines chat rooms, whether peer or group.
- **`userRoomTable`**: Manages user memberships in chat rooms.
- **`chatTable`**: Stores messages sent within rooms.
- **`groupInviteTable`**: Handles invitations to group chats.
- **`chatReadRecieptTable`**: Tracks message read status.

This documentation provides a comprehensive overview of how communication between users is managed, how groups are formed and utilized, and how messages are organized for better readability.
