import { describe, expect, test, beforeEach, it } from "vitest";
import { Header } from "../src/header.js";
import { Block } from "../src/block.js";
import { Tx } from "../src/tx.js";
import { BufWriter } from "../src/buf-writer.js";
import { BufReader } from "../src/buf-reader.js";
import { BlockBuilder } from "../src/block-builder.js";
import { Script } from "../src/script.js";
import { SysBuf, FixedBuf } from "../src/buf.js";
import { U8, U16, U32, U64, U128, U256 } from "../src/numbers.js";

describe("BlockBuilder", () => {
  test("fromBlock", () => {
    const bh = new Header(
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
    const tx = new Tx(new U8(0), [], [], new U64(0n));
    const block = new Block(bh, [tx]);
    const bb = BlockBuilder.fromBlock(block);
    expect(bb.header.version).toBe(bh.version);
    expect(bb.header.prevBlockId).toEqual(bh.prevBlockId);
    expect(bb.header.merkleRoot).toEqual(bh.merkleRoot);
    expect(bb.header.timestamp).toBe(bh.timestamp);
    expect(bb.header.target).toEqual(bh.target);
  });

  test("fromGenesis", () => {
    const target = new U256(0);
    const outputScript = new Script();
    const outputAmount = new U64(0n);
    const bb = BlockBuilder.fromGenesis(target, outputScript, outputAmount);
    expect(bb.header.version.n).toEqual(0);
    expect(bb.header.prevBlockId).toEqual(FixedBuf.alloc(32));
    expect(bb.header.merkleRoot).toEqual(bb.merkleTxs.root);
    expect(bb.header.timestamp.n).toBeLessThanOrEqual(new Date().getTime());
    expect(bb.header.target).toEqual(target);
  });

  test("toBlock", () => {
    const bh = new Header(
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
    const tx = new Tx(new U8(0), [], [], new U64(0n));
    const block = new Block(bh, [tx]);
    const bb = BlockBuilder.fromBlock(block);
    const block2 = bb.toBlock();
    expect(block2.header.version.n).toBe(bh.version.n);
    expect(block2.header.prevBlockId.toString("hex")).toEqual(
      bh.prevBlockId.toString("hex"),
    );
    expect(block2.header.merkleRoot).toEqual(bh.merkleRoot);
    expect(bb.header.timestamp.bn).toEqual(0n);
    expect(block2.header.target).toEqual(bh.target);
  });
});
