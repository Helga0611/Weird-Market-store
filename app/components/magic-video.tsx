"use client";

import { useCallback, useEffect, useRef } from "react";

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4";

export default function MagicVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const fadeTo = useCallback((target: number) => {
    const video = videoRef.current;
    if (!video) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const started = performance.now();
    const initial = Number(video.style.opacity || 0);
    const animate = (now: number) => {
      const progress = Math.min((now - started) / 500, 1);
      video.style.opacity = String(initial + (target - initial) * progress);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onCanPlay = () => fadeTo(1);
    const onTimeUpdate = () => {
      if (video.duration - video.currentTime <= .55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    };
    const onEnded = () => {
      video.style.opacity = "0";
      window.setTimeout(() => {
        video.currentTime = 0;
        fadingOutRef.current = false;
        void video.play();
        fadeTo(1);
      }, 100);
    };
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    void video.play().catch(() => {});
    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [fadeTo]);

  return <video ref={videoRef} className="hero-video magic-loop-video" muted autoPlay playsInline src={VIDEO_URL} />;
}
