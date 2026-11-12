"use client";

import { useEffect, useRef } from "react";

// Slower than real time, and plays forward then backward instead of
// restarting from the top, so the loop point is never visible as a jump cut.
const PLAYBACK_RATE = 0.6;
const FORWARD_SRC = "/video/auth-background.mp4";
// <video> has no native reverse playback, and faking it by stepping
// currentTime backward via requestAnimationFrame stalls badly on a
// long-GOP H.264 clip like this one (every backward step reseeks to the
// nearest keyframe and redecodes forward). A real pre-reversed clip, played
// forward like normal, avoids that entirely.
const REVERSE_SRC = "/video/auth-background-reversed.mp4";

export default function AuthBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reversedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = PLAYBACK_RATE;

    function handleEnded() {
      if (!video) return;
      reversedRef.current = !reversedRef.current;
      video.src = reversedRef.current ? REVERSE_SRC : FORWARD_SRC;
      video.playbackRate = PLAYBACK_RATE;
      video.play();
    }

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={FORWARD_SRC}
        autoPlay
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-background/75" />
    </div>
  );
}
