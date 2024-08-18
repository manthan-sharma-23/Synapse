# Conferencing

The conferencing feature in Synapse uses an SFU (Selective Forwarding Unit) architecture, facilitated by mediasoup, to manage audio and video calls. This architecture ensures efficient media distribution and simplifies user management within a conference.

## SFU Architecture with mediasoup

### Overview

- **SFU (Selective Forwarding Unit)**: SFU architecture allows for efficient media distribution by selectively forwarding media streams from producers to consumers. This avoids the need for each participant to send media to every other participant directly, reducing bandwidth usage and improving performance.

- **Mediasoup**: A library that supports SFU architecture, handling the complexities of media streaming including multiple streams, various media types, and routing.

### Conference Services

The conferencing functionality is implemented in the server's service file located at:

- [`conferencing-services`](../../server/src/core/services/conferencing-services)

This file contains the logic for managing conferencing sessions, including handling producer and consumer connections, managing transports, and interacting with the mediasoup library.


### Socket Server and Hashmaps

The socket server uses two key hashmaps to manage conferencing sessions:

- **ROOM Hashmap**: This hashmap stores information about each room, including:
  - **Transports**: Communication channels for sending and receiving media.
  - **Peers**: Users participating in the room.
  - **Routers**: Mediasoup components that manage media routing for the room.

  **Functionality**:
  - **Room Check**: The server checks this hashmap to determine if a call is already ongoing. If there are active transports, peers, and routers, it indicates that a call is currently happening.
  - **Start New Call**: If no active call is detected, the server allows a new call to be started and updates the ROOM hashmap accordingly.

- **PEER Hashmap**: This hashmap tracks individual users and their roles in the conference:
  - **Producer**: Users sending media (audio/video) to the room.
  - **Consumer**: Users receiving media from the room.

  **Functionality**:
  - **Role Management**: Tracks whether a user is acting as a producer or consumer and manages their respective media streams.
  - **Transport Handling**: Maintains the communication channels (transports) used by producers and consumers.

### Media Handling

- **Producers**: A producer is a user who sends media streams (audio/video) to the SFU. They handle the encoding and transmission of media. The media is sent via a producer transport.

- **Consumers**: A consumer is a user who receives media streams from the SFU. They subscribe to media streams and handle the decoding and playback of media. The media is received via a consumer transport.

- **Transports**:
  - **Producer Transport**: Used by producers to send media to the SFU.
  - **Consumer Transport**: Used by consumers to receive media from the SFU.

  **Functionality**:
  - **Producer Transport**: Establishes a connection for sending media from the producer to the SFU.
  - **Consumer Transport**: Establishes a connection for receiving media from the SFU to the consumer.

### Media Distribution

1. **Producer Setup**: A user starts a producer transport to send media to the SFU.
2. **Consumer Setup**: Users start consumer transports to receive media from the SFU.
3. **Media Routing**: The SFU forwards media streams from producers to consumers based on their subscriptions and roles.
4. **Room Management**: The ROOM hashmap manages the active state of rooms, ensuring proper media routing and handling for ongoing calls.


## Summary

The SFU architecture with mediasoup enhances the conferencing feature by:
- **Efficiently forwarding media**: Reducing the need for direct media transmission between all participants.
- **Using hashmaps**: Managing room and user states to handle active calls and user roles.
- **Providing clear roles**: Producers send media, consumers receive media, and transports handle communication channels.

This approach ensures a scalable and efficient conferencing experience for users, making it simple to manage and participate in audio and video calls.
