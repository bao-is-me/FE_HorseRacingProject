import React, { useState } from "react";
import { Shield } from "lucide-react";

function HorseImage({ src, alt, size = "table" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`horse-image horse-image-${size} placeholder`} aria-label={`${alt || "Horse"} image unavailable`}>
        <Shield size={size === "hero" ? 34 : 22} />
      </div>
    );
  }

  return (
    <img
      className={`horse-image horse-image-${size}`}
      src={src}
      alt={alt || "Horse"}
      onError={() => setFailed(true)}
    />
  );
}

export default HorseImage;
