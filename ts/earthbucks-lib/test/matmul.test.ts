import { describe, expect, test, beforeEach, it } from "@jest/globals";
import Matmul from "../src/matmul";
import { Buffer } from "buffer";

describe("Matmul", () => {

  test("matmul256", () => {
    let matmul = new Matmul(new Uint8Array(32));
    let result = matmul.matmul256();
    let expected = result.toString("hex");
    expect(expected).toBe(
      "fc4e101ec4a9afaa432a12e8e5475158517a93d5f1b978b35bc392b521cda84b",
    );
  });

  test("matmul512", () => {
    let matmul = new Matmul(new Uint8Array(32));
    let result = matmul.matmul512();
    let expected = result.toString("hex");
    expect(expected).toBe(
      "12fdfe51e4d96ce46df7cfae08fb3ee9b026abdbc7749b5e4051a8ebcb351534",
    );
  });

  test("matmul1024", () => {
    let matmul = new Matmul(new Uint8Array(32));
    let result = matmul.matmul1024();
    let expected = result.toString("hex");
    expect(expected).toBe(
      "3d90f78f711c271da4ab7afb11092ac3dc446570792231837f1bd28816dfde1c",
    );
  });
});
