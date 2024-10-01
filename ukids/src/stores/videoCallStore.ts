import { create } from 'zustand';
import {
  OpenVidu,
  Session as OVSession,
  Publisher,
  Subscriber,
} from 'openvidu-browser';
import api from '../util/api';

interface VideoCallStore {
  session: OVSession | null;
  OV: OpenVidu | null;
  subscribers: { subscriber: Subscriber; name: string }[];
  publisher: { publisher: Publisher; name: string } | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  userName: string;
  isChatting: boolean;
  setIsChatting: (value: boolean) => void;
  joinSession: (familyId: number, userName: string) => Promise<void>;
  leaveSession: () => void;
  setUserName: (userName: string) => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  setAudioForSubscriber: (index: number, enabled: boolean) => void;
}

export const useVideoCallStore = create<VideoCallStore>((set, get) => ({
  session: null,
  OV: null,
  subscribers: [],
  publisher: null,
  isVideoEnabled: false,
  isAudioEnabled: false,
  userName: '',
  isChatting: false,
  setIsChatting: (value) => set(() => ({ isChatting: value })),

  joinSession: async (familyId, userName, token: string | null = null) => {
    const OV = new OpenVidu();
    set({ OV });

    const session = OV.initSession();
    set({ session });

    session.on('streamDestroyed', (event) => {
      const newSubscribers = get().subscribers.filter(
        (sub) => sub.subscriber.stream.streamId !== event.stream.streamId,
      );
      set({ subscribers: newSubscribers });
    });

    session.on('streamCreated', (event) => {
      const newSubscriber = session.subscribe(event.stream, '');
      const userData = JSON.parse(
        event.stream.connection.data.split('%/%')[0],
      ).clientData;
      set((state) => ({
        subscribers: [
          ...state.subscribers,
          { subscriber: newSubscriber, name: userData },
        ],
      }));
    });

    try {
      // console.log('webrtc token : ', token);

      const sessionToken = token || (await getToken(familyId));
      // const token = await getToken(familyId);
      await session.connect(sessionToken, { clientData: userName });

      const publisher = OV.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: get().isAudioEnabled,
        publishVideo: get().isVideoEnabled,
        mirror: false,
      });

      session.publish(publisher);
      set({ publisher: { publisher, name: userName } });
    } catch (error) {
      console.error('Failed to join the session:', error);
    }
  },

  leaveSession: () => {
    const { session } = get();
    if (session) {
      session.disconnect();
    }
    set({
      OV: null,
      session: null,
      subscribers: [],
      publisher: null,
      isVideoEnabled: false,
      isAudioEnabled: false,
    });
  },

  toggleVideo: () => {
    set((state) => {
      if (state.publisher) {
        const newVideoState = !state.isVideoEnabled;
        state.publisher.publisher.publishVideo(newVideoState);
        return { isVideoEnabled: newVideoState };
      }
      return state;
    });
  },

  toggleAudio: () => {
    set((state) => {
      if (state.publisher) {
        const newAudioState = !state.isAudioEnabled;
        state.publisher.publisher.publishAudio(newAudioState);
        return { isAudioEnabled: newAudioState };
      }
      return state;
    });
  },

  setAudioForSubscriber: (index: number, enabled: boolean) => {
    set((state) => {
      const updatedSubscribers = [...state.subscribers];
      const subscriber = updatedSubscribers[index];
      if (subscriber) {
        const audioTracks = subscriber.subscriber.stream
          .getMediaStream()
          .getAudioTracks();
        audioTracks.forEach((track) => {
          track.enabled = enabled;
        });
      }
      return { subscribers: updatedSubscribers };
    });
  },

  setUserName: (userName: string) => set(() => ({ userName })),
}));

async function getToken(familyId: number): Promise<string> {
  try {
    const token = await createToken(familyId);
    return token;
  } catch (error) {
    console.error('Failed to get token:', error);
    throw new Error('Failed to get token.');
  }
}

const createToken = (familyId: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    api
      .post(`/webrtc/${familyId}`)
      .then((response) => {
        if (response.data && response.data.result) {
          resolve(response.data.result);
        } else {
          reject(new Error('Invalid API response format'));
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
        reject(error);
      });
  });
};
