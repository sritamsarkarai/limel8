"use client";

import { AppProgressBar } from "next-nprogress-bar";

export function ProgressBar() {
  return (
    <>
      <style>{`
        #nprogress .bar {
          background: linear-gradient(to right, #22d3ee, #a78bfa) !important;
          box-shadow: 0 0 8px rgba(34,211,238,0.6), 0 0 2px rgba(167,139,250,0.4) !important;
        }
        #nprogress .peg {
          box-shadow: 0 0 10px #22d3ee, 0 0 5px #22d3ee !important;
        }
      `}</style>
      <AppProgressBar
        height="2px"
        color="#22d3ee"
        options={{ showSpinner: false, trickleSpeed: 200 }}
        shallowRouting
      />
    </>
  );
}
