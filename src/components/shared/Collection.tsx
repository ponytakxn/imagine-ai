'use client'
import { transformationTypes } from '@/constants'
import { IImage } from '@/lib/database/models/image.model'
import { formUrlQuery } from '@/lib/utils'
import { CldImage } from 'next-cloudinary'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Card, CardContent, CardFooter, Pagination } from 'rewind-uikit'
import { Search } from './Search'

export const Collection = ({
  hasSearch = false,
  images,
  totalPages = 1,
  page,
}: {
  images: IImage[];
  totalPages?: number;
  page: number;
  hasSearch?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // PAGINATION HANDLER
  const onPageChange = (pageNb: number) => {
    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageNb,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <>
      <div className="flex flex-col gap-5 lg:flex-between lg:flex-row mb-6">
        <h2 className="h2-bold text-dark-600">Recent Edits</h2>
        {hasSearch && <Search />}
      </div>

      {images.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => <CardComponent image={image} key={image._id as string} />)}
        </ul>
      ) : (
        <div className="collection-empty">
          <p className="p-20-semibold">Empty List</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination 
          slug='?page='
          totalPages={totalPages}
          page={page}
          handlePagination={onPageChange}
        />
      )}
    </>
  );
};

const CardComponent = ({ image } : { image: IImage }) => {
  return (
    <li>
      <Card className='collection-card'>
        <CardContent>
          <Link href={`/transformations/${image._id}`}>
            <CldImage 
              src={image.publicId}
              alt={image.title}
              width={image.width}
              height={image.height}
              {...image.config}
              loading="lazy"
              className="h-52 w-full rounded-[10px] object-cover"
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
            />
          </Link>
        </CardContent>
        <CardFooter className='flex-between'>
          <p className="p-20-semibold mr-3 line-clamp-1 text-priamry">
            {image.title}
          </p>
          <Image
            src={`/assets/icons/${transformationTypes[image.transformationType as TransformationTypeKey].icon}`}
            alt={image.title}
            width={24}
            height={24}
          />
        </CardFooter>
      </Card>
    </li>
  )
}
