import {
  LiveUser,
  RoomInfo,
  UserSelection,
} from '@codesandbox/common/lib/types';
import { Derive } from 'app/overmind';

type State = {
  isLive: boolean;
  isTeam: boolean;
  isLoading: boolean;
  error: string | null;
  reconnecting: boolean;
  notificationsHidden: boolean;
  followingUserId: string | null;
  liveUserId: string | null;
  roomInfo: RoomInfo | null;
  currentSelection: UserSelection | null;
  liveUser: Derive<State, LiveUser | null>;
  isEditor: Derive<State, (liveUserId: string) => boolean>;
  isCurrentEditor: Derive<State, boolean>;
  isOwner: Derive<State, boolean>;
  liveUsersByModule: Derive<
    State,
    {
      [id: string]: string[];
    }
  >;
};

export const state: State = {
  isLive: false,
  isTeam: false,
  isLoading: false,
  reconnecting: false,
  notificationsHidden: false,
  followingUserId: null,
  error: null,
  liveUserId: null,
  roomInfo: null,
  currentSelection: null,
  liveUser: currentState =>
    currentState.roomInfo?.users.find(u => u.id === currentState.liveUserId) ||
    null,
  isEditor: currentState => liveUserId =>
    Boolean(
      currentState.isLive &&
        currentState.roomInfo &&
        (currentState.roomInfo.mode === 'open' ||
          currentState.roomInfo.ownerIds.includes(liveUserId) ||
          currentState.roomInfo.editorIds.includes(liveUserId))
    ),
  isCurrentEditor: currentState =>
    Boolean(
      currentState.liveUserId && currentState.isEditor(currentState.liveUserId)
    ),
  isOwner: currentState =>
    Boolean(
      currentState.isLive &&
        currentState.liveUserId &&
        currentState.roomInfo?.ownerIds.includes(currentState.liveUserId)
    ),
  liveUsersByModule: currentState => {
    const usersByModule = {};

    if (!currentState.isLive || !currentState.roomInfo) {
      return {};
    }

    const { liveUserId } = currentState;

    currentState.roomInfo.users.forEach(user => {
      const userId = user.id;
      if (userId !== liveUserId && user.currentModuleShortid) {
        usersByModule[user.currentModuleShortid] =
          usersByModule[user.currentModuleShortid] || [];
        usersByModule[user.currentModuleShortid].push(user.color);
      }
    });

    return usersByModule;
  },
};
