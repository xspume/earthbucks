import { describe, expect, test, beforeEach, it } from "@jest/globals";
import TxOutMap from "../src/tx-out-map";
import TxOut from "../src/tx-out";
import Script from "../src/script";
import { Buffer } from "buffer";

describe("TxOutputMap", () => {
  let txOutputMap: TxOutMap;
  let txOutput: TxOut;
  let txIdHash: Buffer;
  let outputIndex: number;

  beforeEach(() => {
    txOutputMap = new TxOutMap();
    txOutput = new TxOut(BigInt(100), Script.fromIsoStr("").unwrap());
    txIdHash = Buffer.from([1, 2, 3, 4]);
    outputIndex = 0;
  });

  test("nameFromOutput", () => {
    const name = TxOutMap.nameFromOutput(txIdHash, outputIndex);
    expect(name).toBe("01020304:0");
  });

  test("add", () => {
    txOutputMap.add(txOutput, txIdHash, outputIndex);
    const name = TxOutMap.nameFromOutput(txIdHash, outputIndex);
    expect(txOutputMap.map.get(name)).toBe(txOutput);
  });

  test("remove", () => {
    txOutputMap.add(txOutput, txIdHash, outputIndex);
    txOutputMap.remove(txIdHash, outputIndex);
    const name = TxOutMap.nameFromOutput(txIdHash, outputIndex);
    expect(txOutputMap.map.get(name)).toBeUndefined();
  });

  test("get", () => {
    txOutputMap.add(txOutput, txIdHash, outputIndex);
    const retrievedOutput = txOutputMap.get(txIdHash, outputIndex);
    expect(retrievedOutput).toBe(txOutput);
  });

  test("values method should return all TxOutput values", () => {
    const txOutputMap = new TxOutMap();
    const txOutput1 = txOutput;
    const txOutput2 = txOutput;
    txOutputMap.add(txOutput1, txIdHash, 0);
    txOutputMap.add(txOutput2, txIdHash, 1);

    const values = Array.from(txOutputMap.values());

    expect(values.length).toBe(2);
    expect(values).toContain(txOutput1);
    expect(values).toContain(txOutput2);
  });
});