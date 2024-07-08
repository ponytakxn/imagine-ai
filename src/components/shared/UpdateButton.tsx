
'use client'
import Link from "next/link";
import { Button } from "rewind-uikit";

const UpdateButton = ({ imageId }: { imageId: string }) => {
  return(
    <Button variant='solid' size='md' color="info" className="w-full bg-info/80">
      <Link href={`/transformations/${imageId}/update`}>
        Update Image
      </Link>
    </Button>
  )
}

export default UpdateButton