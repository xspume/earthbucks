import { describe, expect, test, beforeEach, it } from "vitest";
import { Header } from "../src/header.js";
import { SysBuf, FixedBuf, EbxBuf } from "../src/buf.js";
import { U8, U16, U32, U64, U128, U256 } from "../src/numbers.js";
import { BufReader } from "../src/buf-reader.js";
import { BufWriter } from "../src/buf-writer.js";

describe("Header", () => {
  test("toBuf and fromBuf", () => {
    const bh1 = new Header(
      new U8(0),
      FixedBuf.alloc(32),
      FixedBuf.alloc(32),
      new U64(0),
      new U32(0),
      new U256(0),
      new U256(0),
      new U16(0),
      FixedBuf.alloc(32),
      new U16(0),
      FixedBuf.alloc(32),
    );
    const buf = bh1.toBuf();
    const bh2 = Header.fromBuf(buf);
    expect(bh1.version.bn).toEqual(bh2.version.bn);
    expect(bh1.prevBlockId.toString("hex")).toEqual(
      bh2.prevBlockId.toString("hex"),
    );
    expect(bh1.merkleRoot).toEqual(bh2.merkleRoot);
    expect(bh1.timestamp.bn).toEqual(bh2.timestamp.bn);
    expect(bh1.target).toEqual(bh2.target);
    expect(bh1.nonce).toEqual(bh2.nonce);
    expect(bh1.blockNum.bn).toEqual(bh2.blockNum.bn);
  });

  test("toBuf", () => {
    const bh1 = new Header(
      new U8(0),
      FixedBuf.alloc(32),
      FixedBuf.alloc(32),
      new U64(0),
      new U32(0),
      new U256(0),
      new U256(0),
      new U16(0),
      FixedBuf.alloc(32),
      new U16(0),
      FixedBuf.alloc(32),
    );
    const buf = bh1.toBuf();
    const bh2 = Header.fromBuf(buf);
    expect(bh1.version.bn).toEqual(bh2.version.bn);
    expect(bh1.prevBlockId.toString("hex")).toEqual(
      bh2.prevBlockId.toString("hex"),
    );
    expect(bh1.merkleRoot).toEqual(bh2.merkleRoot);
    expect(bh1.timestamp.bn).toEqual(bh2.timestamp.bn);
    expect(bh1.target).toEqual(bh2.target);
    expect(bh1.nonce).toEqual(bh2.nonce);
    expect(bh1.blockNum.bn).toEqual(bh2.blockNum.bn);
  });

  test("isGenesis", () => {
    const bh1 = new Header(
      new U8(0),
      FixedBuf.alloc(32),
      FixedBuf.alloc(32),
      new U64(0),
      new U32(0),
      new U256(0),
      new U256(0),
      new U16(0),
      FixedBuf.alloc(32),
      new U16(0),
      FixedBuf.alloc(32),
    );
    expect(bh1.isGenesis()).toBe(true);
  });

  test("hash", () => {
    const bh1 = new Header(
      new U8(0),
      FixedBuf.alloc(32),
      FixedBuf.alloc(32),
      new U64(0),
      new U32(0),
      new U256(0),
      new U256(0),
      new U16(0),
      FixedBuf.alloc(32),
      new U16(0),
      FixedBuf.alloc(32),
    );
    expect(bh1.hash().toStrictHex()).toBe(
      "c62d5bb11ed250524c2a602a51c865b2a9fc9e3e7fa25958bd9ebf4b080d08eb",
    );
  });

  test("id", () => {
    const bh1 = new Header(
      new U8(0),
      FixedBuf.alloc(32),
      FixedBuf.alloc(32),
      new U64(0),
      new U32(0),
      new U256(0),
      new U256(0),
      new U16(0),
      FixedBuf.alloc(32),
      new U16(0),
      FixedBuf.alloc(32),
    );
    expect(bh1.id().toStrictHex()).toBe(
      "dd4a2cc754029811082c3bf7316c1ef46e198bd2312020f9c61577d693348434",
    );
  });

  test("coinbaseAmount", () => {
    expect(Header.coinbaseAmount(new U32(0n)).n).toEqual(10_000_000_000);
    expect(Header.coinbaseAmount(new U32(210_000n)).n).toEqual(5_000_000_000);
    expect(Header.coinbaseAmount(new U32(420_000n)).n).toEqual(2_500_000_000);
    expect(Header.coinbaseAmount(new U32(630_000n)).n).toEqual(1_250_000_000);
    expect(Header.coinbaseAmount(new U32(840_000n)).n).toEqual(625_000_000);
    expect(Header.coinbaseAmount(new U32(1_050_000n)).n).toEqual(312_500_000);
    expect(Header.coinbaseAmount(new U32(1_260_000n)).n).toEqual(156_250_000);
    // let sum = 0;
    // for (let i = 0; i < 2_000_000; i++) {
    //   sum += Header.coinbaseAmount(new U32(i)).n;
    // }
    // expect(sum).toBe(4_193_945_312_500_000);
  });

  describe("newTargetFromOldTargets", () => {
    test("newTargetFromOldTargets 1", () => {
      const target1Hex =
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      const target1Buf = EbxBuf.fromStrictHex(32, target1Hex);
      const target1 = new BufReader(target1Buf).readU256BE();
      const targetSum = target1.bn;
      const len = new U32(1);
      const newTarget = Header.newTargetFromOldTargets(
        targetSum,
        new U64(600_000),
        len,
      );
      const newTargetHex = new BufWriter()
        .writeU256BE(newTarget)
        .toBuf()
        .toString("hex");
      const expectedHex =
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      expect(newTargetHex).toBe(expectedHex);
    });

    test("newTargetFromOldTargets 1,2", () => {
      const target1Hex =
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      const target1Buf = EbxBuf.fromStrictHex(32, target1Hex);
      const target1 = new BufReader(target1Buf).readU256BE();
      const targetSum = target1.bn;
      const realTimeDiff = new U64(300_000);
      const len = new U32(1);
      const newTarget = Header.newTargetFromOldTargets(
        targetSum,
        realTimeDiff,
        len,
      );
      const newTargetHex = new BufWriter()
        .writeU256BE(newTarget)
        .toBuf()
        .toString("hex");
      const expectedHex =
        "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      expect(newTargetHex).toBe(expectedHex);
    });

    test("newTargetFromOldTargets 1,3", () => {
      const target1Hex =
        "8000000000000000000000000000000000000000000000000000000000000000";
      const target1Buf = EbxBuf.fromStrictHex(32, target1Hex);
      const target1 = new BufReader(target1Buf).readU256BE();
      const targetSum = target1.bn;
      const realTimeDiff = new U64(600_000);
      const len = new U32(1);
      const newTarget = Header.newTargetFromOldTargets(
        targetSum,
        realTimeDiff,
        len,
      );
      const newTargetHex = new BufWriter()
        .writeU256BE(newTarget)
        .toBuf()
        .toString("hex");
      const expectedHex = target1Hex;
      expect(newTargetHex).toBe(expectedHex);
    });

    test("newTargetFromOldTargets 1,4", () => {
      const target1Hex =
        "8000000000000000000000000000000000000000000000000000000000000000";
      const target1Buf = EbxBuf.fromStrictHex(32, target1Hex);
      const target1 = new BufReader(target1Buf).readU256BE();
      const targetSum = target1.bn;
      const realTimeDiff = new U64(300_000);
      const len = new U32(1);
      const newTarget = Header.newTargetFromOldTargets(
        targetSum,
        realTimeDiff,
        len,
      );
      const newTargetHex = new BufWriter()
        .writeU256BE(newTarget)
        .toBuf()
        .toString("hex");
      const expectedHex =
        "4000000000000000000000000000000000000000000000000000000000000000";
      expect(newTargetHex).toBe(expectedHex);
    });

    test("newTargetFromOldTargets 1,5", () => {
      const target1Hex =
        "0080000000000000000000000000000000000000000000000000000000000000";
      const target1Buf = EbxBuf.fromStrictHex(32, target1Hex);
      const target1 = new BufReader(target1Buf).readU256BE();
      const targetSum = target1.bn;
      const realTimeDiff = new U64(1_200_000);
      const len = new U32(1);
      const newTarget = Header.newTargetFromOldTargets(
        targetSum,
        realTimeDiff,
        len,
      );
      const newTargetHex = new BufWriter()
        .writeU256BE(newTarget)
        .toBuf()
        .toString("hex");
      const expectedHex =
        "0100000000000000000000000000000000000000000000000000000000000000";
      expect(newTargetHex).toBe(expectedHex);
    });

    test("newTargetFromOldTargets 2", () => {
      const target1Hex =
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      const target1Buf = EbxBuf.fromStrictHex(32, target1Hex);
      const target1 = new BufReader(target1Buf).readU256BE();
      const target2Hex =
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      const target2Buf = EbxBuf.fromStrictHex(32, target2Hex);
      const target2 = new BufReader(target2Buf).readU256BE();
      const targetSum = target1.bn + target2.bn;
      const realTimeDiff = new U64(600_000 + 600_000);
      const len = new U32(2);
      const newTarget = Header.newTargetFromOldTargets(
        targetSum,
        realTimeDiff,
        len,
      );
      const newTargetHex = new BufWriter()
        .writeU256BE(newTarget)
        .toBuf()
        .toString("hex");
      const expectedHex =
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      expect(newTargetHex).toBe(expectedHex);
    });

    test("newTargetFromOldTargets 2,2", () => {
      const target1Hex =
        "0080000000000000000000000000000000000000000000000000000000000000";
      const target1Buf = EbxBuf.fromStrictHex(32, target1Hex);
      const target1 = new BufReader(target1Buf).readU256BE();
      const target2Hex =
        "0080000000000000000000000000000000000000000000000000000000000000";
      const target2Buf = EbxBuf.fromStrictHex(32, target2Hex);
      const target2 = new BufReader(target2Buf).readU256BE();
      const targetSum = target1.bn + target2.bn;
      const realTimeDiff = new U64(600_000 + 300_000);
      const len = new U32(2);
      const newTarget = Header.newTargetFromOldTargets(
        targetSum,
        realTimeDiff,
        len,
      );
      const newTargetHex = new BufWriter()
        .writeU256BE(newTarget)
        .toBuf()
        .toString("hex");
      const expectedHex =
        "0060000000000000000000000000000000000000000000000000000000000000";
      expect(newTargetHex).toBe(expectedHex);
    });

    test("newTargetFromOldTargets 2,3", () => {
      const target1Hex =
        "0080000000000000000000000000000000000000000000000000000000000000";
      const target1Buf = EbxBuf.fromStrictHex(32, target1Hex);
      const target1 = new BufReader(target1Buf).readU256BE();
      const target2Hex =
        "0080000000000000000000000000000000000000000000000000000000000000";
      const target2Buf = EbxBuf.fromStrictHex(32, target2Hex);
      const target2 = new BufReader(target2Buf).readU256BE();
      const targetSum = target1.bn + target2.bn;
      const realTimeDiff = new U64(600_000 + 1_200_000);
      const len = new U32(2);
      const newTarget = Header.newTargetFromOldTargets(
        targetSum,
        realTimeDiff,
        len,
      );
      const newTargetHex = new BufWriter()
        .writeU256BE(newTarget)
        .toBuf()
        .toString("hex");
      const expectedHex =
        "00c0000000000000000000000000000000000000000000000000000000000000";
      expect(newTargetHex).toBe(expectedHex);
    });

    test("newTargetFromOldTargets 3", () => {
      const target1Hex =
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      const target1Buf = EbxBuf.fromStrictHex(32, target1Hex);
      const target1 = new BufReader(target1Buf).readU256BE();
      const target2Hex =
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      const target2Buf = EbxBuf.fromStrictHex(32, target2Hex);
      const target2 = new BufReader(target2Buf).readU256BE();
      const target3Hex =
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      const target3Buf = EbxBuf.fromStrictHex(32, target3Hex);
      const target3 = new BufReader(target3Buf).readU256BE();
      const targetSum = target1.bn + target2.bn + target3.bn;
      const realTimeDiff = new U64(600_000 + 600_000 + 600_000);
      const len = new U32(3);
      const newTarget = Header.newTargetFromOldTargets(
        targetSum,
        realTimeDiff,
        len,
      );
      const newTargetHex = new BufWriter()
        .writeU256BE(newTarget)
        .toBuf()
        .toString("hex");
      const expectedHex =
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      expect(newTargetHex).toBe(expectedHex);
    });

    test("newTargetFromOldTargets 3,2", () => {
      const target1Hex =
        "0080000000000000000000000000000000000000000000000000000000000000";
      const target1Buf = EbxBuf.fromStrictHex(32, target1Hex);
      const target1 = new BufReader(target1Buf).readU256BE();
      const target2Hex =
        "0080000000000000000000000000000000000000000000000000000000000000";
      const target2Buf = EbxBuf.fromStrictHex(32, target2Hex);
      const target2 = new BufReader(target2Buf).readU256BE();
      const target3Hex =
        "0080000000000000000000000000000000000000000000000000000000000000";
      const target3Buf = EbxBuf.fromStrictHex(32, target3Hex);
      const target3 = new BufReader(target3Buf).readU256BE();
      const targetSum = target1.bn + target2.bn + target3.bn;
      const realTimeDiff = new U64(600_000 + 600_000 + 601_000);
      const len = new U32(3);
      const newTarget = Header.newTargetFromOldTargets(
        targetSum,
        realTimeDiff,
        len,
      );
      const newTargetHex = new BufWriter()
        .writeU256BE(newTarget)
        .toBuf()
        .toString("hex");
      const expectedHex =
        "0080123456789abcdf0123456789abcdf0123456789abcdf0123456789abcdf0";
      expect(newTargetHex).toBe(expectedHex);
    });

    test("newTargetFromOldTargets 3,3", () => {
      const target1Hex =
        "0080000000000000000000000000000000000000000000000000000000000000";
      const target1Buf = EbxBuf.fromStrictHex(32, target1Hex);
      const target1 = new BufReader(target1Buf).readU256BE();
      const target2Hex =
        "0080000000000000000000000000000000000000000000000000000000000000";
      const target2Buf = EbxBuf.fromStrictHex(32, target2Hex);
      const target2 = new BufReader(target2Buf).readU256BE();
      const target3Hex =
        "0080000000000000000000000000000000000000000000000000000000000000";
      const target3Buf = EbxBuf.fromStrictHex(32, target3Hex);
      const target3 = new BufReader(target3Buf).readU256BE();
      const targetSum = target1.bn + target2.bn + target3.bn;
      const realTimeDiff = new U64(600_000 + 600_000 + 599_000);
      const len = new U32(3);
      const newTarget = Header.newTargetFromOldTargets(
        targetSum,
        realTimeDiff,
        len,
      );
      const newTargetHex = new BufWriter()
        .writeU256BE(newTarget)
        .toBuf()
        .toString("hex");
      const expectedHex =
        "007fedcba987654320fedcba987654320fedcba987654320fedcba987654320f";
      expect(newTargetHex).toBe(expectedHex);
    });
  });
});
