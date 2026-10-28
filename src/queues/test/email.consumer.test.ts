import amqp, { type Replies } from "amqplib";
import { jest } from "@jest/globals";

const mockCreateConnection = jest.fn();

jest.unstable_mockModule("../connection.js", () => ({
  createConnection: mockCreateConnection,
}));

jest.unstable_mockModule("@dharanigk2002/jobber-shared", () => ({
  winstonLogger: () => ({ info: jest.fn(), error: jest.fn() }),
}));

let connectionModule: any;
let consumeAuthEmailMessagesFn: any;

describe("Email consumer", () => {
  beforeAll(async () => {
    connectionModule = await import("../connection.js");
    const consumerModule = await import("../email.consumer.js");
    consumeAuthEmailMessagesFn = consumerModule.consumeAuthEmailMessages;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("consumeAuthEmailMessages method", () => {
    it("should be called", async () => {
      const mockChannel = {
        assertExchange: jest.fn(),
        consume: jest.fn(),
        assertQueue: jest
          .fn<() => Promise<Replies.AssertQueue>>()
          .mockResolvedValue({
            queue: "auth-email-queue",
            messageCount: 0,
            consumerCount: 0,
          }),
        bindQueue: jest.fn(),
        publish: jest.fn(),
      };

      mockCreateConnection.mockResolvedValue(mockChannel as unknown as never);

      const connectionChannel = mockChannel as unknown as amqp.Channel;

      await consumeAuthEmailMessagesFn(connectionChannel);

      expect(mockChannel.assertExchange).toHaveBeenCalledWith(
        "jobber-email-notification",
        "direct",
      );
      expect(mockChannel.bindQueue).toHaveBeenCalledWith(
        "auth-email-queue",
        "jobber-email-notification",
        "auth-email",
      );
      expect(mockChannel.assertQueue).toHaveBeenCalledWith("auth-email-queue", {
        durable: true,
        autoDelete: false,
      });
      expect(mockChannel.assertQueue).toHaveBeenCalledTimes(1);
    });
  });
});
