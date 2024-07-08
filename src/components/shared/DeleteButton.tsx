"use client";

import { useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button
} from "rewind-uikit";
import { deleteImage } from "@/lib/actions/image.actions";

export const DeleteButton = ({ imageId }: { imageId: string }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog>
      <DialogTrigger className="w-full rounded-full">
        <Button
          variant="solid"
          size="md"
          color="danger"
          className="w-full bg-destructive/80"
        >
          Delete Image
        </Button>
      </DialogTrigger>

      <div className="absolute top-20 z-30">
        <DialogContent className="p-10">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this image?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete this image
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-center">
            <Button
              variant="solid"
              size="md"
              color="danger"
              className="bg-destructive/80"
              onClick={() =>
                startTransition(async () => {
                  await deleteImage(imageId);
                })
              }
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
};