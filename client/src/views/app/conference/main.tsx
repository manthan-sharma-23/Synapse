import { memo, useEffect, useRef, useState } from "react";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { FaVideo, FaVideoSlash } from "react-icons/fa6";
import { ImPhoneHangUp } from "react-icons/im";
import { DrawerClose } from "@/components/ui/drawer";
import { MediaKind, RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Device } from "mediasoup-client";
import { Consumer, Producer, Transport } from "mediasoup-client/lib/types";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserSelector } from "@/core/store/selectors/user.selectors";
import {
  ConsumerResult,
  Peer,
  webRtcTransportParams,
  WebSocketEventType,
} from "@/core/lib/types/conference.type";
import { sendRequestToSocket, socket } from "@/socket";
import { mergeData, MergedData } from "@/core/lib/helper/merge";
import Avvvatars from "avvvatars-react";
import { twMerge } from "tailwind-merge";

export interface ProducerContainer {
  producer_id: string;
  userId: string;
}

export interface RemoteStream {
  consumer: Consumer;
  stream: MediaStream;
  kind: MediaKind;
  producerId: string;
}

const ConferenceMain = () => {
  const [isMicOn, setMicOn] = useState(false);
  const [isVideoOn, setVideoOn] = useState(false);
  const [params] = useSearchParams();
  const roomId = params.get("roomId");
  const user = useRecoilValue(UserSelector)!;
  const [usersInRoom, setUsersInRoom] = useState<Peer[]>([]);
  const [producers, setProducers] = useState<ProducerContainer[]>([]);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const DeviceRef = useRef<Device | null>(null);
  const ProducerRef = useRef<Transport | null>(null);
  const ConsumerRef = useRef<Transport | null>(null);
  const consumers = useRef<Map<string, Consumer>>(new Map());
  const videoProducer = useRef<Producer | null>(null);
  const audioProducer = useRef<Producer | null>(null);

  useEffect(() => {
    if (socket.connected) {
      loadEverything();

      socket.onAny((event, args) => {
        routeIncommingEvents({ event, args });
      });
    }

    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      beforeUnload();
    };
  }, [roomId, socket]);

  useEffect(() => {
    producers.forEach((producer) => {
      consume(producer.producer_id);
    });
  }, [producers, roomId, name]);

  const beforeUnload = async () => {
    await sendRequestToSocket(WebSocketEventType.EXIT_ROOM, {});
  };

  const loadEverything = async () => {
    await createRoom();
    await joinRoom();
    await getCurrentUsers();
    await getRouterRTPCapabilties();
    await createConsumerTransport();
    await getProducers();
    await createProducerTransport();
  };

  const routeIncommingEvents = ({
    event,
    args,
  }: {
    event: WebSocketEventType;
    args: any;
  }) => {
    switch (event) {
      case WebSocketEventType.USER_JOINED:
        userJoined(args);
        break;

      case WebSocketEventType.USER_LEFT:
        userLeft(args);
        break;

      case WebSocketEventType.NEW_PRODUCERS:
        newProducers(args);
        break;

      case WebSocketEventType.PRODUCER_CLOSED:
        closedProducers(args);
        break;

      default:
        break;
    }
  };

  const closedProducers = (args: ProducerContainer) => {
    setProducers((v) =>
      v.filter((prod) => prod.producer_id !== args.producer_id)
    );
  };

  const closeProducer = (producer_id: string) => {
    sendRequestToSocket(WebSocketEventType.CLOSE_PRODUCER, { producer_id });
  };

  const newProducers = (args: ProducerContainer[]) => {
    console.log(args);

    setProducers((v) => [...v, ...args]);
  };

  const userLeft = (args: any) => {
    console.log("USER LEFT ARS", args);

    const user = args.user as Peer;
    setUsersInRoom((v) => v.filter((peer) => peer.id !== user.id));
  };
  const userJoined = (args: any) => {
    const user = args.user as Peer;
    setUsersInRoom((v) => [...v, user]);
  };

  const createRoom = async () => {
    await sendRequestToSocket(WebSocketEventType.CREATE_ROOM, { roomId });
  };
  const joinRoom = async () => {
    const resp = (await sendRequestToSocket(WebSocketEventType.JOIN_ROOM, {
      roomId,
      name: user.name,
    })) as { message: string };
    console.info(resp.message);
  };
  const getCurrentUsers = async () => {
    const users = (await sendRequestToSocket(
      WebSocketEventType.GET_IN_ROOM_USERS,
      {}
    )) as { users: Peer[] };
    console.log(users);

    setUsersInRoom(users.users);
  };

  const getRouterRTPCapabilties = async () => {
    const rtp = (await sendRequestToSocket(
      WebSocketEventType.GET_ROUTER_RTP_CAPABILITIES,
      {}
    )) as RtpCapabilities;
    if (!rtp) {
      console.error("Couldn't get RTP for device");
      return;
    }
    await loadDevice(rtp);
    return;
  };

  const loadDevice = async (rtp: RtpCapabilities) => {
    if (socket && !DeviceRef.current) {
      const device = new Device();
      await device.load({ routerRtpCapabilities: rtp });
      DeviceRef.current = device;
      console.log("--- Device Loaded successfully with RTP capabilities ---");
      return;
    } else {
      console.error(
        "Couldn't load device. check socket or theres current active device"
      );
      return;
    }
  };

  const getProducers = async () => {
    const producers = (await sendRequestToSocket(
      WebSocketEventType.GET_PRODUCERS,
      {}
    )) as ProducerContainer[];
    setProducers(producers);
  };

  const createProducerTransport = async () => {
    if (DeviceRef.current && socket) {
      console.log("resp");

      const resp = (await sendRequestToSocket(
        WebSocketEventType.CREATE_WEBRTC_TRANSPORT,
        {
          forceTcp: false,
          rtpCapabilities: DeviceRef.current.rtpCapabilities,
        }
      )) as { params: webRtcTransportParams };
      console.log(resp);

      ProducerRef.current = DeviceRef.current.createSendTransport(resp.params);

      console.log("--- CREATE PRODUCER TRANSPORT ---");

      if (ProducerRef.current) {
        try {
          ProducerRef.current.on("connect", ({ dtlsParameters }, cb, eb) => {
            sendRequestToSocket(WebSocketEventType.CONNECT_TRANSPORT, {
              transport_id: ProducerRef.current!.id,
              dtlsParameters,
            })
              .then(cb)
              .catch(eb);
          });

          ProducerRef.current.on(
            "produce",
            async ({ kind, rtpParameters }, cb, eb) => {
              try {
                const { producer_id } = (await sendRequestToSocket(
                  WebSocketEventType.PRODUCE,
                  {
                    producerTransportId: ProducerRef.current!.id,
                    kind,
                    rtpParameters,
                  }
                )) as { producer_id: string };

                console.log(producer_id);

                cb({ id: producer_id });
              } catch (error) {
                console.log(error);

                eb(new Error(String(error)));
              }
            }
          );

          ProducerRef.current.on("connectionstatechange", (state) => {
            console.log(state);
            switch (state) {
              case "disconnected":
                console.log("Producer disconnected");
                break;
            }
          });

          return true;
        } catch (error) {
          console.log("Producer Creation error :: ", error);
        }
      }
    }
  };

  const createConsumerTransport = async () => {
    if (ConsumerRef.current) {
      console.log("Already initialized a consumer transport");
      return;
    }
    try {
      const data = (await sendRequestToSocket(
        WebSocketEventType.CREATE_WEBRTC_TRANSPORT,
        { forceTcp: false }
      )) as { params: webRtcTransportParams };

      if (!data) {
        throw new Error("No Transport created");
      }
      console.log("Consumer Transport :: ", data);
      if (!DeviceRef.current || !socket) {
        console.error("No devie or socket found");
        return;
      }
      ConsumerRef.current = DeviceRef.current.createRecvTransport(data.params);

      ConsumerRef.current.on("connect", async ({ dtlsParameters }, cb, eb) => {
        sendRequestToSocket(WebSocketEventType.CONNECT_TRANSPORT, {
          transport_id: ConsumerRef.current!.id,
          dtlsParameters,
        })
          .then(cb)
          .catch(eb);
      });

      ConsumerRef.current.on("connectionstatechange", (state) => {
        console.log("Consumer state", state);
        if (state === "connected") {
          console.log("--- Connected Consumer Transport ---");
        }
        if (state === "disconnected") {
          ConsumerRef.current?.close();
        }
      });

      (await sendRequestToSocket(WebSocketEventType.GET_PRODUCERS, {})) as {
        producer_id: string;
      }[];
    } catch (error) {
      console.log("error creating consumer transport", error);
    }
  };

  const consume = (producerId: string) => {
    getConsumerStream(producerId).then((data) => {
      if (!data) {
        console.log("Couldn't load stream");
        return;
      }
      console.log("CONSUME STREAM DATA", data);

      const { consumer, kind } = data;
      consumers.current.set(consumer.id, consumer);
      if (kind === "video" || kind === "audio") {
        setRemoteStreams((v) => [...v, data]);
      }
    });
  };
  const getConsumerStream = async (producerId: string) => {
    if (!DeviceRef.current) {
      console.log("No device found");
      return;
    }
    if (!ConsumerRef.current) {
      console.warn("No current consumer transport");
      return;
    }
    const rtpCapabilities = DeviceRef.current.rtpCapabilities;
    const data = (await sendRequestToSocket(WebSocketEventType.CONSUME, {
      rtpCapabilities,
      consumerTransportId: ConsumerRef.current.id,
      producerId,
    })) as ConsumerResult;

    const { id, kind, rtpParameters } = data;

    console.log("ConSUMER DATA :: ", data);

    const consumer = await ConsumerRef.current.consume({
      id,
      producerId,
      kind,
      rtpParameters,
    });

    const stream = new MediaStream();
    stream.addTrack(consumer.track);

    return {
      consumer,
      stream,
      kind,
      producerId,
    };
  };

  const turnMicOn = async () => {
    if (!isMicOn) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioStream = stream.getAudioTracks()[0];

      if (ProducerRef.current) {
        audioProducer.current = await ProducerRef.current.produce({
          track: audioStream,
        });
      }

      //@ts-ignore
      window.localAudioStream = stream;

      setMicOn(true);
    } else {
      // Stop the audio track and release the microphone
      //@ts-ignore
      if (window.localAudioStream) {
        //@ts-ignore
        window.localAudioStream.getTracks().forEach((track) => track.stop());
        //@ts-ignore
        window.localAudioStream = null;
      }

      if (audioProducer.current) {
        closeProducer(audioProducer.current.id);
        audioProducer.current.close();
      }

      // Set the state or a variable to indicate that the microphone is off
      setMicOn(false);
    }
  };

  const turnVideoOn = async () => {
    if (!isVideoOn) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoStream = stream.getVideoTracks()[0];

      if (ProducerRef.current) {
        videoProducer.current = await ProducerRef.current.produce({
          track: videoStream,
        });
      }

      //@ts-ignore
      window.localStream = stream;
      setLocalStream(stream);

      setVideoOn(true);
    } else {
      //@ts-ignore
      if (window.localStream) {
        //@ts-ignore
        window.localStream.getTracks().forEach((track) => track.stop());
        //@ts-ignore
        window.localStream = null;
      }
      if (videoProducer.current) {
        closeProducer(videoProducer.current.id);
        videoProducer.current.close();
        setLocalStream(null);
      }

      setVideoOn(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="h-[90%] w-full p-4">
        <div className="h-full w-[95vw] p-3 overflow-hidden flex flex-wrap items-center justify-center gap-4">
          <LocalUserPannel stream={localStream} name={name!} />
          <UserCarousel
            usersInRoom={usersInRoom}
            remoteStreams={remoteStreams}
            producerContainer={producers}
            userId={socket.id}
          />
        </div>
      </div>
      <div className="h-[10%] w-full flex gap-8 items-center justify-center text-3xl">
        {isMicOn ? (
          <IoMdMic
            className="bg-red-600 text-white h-[3rem] w-[3rem] p-3 rounded-full cursor-pointer"
            onClick={turnMicOn}
          />
        ) : (
          <IoMdMicOff
            className="bg-red-600 text-white h-[3rem] w-[3rem] p-3 rounded-full cursor-pointer"
            onClick={turnMicOn}
          />
        )}
        {isVideoOn ? (
          <FaVideo
            className="bg-red-600 text-white h-[3rem] w-[3rem] p-3 rounded-full cursor-pointer"
            onClick={turnVideoOn}
          />
        ) : (
          <FaVideoSlash
            className="bg-red-600 text-white h-[3rem] w-[3rem] p-3 rounded-full cursor-pointer"
            onClick={turnVideoOn}
          />
        )}
        <DrawerClose>
          <ImPhoneHangUp className="bg-red-600 text-white h-[3rem] w-[3rem] p-3 rounded-full cursor-pointer" />
        </DrawerClose>
      </div>
    </div>
  );
};

const LocalUserPannel = ({ stream }: { stream: null | MediaStream }) => {
  const user = useRecoilValue(UserSelector)!;
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play();
      localVideoRef.current.volume = 0;
      localVideoRef.current.autoplay = true;
    }
  }, [stream]);
  return (
    <div
      className={twMerge(
        "overflow-hidden relative h-[40vh] w-[40vw]  border-red-500 border-2 bg-white rounded-xl p-2 flex justify-center items-center"
      )}
    >
      {stream ? (
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          className="h-full w-full"
        />
      ) : (
        <>
          <p className="absolute left-0 bottom-0 text-lg p-2 px-3 w-auto h-auto bg-shade">
            You
          </p>
          <Avvvatars value={user.name || user.username} size={95} />
        </>
      )}
    </div>
  );
};

const UserCarousel = ({
  usersInRoom,
  remoteStreams,
  producerContainer,
}: {
  usersInRoom: Peer[];
  remoteStreams: RemoteStream[];
  producerContainer: ProducerContainer[];
  userId?: string;
}) => {
  const users = mergeData(usersInRoom, remoteStreams, producerContainer);
  console.log("USERS", users);

  return (
    <>
      {users.map((user) => (
        <div
          key={user.userId}
          className={twMerge(
            "overflow-hidden relative h-[40vh] w-[40vw] border border-yellow-500 bg-white rounded-xl p-2 flex justify-center items-center"
          )}
        >
          {user.producers.length <= 0 ? (
            <>
              <p className="absolute left-0 bottom-0 text-lg p-2 px-3 w-auto h-auto bg-black/20">
                {user.name}
              </p>
              <Avvvatars value={user.name} size={95} />
            </>
          ) : (
            <MemoizedUserPannel user={user} />
          )}
        </div>
      ))}
    </>
  );
};

const UserPannel = ({ user }: { user: MergedData }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    user.producers.forEach((producer) => {
      if (producer.kind === "video" && videoRef.current) {
        videoRef.current.srcObject = producer.stream;
        videoRef.current.play();
        videoRef.current.volume = 0;
        videoRef.current.autoplay = true;
      } else if (producer.kind === "audio" && audioRef.current) {
        audioRef.current.srcObject = producer.stream;
        audioRef.current.play();
        audioRef.current.autoplay = true;
      }
    });
  }, [user]);

  if (!videoRef.current?.srcObject && audioRef.current?.srcObject) {
    <>
      <p className="absolute left-0 bottom-0 text-lg p-2 px-3 w-auto h-auto bg-black/20">
        {user.name}
      </p>
      <audio ref={audioRef} autoPlay />
      <Avvvatars value={user.name} size={95} />
    </>;
  }
  return (
    <div className="h-full w-full">
      <video ref={videoRef} autoPlay playsInline className="h-full w-full" />
      <audio ref={audioRef} autoPlay playsInline />
    </div>
  );
};

const MemoizedUserPannel = memo(UserPannel);

export default ConferenceMain;
