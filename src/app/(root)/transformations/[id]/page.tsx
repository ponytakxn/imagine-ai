import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

import Header from "@/components/shared/Header";
import TransformedImage from "@/components/shared/TransformedImage";
import { getImageById } from "@/lib/actions/image.actions";
import { getImageSize } from "@/lib/utils";
import UpdateButton from "@/components/shared/UpdateButton";
import { DeleteButton } from "@/components/shared/DeleteButton";

const ImageDetails = async ({ params: { id } }: SearchParamProps) => {
  const { userId } = auth();

  const image = await getImageById(id);

  return (
    <>
      <Header title={image.title} />

      <section className="mt-5 flex flex-wrap gap-4">
        <div className="p-14-medium md:p-16-medium flex gap-2">
          <p className="text-primary">Transformation:</p>
          <p className=" capitalize text-info">
            {image.transformationType}
          </p>
        </div>

        {image.prompt && (
          <>
            <p className="hidden text-primary/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2 ">
              <p className="text-primary">Prompt:</p>
              <p className=" capitalize text-info">{image.prompt}</p>
            </div>
          </>
        )}

        {image.color && (
          <>
            <p className="hidden text-primary/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="text-primary">Color:</p>
              <p className="capitalize text-info">{image.color}</p>
            </div>
          </>
        )}

        {image.aspectRatio && (
          <>
            <p className="hidden text-primary/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="text-primary">Aspect Ratio:</p>
              <p className=" capitalize text-info">{image.aspectRatio}</p>
            </div>
          </>
        )}
      </section>

      <section className="mt-10 border-t border-primary/15">
        <div className="grid h-fit min-h-[200px] grid-cols-1 gap-5 py-8 md:grid-cols-2">
          {/* MEDIA UPLOADER */}
          <div className="flex flex-col gap-4">
            <h3 className="h3-bold text-primary">Original</h3>

            <Image
              width={getImageSize(image.transformationType, image, "width")}
              height={getImageSize(image.transformationType, image, "height")}
              src={image.secureURL}
              alt="image"
              className="h-fit min-h-72 w-full border border-primary/20 bg-info/20 object-cover p-2"
            />
          </div>

          {/* TRANSFORMED IMAGE */}
          <TransformedImage
            image={image}
            type={image.transformationType}
            title={image.title}
            isTransforming={false}
            transformationConfig={image.config}
            hasDownload={true}
          />
        </div>

        {userId === image.author.clerkId && (
          <div className="mt-4 space-y-4">
            <UpdateButton imageId={image._id} />
            <DeleteButton imageId={image._id} />
          </div>
        )}
      </section>
    </>
  );
};

export default ImageDetails;