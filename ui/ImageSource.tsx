"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Form } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  createImage,
  fetchImage,
  removeImage,
} from "@/app/actions/image-source-actions";

type TImageProps = {
  entityType: string;
  sourceId: string | null;
  getImageId?: (url: string) => void;
  remove?: boolean;
  height: number;
  width: number;
  editable?: boolean;
};

type TImageSource = {
  url: string | null;
  publicId: string | null;
  id: string | null;
};

function ImageSource({
  sourceId,
  entityType,
  getImageId,
  remove,
  width,
  height,
  editable,
}: TImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSource, setImageSource] = useState<TImageSource>({
    url: null,
    publicId: null,
    id: null,
  });

  const handleRemoveImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await removeImage({ publicId: imageSource.publicId });
    setImageSource({ url: null, publicId: null, id: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imageSource.url !== null) {
      toast.error("Elimina la imagen actual para editar");
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const toastId = toast.loading("Subiendo imagen", {
        position: "bottom-right",
      });
      const objectUrl = URL.createObjectURL(file);
      setImageSource({
        url: objectUrl,
        publicId: "",
        id: "",
      });
      const formData = new FormData();
      formData.append("image", file);
      const res = await createImage({ formData, entityType });
      if (res.success) {
        const { url, publicId, id } = res.data as TImageSource;
        setImageSource({ url, publicId, id });
        toast.success(res.message, { id: toastId });
        if (getImageId) {
          getImageId(id ?? "");
        }
      } else {
        toast.error(res.message, { id: toastId });
      }
    }
  };

  const getImages = async () => {
    if (!sourceId) {
      return {
        success: false,
        message: "",
      };
    }
    const res = await fetchImage({ id: sourceId });
    if (!res.success) {
      // toast.error(res.message);
      return;
    }

    if (res.data) {
      const getImage = res.data;
      const url = getImage?.url ?? null;
      const publicId = getImage?.publicId ?? null;
      const id = getImage.id;

      setImageSource({ url, publicId, id });
    }
  };

  useEffect(() => {
    getImages();
  }, [sourceId]);

  return (
    <div
      role="button"
      onClick={() => {
        if (editable) {
          fileInputRef.current?.click();
        }
      }}
      className="position-relative d-inline-block"
    >
      <Image
        src={imageSource.url ?? "/image/avatar_default.svg"}
        alt="user_image"
        className="img-fluid rounded border"
        width={width}
        height={height}
        unoptimized
        style={{
          cursor: "pointer",
          objectFit: "cover", // Hace que la imagen se recorte para llenar el contenedor
          width: `${width}px`,
          height: `${height}px`,
        }} // Cambia el cursor para indicar que es clickeable
      />
      {imageSource.url && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="btn btn-danger btn-sm rounded-circle position-absolute"
          style={{
            top: "-8px",
            right: "-8px",
            width: `25px`,
            height: `25px`,
            padding: 0,
            display: !remove ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
          }}
        >
          <i className="bi bi-trash-fill"></i>
        </button>
      )}
      <Form.Control
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImage}
        className="d-none" // Oculta el input
      />
    </div>
  );
}

export default ImageSource;
