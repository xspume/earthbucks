import { describe, expect, test, beforeEach, it } from "@jest/globals";
import Domain from "../src/domain";

describe("Domain", () => {
  describe("isValidDomain", () => {
    it("should test these known valid/invalid domains", () => {
      expect(Domain.fromString("earthbucks.com").isValid()).toEqual(true);
      expect(Domain.fromString("earthbucks.com.").isValid()).toEqual(false);
      expect(Domain.fromString(".earthbucks.com").isValid()).toEqual(false);
      expect(
        Domain.fromString("node.node.node.node.earthbucks.com").isValid(),
      ).toEqual(true);
      expect(
        Domain.fromString(
          "node.node.node.node.node.node.node.node.node.earthbucks.com",
        ).isValid(),
      ).toEqual(false);
    });
  });
});
