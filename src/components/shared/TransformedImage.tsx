'use client'
import { dataUrl, debounce, download, getImageSize } from '@/lib/utils'
import { CldImage, getCldImageUrl } from 'next-cloudinary'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import React from 'react'
import { Button } from 'rewind-uikit'

const TransformedImage = ({
  image,
  type,
  title,
  transformationConfig,
  isTransforming,
  setIsTransforming,
  hasDownload = false,
}: TransformedImageProps) => {
  const downloadHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    download(getCldImageUrl({
      width: image?.width,
      height: image?.height,
      src: image?.publicId,
      ...transformationConfig
    }), title)
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className="flex-between">
        <h3 className="h3-bold text-primary">
          Transformed
        </h3>

        {hasDownload && (
          <Button
            variant='outline'
            size='sm'
            color='secondary'
            className='border-primary/50 flex gap-2 text-primary items-center'
            onClick={(e) => {downloadHandler(e)}}
          >
            Download
            <Image 
              src="/assets/icons/download.svg"
              alt='Download image'
              width={24}
              height={24}
              className='pb-1.5'
            />
          </Button>
        )}
      </div>

      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage 
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            src={image?.publicId}
            alt={image?.title}
            sizes={"(max-width: 767px) 100vw, 50vw"}
            placeholder={dataUrl as PlaceholderValue}
            className='media-uploader_cldImage'
            onLoad={() => setIsTransforming && setIsTransforming(false)}
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false)
              }, 8000)()
            }}
            {...transformationConfig}
          />

          {isTransforming && (
            <div className='transforming-loader'>
              <Image 
                src='/assets/icons/spinner.svg'
                alt='spinner'
                width={50}
                height={50}
              />
              <p className='text-secondary'>Please wait...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">
          Transformed Image
        </div>
      )}
    </div>
  )
}

export default TransformedImage