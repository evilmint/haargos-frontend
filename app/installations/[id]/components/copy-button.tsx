import { Icons } from "@/components/icons";
import React, { useState } from "react";

export default function CopyButton({ textToCopy = 'Copy default' }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        // setCopied(true);
        // // changing back to default state after 2 seconds.
        // setTimeout(() => {
        //   setCopied(false);
        // }, 2000);
      },
      (err) => {
        console.log("failed to copy", err.mesage);
      }
    );
  };

  const btnStyle = copied ? "bg-gray-500 text-white" : "";

  return (
    <div className="text-center my-5 text-gray-200 mt-1 absolute z-20 right-10">
      <button
        onClick={copyToClipboard}
        className={
          btnStyle +
          "rounded p-2 transition"
        }
      >
        {copied ? "Copied" : <Icons.copy />}
      </button>
    </div>
  );
}
