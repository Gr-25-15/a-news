"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { uploadImage } from "@/app/actions/upload";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneFileMessage,
  DropzoneTrigger,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneRetryFile,
  InfiniteProgress,
  useDropzone,
} from "@/components/ui/dropzone";

export interface SingleFileRef {
  uploadedImageUrl: string | undefined;
}

export const SingleFile = forwardRef<SingleFileRef, object>((props, ref) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(
    undefined,
  );

  useImperativeHandle(ref, () => ({
    uploadedImageUrl,
  }));

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImage(formData);
      if (result.success && result.url) {
        setUploadedImageUrl(result.url);
        return { status: "success", result: result.url };
      }
      throw new Error(result.error || "Upload failed");
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });

  return (
    <Dropzone {...dropzone}>
      <div className="flex justify-between">
        <DropzoneMessage />
      </div>
      {uploadedImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={uploadedImageUrl}
          alt="Uploaded avatar"
          className="w-32 h-32 object-cover rounded-full mx-auto"
        />
      ) : (
        <DropZoneArea>
          <DropzoneTrigger className="flex gap-8 bg-transparent text-sm">
            <div className="flex flex-col gap-1 font-semibold">
              <p>Upload a new avatar</p>
              <p className="text-xs text-muted-foreground">
                Please select an image smaller than 10MB
              </p>
            </div>
          </DropzoneTrigger>
        </DropZoneArea>
      )}
    </Dropzone>
  );
});

SingleFile.displayName = "SingleFile";
