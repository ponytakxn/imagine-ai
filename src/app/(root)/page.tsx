import { Collection } from '@/components/shared/Collection'
import HeroBanner from '@/components/shared/HeroBanner'
import { getAllImages } from '@/lib/actions/image.actions'
import React from 'react'

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1
  const searchQuery = (searchParams?.query as string) || ''

  const images = await getAllImages({ page, searchQuery })

  return (
    <main className='flex flex-col gap-8'>
      <HeroBanner />

      <section>
        <Collection 
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPages}
          page={page}
        />
      </section>
    </main>
  )
}

export default Home