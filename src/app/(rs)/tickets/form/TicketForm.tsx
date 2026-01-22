"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { InputLabel } from '@/components/inputs/InputLabel'
import { TextAreaLabel } from '@/components/inputs/TextAreaLabel'
import { SelectLabel } from '@/components/inputs/SelectLabel'
import { CheckboxLabel } from '@/components/inputs/CheckboxLabel'
import { DisplayServerActionResponse } from '@/components/DisplayServerActionResponse'
import { saveTicketAction } from '@/app/actions/saveTicketAction'
import { type TSelectCustomerSchema } from '@/schemas/customer'
import { insertTicketSchema, type TInsertTicketSchema, type TSelectTicketSchema } from '@/schemas/ticket'

type Props = {
  customer: TSelectCustomerSchema,
  ticket?: TSelectTicketSchema,
  tech?: { id: string, description: string }[]
  isEditable?: boolean
  isManager?: boolean
}

export default function TicketForm({ customer, ticket, tech, isEditable = true, isManager = false }: Props) {
  const defaultValues: TInsertTicketSchema = {
    id: ticket?.id ?? '(New)',
    customerId: ticket?.customerId ?? customer.id,
    title: ticket?.title ?? '',
    description: ticket?.description ?? '',
    completed: ticket?.completed ?? false,
    tech: ticket?.tech.toLowerCase() ?? 'new-ticket@example.com',
  }

  const form = useForm<TInsertTicketSchema>({
    mode: 'onBlur',
    resolver: zodResolver(insertTicketSchema),
    defaultValues,
  })

  const {
    execute: saveTicket,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction,
  } = useAction(saveTicketAction, {
    onSuccess({ data }) {
      toast.success(data?.message)
    },
    onError() {
      toast.error('An error occurred while saving ticket')
    },
  })

  async function submitForm(data: TInsertTicketSchema) {
    saveTicket(data)
  }

  const getFormTitle = () => {
    if (!ticket?.id) return "New Ticket Form";
    if (isEditable) return `Edit Ticket # ${ticket.id}`;
    return `View Ticket # ${ticket.id}`;
  };

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <DisplayServerActionResponse result={saveResult} />
      <div>
        <h2 className="text-2xl font-bold">
          {getFormTitle()}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col sm:flex-row gap-4 sm:gap-8"
        >
          <div className='flex flex-col gap-4 w-full max-w-xs'>
            <InputLabel<TInsertTicketSchema> fieldTitle='Title' nameInSchema='title' disabled={!isEditable} />

            {isManager && tech ? (
              <SelectLabel<TInsertTicketSchema> fieldTitle='Tech ID' nameInSchema='tech' data={[{ id: 'new-ticket@example.com', description: 'new-ticket@example.com' }, ...tech]} />
            ) : (
              <InputLabel<TInsertTicketSchema> fieldTitle='Tech' nameInSchema='tech' disabled={true} />
            )}

            {ticket?.id ? (<CheckboxLabel<TInsertTicketSchema> fieldTitle='Completed' nameInSchema='completed' message='Yes' disabled={!isEditable} />) : null}

            <div className='mt-4 space-y-2'>
              <h3 className='text-lg'>Customer Info</h3>
              <hr className='w-4/5' />
              <p>{customer.firstName} {customer.lastName}</p>
              <p>{customer.address1}</p>
              {customer.address2 && <p>{customer.address2}</p>}
              <p>{customer.city}, {customer.state} {customer.zip}</p>
              <hr className='w-4/5' />
              <p>Email: {customer.email}</p>
              <p>Phone: {customer.phone}</p>
            </div>
          </div>

          <div className='flex flex-col gap-4 w-full max-w-xs'>
            <TextAreaLabel<TInsertTicketSchema> fieldTitle='Description' nameInSchema='description' className='h-96' disabled={!isEditable} placeholder='Ticket Description' />

            {
              isEditable ? (
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
              ) : null
            }
          </div>


        </form>
      </Form>

    </div>
  )
}