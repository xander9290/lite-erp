"use client";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

function ImageAvatar({ imageUrl }: { imageUrl: string | null }) {
  return (
    <Zoom>
      <Image
        unoptimized
        src={imageUrl ?? "/image/avatar_default.svg"}
        width={35}
        height={35}
        alt=""
        className="rounded"
      />
    </Zoom>
  );
}

export default ImageAvatar;
