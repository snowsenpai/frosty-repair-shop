"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { insertCustomerSchema, type TInsertCustomerSchema, type TSelectCustomerSchema } from '@/schemas/customer'
import { InputLabel } from '@/components/inputs/InputLabel'
import { TextAreaLabel } from '@/components/inputs/TextAreaLabel'
import { SelectLabel } from '@/components/inputs/SelectLabel'
import { StatesArray } from '@/constants/StatesArray'
import { CheckboxLabel } from '@/components/inputs/CheckboxLabel'
import { useAction } from 'next-safe-action/hooks'
import { saveCustomerAction } from '@/app/actions/saveCustomerAction'
import { DisplayServerActionResponse } from '@/components/DisplayServerActionResponse'

type Props = {
  customer?: TInsertCustomerSchema
  isManager?: boolean
}

export default function CustomerForm({ customer, isManager = false }: Props) {
  const searchParams = useSearchParams()
  const hasCustomerIdParam = searchParams.has('customerId')

  const emptyCustomerValues: TInsertCustomerSchema = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
    active: true,
  }

  const defaultValues: TInsertCustomerSchema = hasCustomerIdParam ? {
    id: customer?.id ?? 0,
    firstName: customer?.firstName ?? '',
    lastName: customer?.lastName ?? '',
    email: customer?.email ?? '',
    phone: customer?.phone ?? '',
    address1: customer?.address1 ?? '',
    address2: customer?.address2 ?? '',
    city: customer?.city ?? '',
    state: customer?.state ?? '',
    zip: customer?.zip ?? '',
    notes: customer?.notes ?? '',
    active: customer?.active ?? true,
  } : emptyCustomerValues

  const form = useForm<TInsertCustomerSchema>({
    mode: 'onBlur',
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  })

  useEffect(() => {
    form.reset(hasCustomerIdParam ? defaultValues : emptyCustomerValues)
  }, [searchParams.get('customerId')]) // eslint-disable-line react-hooks/exhaustive-deps

  // renamed to avoid conflict if another action is ever added
  const {
    execute: saveCustomer,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction,
  } = useAction(saveCustomerAction, {
    onSuccess({ data }) {
      // toast the user
      toast.success(data.message)
    },
    onError({ error }) {
      // toast the user
      toast.error('An error occurred while saving customer')
    },
  })

  async function submitForm(data: TInsertCustomerSchema) {
    // console.log(data)
    saveCustomer(data)
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <DisplayServerActionResponse result={saveResult} />
      <div>
        <h2 className="text-2xl font-bold">
          {customer?.id ? "Edit" : "New"} Customer {customer?.id ? `#${customer.id}` : "Form"}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col md:flex-row gap-4 md:gap-8"
        >
          <div className='flex flex-col gap-4 w-full max-w-xs'>
            <InputLabel<TInsertCustomerSchema> fieldTitle='First Name' nameInSchema='firstName' />

            <InputLabel<TInsertCustomerSchema> fieldTitle='Last Name' nameInSchema='lastName' />

            <InputLabel<TInsertCustomerSchema> fieldTitle='Address 1' nameInSchema='address1' />

            <InputLabel<TInsertCustomerSchema> fieldTitle='Address 2' nameInSchema='address2' />

            <InputLabel<TInsertCustomerSchema> fieldTitle='City' nameInSchema='city' />

            <SelectLabel<TSelectCustomerSchema>
              fieldTitle='State'
              nameInSchema='state'
              data={StatesArray}
            />

          </div>

          <div className='flex flex-col gap-4 w-full max-w-xs'>
            <InputLabel<TInsertCustomerSchema> fieldTitle='Zip Code' nameInSchema='zip' />

            <InputLabel<TInsertCustomerSchema> fieldTitle='Email' nameInSchema='email' />

            <InputLabel<TInsertCustomerSchema> fieldTitle='Phone Number' nameInSchema='phone' />

            <TextAreaLabel<TInsertCustomerSchema> fieldTitle='Notes' nameInSchema='notes' className='h-40' />

            {/* Client side approach to conditionally render the Active checkbox based on user role */}
            {isManager && customer?.id ?
              (
                <CheckboxLabel<TInsertCustomerSchema> fieldTitle='Active' nameInSchema='active' message='Yes' />
              ) : null
            }

            <div className='flex gap-2'>
              <Button type='submit' className='w-3/4' variant='default' title='Save' disabled={isSaving}>
                {isSaving ? (
                  <>
                    <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>) : 'Save'
                }
              </Button>
              <Button type='button' variant='destructive' title='Reset'
                onClick={() => {
                  form.reset(defaultValues)
                  resetSaveAction()
                }}
              >
                Reset
              </Button>
            </div>
          </div>


        </form>
      </Form>

    </div>
  )
}