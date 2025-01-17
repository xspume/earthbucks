import { describe, expect, test, beforeEach, it } from "vitest";
import { Tx, HashCache } from "../src/tx.js";
import { TxIn } from "../src/tx-in.js";
import { TxOut } from "../src/tx-out.js";
import { Script } from "../src/script.js";
import { BufReader } from "../src/buf-reader.js";
import { BufWriter } from "../src/buf-writer.js";
import * as Hash from "../src/hash.js";
import { TxSignature } from "../src/tx-signature.js";
import { KeyPair } from "../src/key-pair.js";
import { FixedBuf, SysBuf } from "../src/buf.js";
import { U8, U16, U32, U64 } from "../src/numbers.js";

describe("Tx", () => {
  describe("constructor", () => {
    test("should create a Tx", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [];
      const outputs: TxOut[] = [];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);
      expect(tx.version).toBe(version);
      expect(tx.inputs).toBe(inputs);
      expect(tx.outputs).toBe(outputs);
      expect(tx.lockAbs).toBe(lockAbs);
    });
  });

  test("to/from u8Vec", () => {
    const version = new U8(0);
    const inputs: TxIn[] = [
      new TxIn(FixedBuf.alloc(32), new U32(0), new Script(), new U32(0)),
    ];
    const outputs: TxOut[] = [new TxOut(new U64(100), new Script())];
    const lockAbs = new U64(0);

    const tx = new Tx(version, inputs, outputs, lockAbs);
    const result = Tx.fromBuf(tx.toBuf());
    expect(tx.toBuf().toString("hex")).toEqual(result.toBuf().toString("hex"));
  });

  describe("fromU8Vec", () => {
    test("fromU8Vec", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [
        new TxIn(FixedBuf.alloc(32), new U32(0), new Script(), new U32(0)),
      ];
      const outputs: TxOut[] = [new TxOut(new U64(100), new Script())];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);

      const result = Tx.fromBuf(tx.toBuf());
      expect(result.version).toEqual(version);
      expect(result.inputs.length).toEqual(inputs.length);
      expect(result.outputs.length).toEqual(outputs.length);
      expect(result.lockAbs).toEqual(lockAbs);
    });
  });

  describe("fromBufReader", () => {
    test("fromBufReader", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [
        new TxIn(FixedBuf.alloc(32), new U32(0), new Script(), new U32(0)),
      ];
      const outputs: TxOut[] = [new TxOut(new U64(100), new Script())];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);

      const reader = new BufReader(tx.toBuf());
      const result = Tx.fromBufReader(reader);
      expect(result.version).toEqual(version);
      expect(result.inputs.length).toEqual(inputs.length);
      expect(result.outputs.length).toEqual(outputs.length);
      expect(result.lockAbs).toEqual(lockAbs);
    });
  });

  describe("to/from string", () => {
    test("to/from string", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [
        new TxIn(FixedBuf.alloc(32), new U32(0), new Script(), new U32(0)),
      ];
      const outputs: TxOut[] = [new TxOut(new U64(100), new Script())];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);

      const result = Tx.fromStrictHex(tx.toStrictHex());
      expect(result.version).toEqual(version);
      expect(result.inputs.length).toEqual(inputs.length);
      expect(result.outputs.length).toEqual(outputs.length);
      expect(result.lockAbs).toEqual(lockAbs);
    });
  });

  describe("fromCoinbase", () => {
    test("fromCoinbase", () => {
      const script = Script.fromStrictStr("DOUBLEBLAKE3");
      const txInput = TxIn.fromCoinbase(script);
      expect(txInput.inputTxId.every((byte) => byte === 0)).toBe(true);
      expect(txInput.inputTxNOut.n).toEqual(0xffffffff);
      expect(txInput.script.toStrictStr()).toEqual(script.toStrictStr());
      expect(txInput.lockRel.n).toBe(0);
    });
  });

  describe("isCoinbase", () => {
    test("isCoinbase", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [
        new TxIn(
          FixedBuf.alloc(32),
          new U32(0xffffffff),
          new Script(),
          new U32(0),
        ),
      ];
      const outputs: TxOut[] = [new TxOut(new U64(100), new Script())];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);
      expect(tx.isCoinbase()).toBe(true);
    });

    test("is not coinbase", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [
        new TxIn(FixedBuf.alloc(32), new U32(0), new Script(), new U32(0)),
      ];
      const outputs: TxOut[] = [new TxOut(new U64(100), new Script())];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);
      expect(tx.isCoinbase()).toBe(false);
    });

    test("fromCoinbase -> isCoinbase", () => {
      const script = Script.fromStrictStr("DOUBLEBLAKE3");
      const txInput = TxIn.fromCoinbase(script);
      const tx = new Tx(new U8(0), [txInput], [], new U64(0));
      expect(tx.isCoinbase()).toBe(true);
    });
  });

  describe("hashonce", () => {
    it("should return the hash of the tx", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [
        new TxIn(FixedBuf.alloc(32), new U32(0), new Script(), new U32(0)),
      ];
      const outputs: TxOut[] = [new TxOut(new U64(100), new Script())];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);
      const expectedHash = Hash.blake3Hash(tx.toBuf());
      expect(tx.blake3Hash()).toEqual(expectedHash);
    });
  });

  describe("hash", () => {
    it("should return the hash of the hash of the tx", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [
        new TxIn(FixedBuf.alloc(32), new U32(0), new Script(), new U32(0)),
      ];
      const outputs: TxOut[] = [new TxOut(new U64(100), new Script())];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);
      const expectedHash = Hash.blake3Hash(Hash.blake3Hash(tx.toBuf()));
      expect(tx.id()).toEqual(expectedHash);
    });
  });

  describe("sighash", () => {
    test("hashPrevouts", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [
        new TxIn(FixedBuf.alloc(32), new U32(0), new Script(), new U32(0)),
      ];
      const outputs: TxOut[] = [new TxOut(new U64(100), new Script())];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);

      const result = tx.hashPrevouts();

      expect(SysBuf.from(result).toString("hex")).toEqual(
        "2cb9ad7c6db72bb07dae3873c8a28903510eb87fae097338bc058612af388fba",
      );
    });

    test("hashLockRel", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [
        new TxIn(FixedBuf.alloc(32), new U32(0), new Script(), new U32(0)),
      ];
      const outputs: TxOut[] = [new TxOut(new U64(100), new Script())];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);

      const result = tx.hashLockRel();

      expect(SysBuf.from(result).toString("hex")).toEqual(
        "406986f514581cacbf3ab0fc3863b336d137af79318ce4bae553a91435773931",
      );
    });

    test("hashOutputs", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [
        new TxIn(FixedBuf.alloc(32), new U32(0), new Script(), new U32(0)),
      ];
      const outputs: TxOut[] = [new TxOut(new U64(100), new Script())];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);

      const result = tx.hashOutputs();

      expect(SysBuf.from(result).toString("hex")).toEqual(
        "8c92e84e8b3b8b44690cbf64547018defaf43ade3b793ed8aa8ad33ae33941e5",
      );
    });

    test("sighash", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [
        new TxIn(
          FixedBuf.alloc(32),
          new U32(0),
          Script.fromEmpty(),
          new U32(0),
        ),
      ];
      const outputs: TxOut[] = [new TxOut(new U64(100), Script.fromEmpty())];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);

      const script = Script.fromEmpty();
      const scriptU8Vec = script.toBuf();
      const result = tx.sighashNoCache(
        new U32(0),
        scriptU8Vec,
        new U64(1),
        TxSignature.SIGHASH_ALL,
      );

      expect(SysBuf.from(result).toString("hex")).toEqual(
        "3430c67343563b322d5fd8121ab44a88fa66b87d9553e49fa47552bbf3279e5b",
      );
    });

    test("sighash with cache", () => {
      const version = new U8(0);
      const inputs: TxIn[] = [
        new TxIn(
          FixedBuf.alloc(32),
          new U32(0),
          Script.fromEmpty(),
          new U32(0),
        ),
      ];
      const outputs: TxOut[] = [new TxOut(new U64(100), Script.fromEmpty())];
      const lockAbs = new U64(0);

      const tx = new Tx(version, inputs, outputs, lockAbs);

      const script = Script.fromEmpty();
      const scriptU8Vec = script.toBuf();
      const hashCache = new HashCache();
      const result = tx.sighashWithCache(
        new U32(0),
        scriptU8Vec,
        new U64(1),
        TxSignature.SIGHASH_ALL,
        hashCache,
      );

      expect(SysBuf.from(result).toString("hex")).toEqual(
        "3430c67343563b322d5fd8121ab44a88fa66b87d9553e49fa47552bbf3279e5b",
      );
    });

    describe("sign and verify", () => {
      it("should generate a deterministic signature", () => {
        // Arrange
        const inputIndex = new U32(0);
        const privateKey = SysBuf.from(
          "7ca2df5597b60403be38cdbd4dc4cd89d7d00fce6b0773ef903bc8b87c377fad",
          "hex",
        );
        const script = SysBuf.from([]);
        const amount = new U64(100);
        const hashType = TxSignature.SIGHASH_ALL;
        const inputs: TxIn[] = [
          new TxIn(
            FixedBuf.alloc(32),
            new U32(0),
            Script.fromEmpty(),
            new U32(0),
          ),
        ];
        const outputs: TxOut[] = [new TxOut(new U64(100), Script.fromEmpty())];
        const tx = new Tx(new U8(0), inputs, outputs, new U64(0));

        // Act
        const signature = tx.signNoCache(
          inputIndex,
          privateKey,
          script,
          amount,
          hashType,
        );

        // Assert
        const expectedSignatureHex =
          "01dd0236c4f662dab7e24985e394ceee9936bf316146e3dd5c4d26f20545acfcc20118c8e50e0402892ef6f7883270de48bb1c6f3719fd75a06bd7efe537f3397b"; // your expected signature in hex
        expect(SysBuf.from(signature.toBuf()).toString("hex")).toEqual(
          expectedSignatureHex,
        );
      });

      it("should verify a deterministic signature", () => {
        // Arrange
        const inputIndex = new U32(0);
        const privateKey = FixedBuf.fromStrictHex(
          32,
          "7ca2df5597b60403be38cdbd4dc4cd89d7d00fce6b0773ef903bc8b87c377fad",
        );
        const script = SysBuf.from([]);
        const amount = new U64(100);
        const hashType = TxSignature.SIGHASH_ALL;
        const inputs: TxIn[] = [
          new TxIn(
            FixedBuf.alloc(32),
            new U32(0),
            Script.fromEmpty(),
            new U32(0),
          ),
        ];
        // expect tx output to equal hext
        expect(inputs[0].toBuf().toString("hex")).toEqual(
          "0000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        );
        const outputs: TxOut[] = [new TxOut(new U64(100), Script.fromEmpty())];
        expect(outputs[0].toBuf().toString("hex")).toEqual(
          "000000000000006400",
        );
        const tx = new Tx(new U8(0), inputs, outputs, new U64(0));
        expect(tx.toBuf().toString("hex")).toEqual(
          "00010000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000064000000000000000000",
        );

        // Act
        const signature = tx.signNoCache(
          inputIndex,
          privateKey,
          script,
          amount,
          hashType,
        );

        // Assert
        const expectedSignatureHex =
          "01dd0236c4f662dab7e24985e394ceee9936bf316146e3dd5c4d26f20545acfcc20118c8e50e0402892ef6f7883270de48bb1c6f3719fd75a06bd7efe537f3397b"; // your expected signature in hex
        expect(SysBuf.from(signature.toBuf()).toString("hex")).toEqual(
          expectedSignatureHex,
        );
        const publicKey = KeyPair.fromPrivKeyEbxBuf(privateKey)

          .pubKey.toBuf();
        const result = tx.verifyNoCache(
          inputIndex,
          publicKey,
          signature,
          script,
          amount,
        );
        expect(result).toBe(true);
      });

      it("should verify a deterministic signature with hash cache", () => {
        // Arrange
        const inputIndex = new U32(0);
        const privateKey = FixedBuf.fromStrictHex(
          32,
          "7ca2df5597b60403be38cdbd4dc4cd89d7d00fce6b0773ef903bc8b87c377fad",
        );
        const script = SysBuf.from([]);
        const amount = new U64(100);
        const hashType = TxSignature.SIGHASH_ALL;
        const inputs: TxIn[] = [
          new TxIn(
            FixedBuf.alloc(32),
            new U32(0),
            Script.fromEmpty(),
            new U32(0),
          ),
        ];
        // expect tx output to equal hext
        expect(inputs[0].toBuf().toString("hex")).toEqual(
          "0000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        );
        const outputs: TxOut[] = [new TxOut(new U64(100), Script.fromEmpty())];
        expect(outputs[0].toBuf().toString("hex")).toEqual(
          "000000000000006400",
        );
        const tx = new Tx(new U8(0), inputs, outputs, new U64(0));
        expect(tx.toBuf().toString("hex")).toEqual(
          "00010000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000064000000000000000000",
        );
        const hashCache1 = new HashCache();

        // Act
        const signature = tx.signWithCache(
          inputIndex,
          privateKey,
          script,
          amount,
          hashType,
          hashCache1,
        );

        // Assert
        const expectedSignatureHex =
          "01dd0236c4f662dab7e24985e394ceee9936bf316146e3dd5c4d26f20545acfcc20118c8e50e0402892ef6f7883270de48bb1c6f3719fd75a06bd7efe537f3397b"; // your expected signature in hex
        expect(SysBuf.from(signature.toBuf()).toString("hex")).toEqual(
          expectedSignatureHex,
        );
        const publicKey = KeyPair.fromPrivKeyEbxBuf(privateKey)

          .pubKey.toBuf();
        const hashCache2 = new HashCache();
        const result = tx.verifyWithCache(
          inputIndex,
          publicKey,
          signature,
          script,
          amount,
          hashCache2,
        );
        expect(result).toBe(true);
      });
    });
  });
});
