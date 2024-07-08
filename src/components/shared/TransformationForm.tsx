"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Form } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button, Input } from "rewind-uikit"

import React, { useEffect, useState, useTransition } from 'react'
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { AspectRatioKey, debounce, deepMergeObjects, handleError } from "@/lib/utils"
import { updateCredits } from "@/lib/actions/user.actions"
import CustomField from "./CustomField"
import MediaUploader from "./MediaUploader"
import TransformedImage from "./TransformedImage"
import { getCldImageUrl } from "next-cloudinary"
import { addImage, updateImage } from "@/lib/actions/image.actions"
import { useRouter } from "next/navigation"
import { InsufficientCreditsModal } from "./InsufficientCreditsModal"

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string()
})

const TransformationForm = ({ action, data = null, userId, type, config, creditBalance} : TransformationFormProps) => {
  const transformationType = transformationTypes[type]

  const [image, setImage] = useState(data)
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformationConfig, setTransformationConfig] = useState<Transformations | null | undefined>(config)

  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const initialValues = data && action === "Update" ? {
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,
  } : defaultValues
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    if(data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig
      })

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color
      }

      if(action === "Add") {
        try{
          const newImage = await addImage({
            image: imageData,
            userId,
            path: '/' 
          })

          if(newImage) {
            form.reset()
            setImage(data)
            router.push(`/transformations/${newImage._id}`)
          }

        } catch (error) {
          handleError(error)
        }
      }

      if(action === "Update") {
        try{
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data._id
            },
            userId,
            path: `/transformations/${data._id}` 
          })

          if(updatedImage) {
            router.push(`/transformations/${updatedImage._id}`)
          }
          
        } catch (error) {
          handleError(error)
        }
      }

      setIsSubmitting(false)
    }
  }

  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey]

    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height
    }))

    setNewTransformation(transformationType.config)

    return onChangeField(value)
  }

  const onInputChangeHandler = (
    fieldName: string, value: string, type: string, onChangeField: (value: string) => void
  ) => {
    debounce(() => {
      setNewTransformation((prevState:any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === 'prompt' ? 'prompt' : 'to']: value
        } 
      }))
    }, 1000)()

    return onChangeField(value)
  }

  const onTransformHandler = async () => {
    setIsTransforming(true)

    setTransformationConfig(deepMergeObjects(newTransformation, transformationConfig))

    setNewTransformation(null)

    startTransition(async() => {
      await updateCredits(userId, creditFee)
    })
  }

  useEffect(() => {
    if(image && (type === 'restore' || type === 'removeBackground')) {
      setNewTransformation(transformationType.config)
    }
  }, [image, transformationType.config, type])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
        <CustomField 
          control={form.control}
          name='title'
          formLabel='Image Title'
          className="w-full flex flex-col"
          render= {({ field }) => (
            <Input {...field} placeholder="Title" className="input-field" />
          )}
        />

        { type === 'fill' && (
          <CustomField
            control = {form.control}
            name='aspectRatio'
            formLabel="Aspect Ratio"
            className="w-full flex flex-col"
            render={({ field }) => (
              <Select
                onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {Object.keys(aspectRatioOptions).map(key => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }    
          />
        )}

        {(type === 'remove' || type === 'recolor') && (
          <div className="flex flex-col gap-5 md:flex-row md:gap-8">
            <CustomField
              control={form.control}
              name='prompt'
              formLabel={
                type === 'remove' ? 'Object to remove' : 'Object to recolor'
              }
              className="w-full flex flex-col"
              render={({ field }) => (
                <Input 
                  {...field}
                  className="input-field"
                  value={field.value}
                  onChange={(e) => onInputChangeHandler(
                    'prompt',
                    e.target.value,
                    type,
                    field.onChange
                  )}  
                />
              )}
            />

            {type === 'recolor' && (
              <CustomField
                control={form.control}
                name='color'
                formLabel='Replacement Color'
                className="w-full"
                render={({ field }) => (
                  <Input 
                    {...field}
                    className="input-field flex flex-col"
                    value={field.value}
                    onChange={(e) => onInputChangeHandler(
                      'color',
                      e.target.value,
                      'recolor',
                      field.onChange
                    )}  
                  />
                )}
              ></CustomField>
            )}
          </div>
        )}

        <div className="grid h-fit min-h-[200px] grid-cols-1 gap-5 py-4 md:grid-cols-2">
          <CustomField 
            control={form.control}
            name='publicId'
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader 
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />

          <TransformedImage
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Button
            variant='solid' 
            size='md' 
            color='secondary' 
            type="button"
            className="w-full max-w-[727px]"
            disabled={isSubmitting || newTransformation === null}
            onClick={onTransformHandler}
          >
            {isTransforming ? 'Transforming...' : 'Transform'}
          </Button>
          <Button 
            variant='solid' 
            size='md' 
            color='info' 
            type="submit"
            className="w-full max-w-[727px] bg-info/80"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Save Image'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default TransformationForm