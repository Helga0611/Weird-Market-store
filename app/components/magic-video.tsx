"use client";

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260717_120352_eb988725-1351-43b3-8095-16e4a1005e3d.mp4";

export default function MagicVideo() {
  return <video className="hero-video magic-loop-video anim-fade" style={{ animationDelay: ".2s" }} muted autoPlay loop playsInline src={VIDEO_URL} />;
}
