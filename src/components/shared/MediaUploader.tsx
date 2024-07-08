'use client'
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useToast } from '../ui/use-toast';
import { dataUrl, getImageSize } from '@/lib/utils';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';

type MediaUploaderProps = {
  onValueChange: (value: string) => void
  setImage: React.Dispatch<any>
  image: any
  publicId: string
  type: string
}

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type
}: MediaUploaderProps) => {
  const { toast } = useToast()

  const onUploadSuccessHandler = (result: any) => {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url
    }))

    onValueChange(result?.info?.public_id)

    toast({
      title: 'Image uploaded succesfully',
      description: '1 credit used.',
      duration: 5000,
      className: 'bg-success text-primary'
    })
  }

  const onUploadErrorHandler = (error: any) => {
    toast({
      title: 'An error occured while uploading image',
      description: 'Please try again',
      duration: 5000,
      className: 'bg-destructive text-white'
    })
  }

  return (
    <CldUploadWidget 
      uploadPreset="jsm_imagine"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => {
        return (
          <div className='flex flex-col gap-3'>
            <h3 className='h3-bold text-primary'>
              Original
            </h3>

            {publicId ? (
              <>
                <div className="cursor-pointer overflow-hidden">
                  <CldImage 
                    width={getImageSize(type, image, "width")}
                    height={getImageSize(type, image, "height")}
                    src={publicId}
                    alt='image'
                    sizes={"(max-width: 767px) 100vw, 50vw"}
                    placeholder={dataUrl as PlaceholderValue}
                    className='media-uploader_cldImage'
                  />
                </div>
              </>
            ): (
              <div className='media-uploader_cta' onClick={() => open()}>
                <div className='media-uploader_cta-image'>
                  <Image 
                    src="/assets/icons/add.svg"
                    alt='Add image'
                    width={24}
                    height={24}
                  />
                </div>
                <p>Click here to upload image</p>
              </div>
            )}

          </div>
        );
      }}
    </CldUploadWidget>
  )  
}

export default MediaUploader;