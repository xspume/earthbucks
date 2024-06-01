import { describe, expect, test, beforeEach, it } from "vitest";
import { Header } from "../src/header.js";
import { Block } from "../src/block.js";
import { Tx } from "../src/tx.js";
import { IsoBufWriter } from "../src/iso-buf-writer.js";
import { IsoBufReader } from "../src/iso-buf-reader.js";
import { BlockBuilder } from "../src/block-builder.js";
import { Script } from "../src/script.js";
import { IsoBuf, FixedIsoBuf } from "../src/iso-buf.js";

describe("BlockBuilder", () => {
  test("fromBlock", () => {
    const bh = new Header(
      1,
      FixedIsoBuf.alloc(32),
      FixedIsoBuf.alloc(32),
      0n,
      0n,
      FixedIsoBuf.alloc(32),
      FixedIsoBuf.alloc(32),
      0,
      FixedIsoBuf.alloc(32),
      0,
      FixedIsoBuf.alloc(32),
    );
    const tx = new Tx(1, [], [], 0n);
    const block = new Block(bh, [tx]);
    const bb = BlockBuilder.fromBlock(block);
    expect(bb.header.version).toBe(bh.version);
    expect(bb.header.prevBlockId).toEqual(bh.prevBlockId);
    expect(bb.header.merkleRoot).toEqual(bh.merkleRoot);
    expect(bb.header.timestamp).toBe(bh.timestamp);
    expect(bb.header.target).toEqual(bh.target);
  });

  test("fromGenesis", () => {
    const target = FixedIsoBuf.alloc(32);
    const outputScript = new Script();
    const outputAmount = 0n;
    const bb = BlockBuilder.fromGenesis(target, outputScript, outputAmount);
    expect(bb.header.version).toBe(1);
    expect(bb.header.prevBlockId).toEqual(FixedIsoBuf.alloc(32));
    expect(bb.header.merkleRoot).toEqual(bb.merkleTxs.root);
    expect(bb.header.timestamp).toBeLessThanOrEqual(
      new Date().getTime() / 1000,
    );
    expect(bb.header.target).toEqual(target);
  });

  test("fromPrevBlockHeader", () => {
    const outputScript = new Script();
    const outputAmount = 0n;
    const target = FixedIsoBuf.alloc(32);
    const prevBlockHeader = new Header(
      1,
      FixedIsoBuf.alloc(32),
      FixedIsoBuf.alloc(32),
      0n,
      0n,
      target,
      FixedIsoBuf.alloc(32),
      0,
      FixedIsoBuf.alloc(32),
      0,
      FixedIsoBuf.alloc(32),
    );
    const bb = BlockBuilder.fromPrevBlockHeader(
      prevBlockHeader,
      null,
      outputScript,
      outputAmount,
    ).unwrap();
    expect(bb.header.version).toBe(1);
    expect(bb.header.prevBlockId).toEqual(prevBlockHeader.id());
    expect(bb.header.merkleRoot).toEqual(bb.merkleTxs.root);
    expect(bb.header.timestamp).toBeLessThanOrEqual(
      new Date().getTime() / 1000,
    );
    expect(bb.header.target).toEqual(target);
  });

  test("toBlock", () => {
    const bh = new Header(
      1,
      FixedIsoBuf.alloc(32),
      FixedIsoBuf.alloc(32),
      0n,
      0n,
      FixedIsoBuf.alloc(32),
      FixedIsoBuf.alloc(32),
      0,
      FixedIsoBuf.alloc(32),
      0,
      FixedIsoBuf.alloc(32),
    );
    const tx = new Tx(1, [], [], 0n);
    const block = new Block(bh, [tx]);
    const bb = BlockBuilder.fromBlock(block);
    const block2 = bb.toBlock();
    expect(block2.header.version).toBe(bh.version);
    expect(block2.header.prevBlockId.toString("hex")).toEqual(
      bh.prevBlockId.toString("hex"),
    );
    expect(block2.header.merkleRoot).toEqual(bh.merkleRoot);
    expect(bb.header.timestamp).toEqual(0n);
    expect(block2.header.target).toEqual(bh.target);
  });
});
