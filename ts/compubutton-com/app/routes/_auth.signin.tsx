import type { MetaFunction } from "@remix-run/node";
import Button from "../button";
import { Buffer } from "buffer";
import { blake3PowAsync, blake3Sync } from "earthbucks-blake3/src/blake3-async";
import Footer from "~/components/footer";
import { Link } from "@remix-run/react";
import { useState } from "react";
import PubKey from "earthbucks-lib/src/pub-key";
import PrivKey from "earthbucks-lib/src/priv-key";
import { classNames } from "~/util";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign in | Compubutton" },
    { name: "description", content: "Welcome to Compubutton!" },
  ];
};

export default function Signin() {
  const [publicKey, setPublicKey] = useState("");
  const [isPublicKeyValid, setIsPublicKeyValid] = useState<boolean | null>(
    null,
  );
  const [privateKey, setPrivateKey] = useState("");
  const [isPrivateKeyValid, setIsPrivateKeyValid] = useState<boolean | null>(
    null,
  );

  const validatePublicKey = (keyStr: string) => {
    return PubKey.isValidStringFmt(keyStr);
  };

  const validatePrivateKey = (keyStr: string) => {
    let isValidStrFmt = PrivKey.isValidStringFmt(keyStr);
    if (!isValidStrFmt) {
      return false;
    }
    let privKey = PrivKey.fromStringFmt(keyStr);
    let pubKey = PubKey.fromPrivKey(privKey);
    return pubKey.toStringFmt() === publicKey;
  };

  return (
    <div className="mx-auto max-w-[400px]">
      <div className="my-4 text-black dark:text-white">
        <p>
          Please save your key pair in localStorage (client-side browser
          storage) to sign in. (New here?{" "}
          <Link to="/register" className="underline">
            Register first
          </Link>
          .)
        </p>
      </div>
      <div className="my-4">
        <div className="relative my-2">
          <label htmlFor="public-key">
            <img
              src="/sun-128.png"
              alt="Sun"
              draggable="false"
              className="absolute left-[9px] top-[9px] h-[24px] w-[24px]"
            />
          </label>
          <input
            id="public-key"
            type="text"
            placeholder="Public Key"
            onChange={(e) => setPublicKey(e.target.value)}
            onBlur={() => {
              if (publicKey !== "") {
                setIsPublicKeyValid(validatePublicKey(publicKey));
              } else {
                setIsPublicKeyValid(null);
              }
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                e.preventDefault();
                (e.target as HTMLInputElement).blur();
              }
            }}
            value={publicKey}
            className={classNames(
              "w-full flex-grow overflow-hidden rounded-full border-[1px] border-gray-700 bg-white p-2 pl-[36px] text-gray-600 focus:border-primary-blue-500 focus:outline focus:outline-2 focus:outline-primary-blue-500 dark:border-gray-300 dark:bg-black dark:text-gray-400",
              isPublicKeyValid === null
                ? ""
                : isPublicKeyValid
                  ? "border-green-500"
                  : "border-red-500",
            )}
          />
        </div>
        <div className="relative my-2">
          <label htmlFor="private-key">
            <img
              src="/black-button-128.png"
              alt="Sun"
              draggable="false"
              className="absolute left-[9px] top-[9px] h-[24px] w-[24px]"
            />
          </label>
          <input
            type="password"
            id="private-key"
            placeholder="Private Key"
            onChange={(e) => setPrivateKey(e.target.value)}
            onBlur={() => {
              if (privateKey !== "") {
                setIsPrivateKeyValid(validatePrivateKey(privateKey));
              } else {
                setIsPrivateKeyValid(null);
              }
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                e.preventDefault();
                (e.target as HTMLInputElement).blur();
              }
            }}
            className={classNames(
              "w-full flex-grow overflow-hidden rounded-full border-[1px] border-gray-700 bg-white p-2 pl-[36px] text-gray-600 focus:border-primary-blue-500 focus:outline focus:outline-2 focus:outline-primary-blue-500 dark:border-gray-300 dark:bg-black dark:text-gray-400",
              isPrivateKeyValid === null
                ? ""
                : isPrivateKeyValid
                  ? "border-green-500"
                  : "border-red-500",
            )}
          />
        </div>
      </div>
      <div className="mx-auto my-4 w-[320px]">
        {isPrivateKeyValid === true && isPublicKeyValid === true ? (
          <Button key={"save-enabled"} initialText="Save" />
        ) : (
          <Button key={"save-disabled"} initialText="Save" disabled />
        )}
      </div>
      <div className="mx-auto my-4 w-[320px]">
        <Button initialText="Sign in" mode="secret" disabled />
      </div>
    </div>
  );
}
