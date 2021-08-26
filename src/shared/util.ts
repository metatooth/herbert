import {
  SocketMessageType,
  SocketMessage,
  EnhancedMessageCreator,
  MessageCreator,
  AnySocketMessage
} from "./types";

// type guard for message types
export const isMessageType = (t: any): t is SocketMessageType => {
  return Object.values(SocketMessageType).includes(t);
};

// type guard for socket messages
export const isSocketMessage = (
  m: any
): m is SocketMessage<SocketMessageType, any> => {
  return (
    typeof m === "object" &&
    "type" in m &&
    isMessageType(m.type) &&
    "payload" in m &&
    typeof m.payload === "object"
  );
};

export const createMessageCreator = <T extends SocketMessageType, P>(
  type: T
): EnhancedMessageCreator<T, P> => {
  const create: MessageCreator<T, P> = (payload: P): SocketMessage<T, P> => {
    return { type, payload };
  };

  return Object.assign(create, {
    type,
    isOfType(m: AnySocketMessage): m is SocketMessage<T, P> {
      return m.type === this.type;
    }
  });
};

// helper to type guard messages by checking if they came from a given creator
export const messageIsFrom = <
  E extends EnhancedMessageCreator<SocketMessageType, any>
>(
  c: E,
  msg: AnySocketMessage
): msg is ReturnType<E> => {
  return c.isOfType(msg);
};
