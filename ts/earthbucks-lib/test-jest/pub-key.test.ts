import { describe, expect, test } from "@jest/globals";
import PubKey from "../src/pub-key";
import PrivKey from "../src/priv-key";

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

    const pubKey = PubKey.fromIsoStr(
      "ebxpub5c2d464b282vZKAQ9QHCDmBhwpBhK4bK2kbjFbFzSxGPueCNsYYVo",
    ).unwrap();
    expect(pubKey.toIsoStr()).toEqual(
      "ebxpub5c2d464b282vZKAQ9QHCDmBhwpBhK4bK2kbjFbFzSxGPueCNsYYVo",
    );
  });
});