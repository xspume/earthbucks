import { describe, expect, test } from "vitest";
import { PubKey } from "../src/pub-key.js";
import { PrivKey } from "../src/priv-key.js";

describe("PubKey", () => {
  test("PubKey", () => {
    const privKey = PrivKey.fromRandom();
    const pubKey = PubKey.fromPrivKey(privKey);
    expect(pubKey).toBeDefined();
  });

  test("to/from string format", () => {
    expect(
      PubKey.isValidStringFmt(
        "ebxpub5c2d464b282vZKAQ9QHCDmBhwpBhK4bK2kbjFbFzSxGPueCNsYYVo",
      ),
    ).toBe(true);
    expect(
      PubKey.isValidStringFmt(
        "ebxpu5c2d464b282vZKAQ9QHCDmBhwpBhK4bK2kbjFbFzSxGPueCNsYYVo",
      ),
    ).toBe(false);
    expect(
      PubKey.isValidStringFmt(
        "ebxpub5c2d464b282vZKAQ9QHCDmBhwpBhK4bK2kbjFbFzSxGPueCNsYYV",
      ),
    ).toBe(false);

    const pubKey = PubKey.fromStrictStr(
      "ebxpub5c2d464b282vZKAQ9QHCDmBhwpBhK4bK2kbjFbFzSxGPueCNsYYVo",
    );
    expect(pubKey.toStrictStr()).toEqual(
      "ebxpub5c2d464b282vZKAQ9QHCDmBhwpBhK4bK2kbjFbFzSxGPueCNsYYVo",
    );
  });
});
