"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from "rewind-uikit";

export const InsufficientCreditsModal = () => {
  const router = useRouter();

  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <div className="flex-between">
            <p className="p-16-semibold text-primary/70">Insufficient Credits</p>
            <Button
              className="border-0 p-0 hover:bg-transparent"
              onClick={() => router.push("/profile")}
            >
              <Image
                src="/assets/icons/close.svg"
                alt="credit coins"
                width={34}
                height={34}
                className="cursor-pointer"
              />
            </Button>
          </div>

          <Image
            src="/assets/images/stacked-coins.png"
            alt="credit coins"
            width={462}
            height={122}
            className="self-center"
          />

          <DialogTitle className="p-24-bold text-dark-600">
            Oops.... Looks like you&#39;ve run out of free credits!
          </DialogTitle>

          <DialogDescription className="p-16-regular py-3">
            No worries, though - you can keep enjoying our services by grabbing
            more credits.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            size="md"
            variant="outline"
            color="danger"
            className="w-full"
            onClick={() => router.push("/profile")}
          >
            No, Cancel
          </Button>
          <Button
            size="md"
            variant="solid"
            color="info"
            className="w-full"
            onClick={() => router.push("/credits")}
          >
            Yes, Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};