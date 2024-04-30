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

  const [isSaved, setIsSaved] = useState(false);
  async function saveToLocalStorage() {
    let privKey = PrivKey.fromStringFmt(privateKey);
    let pubKey = PubKey.fromPrivKey(privKey);
    let privKeyHex = privKey.toHex();
    let pubKeyHex = pubKey.toHex();
    localStorage.setItem("privKey", privKeyHex);
    localStorage.setItem("pubKey", pubKeyHex);
    setIsSaved(true);
  }

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
            disabled={isSaved}
            onChange={(e) => setPublicKey(e.target.value.trim())}
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
              "w-full flex-grow overflow-hidden rounded-full border-[1px] bg-white p-2 pl-[36px] text-gray-600 focus:border-primary-blue-500 focus:outline focus:outline-2 focus:outline-primary-blue-500 dark:bg-black dark:text-gray-400",
              isPublicKeyValid === null
                ? "border-secondary-blue-500 outline outline-2 outline-secondary-blue-500"
                : isPublicKeyValid
                  ? "border-secondary-blue-500 outline outline-2 outline-secondary-blue-500"
                  : "border-red-500 outline outline-2 outline-red-500",
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
            disabled={isSaved}
            onChange={(e) => setPrivateKey(e.target.value.trim())}
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
              "w-full flex-grow overflow-hidden rounded-full border-[1px] bg-white p-2 pl-[36px] text-gray-600 focus:border-primary-blue-500 focus:outline focus:outline-2 focus:outline-primary-blue-500 dark:bg-black dark:text-gray-400",
              isPrivateKeyValid === null
                ? "border-secondary-blue-500 outline outline-2 outline-secondary-blue-500"
                : isPrivateKeyValid
                  ? "border-secondary-blue-500 outline outline-2 outline-secondary-blue-500"
                  : "border-red-500 outline outline-2 outline-red-500",
            )}
          />
        </div>
      </div>
      <div className="mx-auto my-4 w-[320px]">
        <Button
          key={"save-disabled"}
          initialText="Save"
          computingText="Saving..."
          successText="Saved!"
          disabled={!isPrivateKeyValid || !isPublicKeyValid}
          onComputing={saveToLocalStorage}
        />
      </div>
      <div className="mx-auto my-4 w-[320px]">
        <Button initialText="Sign in" mode="secret" disabled={!isSaved} />
      </div>
    </div>
  );
}
