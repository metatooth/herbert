import {
  SocketMessageType,
  SocketMessage,
  EnhancedMessageCreator,
  MessageCreator,
  AnySocketMessage,
} from "./types";

// type guard for message types
export const isMessageType = (t: unknown): t is SocketMessageType => {
  return Object.values(SocketMessageType).includes(t as SocketMessageType);
};

// type guard for socket messages
export const isSocketMessage = (
  m: unknown
): m is SocketMessage<SocketMessageType, unknown> => {
  return (
    typeof m === "object" &&
    "type" in m &&
    isMessageType(m["type"]) &&
    "payload" in m
  );
};

export const createMessageCreator = <T extends SocketMessageType>(type: T) => {
  return <P>(): EnhancedMessageCreator<T, P> => {
    const create: MessageCreator<T, P> = (payload: P): SocketMessage<T, P> => {
      return { type, payload };
    };

    return Object.assign(create, {
      type,
      isOfType(m: AnySocketMessage): m is SocketMessage<T, P> {
        return m.type === this.type;
      },
    });
  };
};

// helper to type guard messages by checking if they came from a given creator
export const messageIsFrom = <
  E extends EnhancedMessageCreator<SocketMessageType, unknown>
>(
  c: E,
  msg: AnySocketMessage
): msg is ReturnType<E> => {
  return c.isOfType(msg);
};
