"use client"

import { InputLabel } from '@/components/inputs/InputLabel'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { type TSelectCustomerSchema } from '@/schemas/customer'
import { insertTicketSchema, type TInsertTicketSchema, type TSelectTicketSchema } from '@/schemas/ticket'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TextAreaLabel } from '@/components/inputs/TextAreaLabel'
import { SelectLabel } from '@/components/inputs/SelectLabel'
import { CheckboxLabel } from '@/components/inputs/CheckboxLabel'

type Props = {
  customer: TSelectCustomerSchema,
  ticket?: TSelectTicketSchema
}

export default function TicketForm({ customer, ticket }: Props) {
  const defaultValues: TInsertTicketSchema = {
    id: ticket?.id ?? '(New)',
    customerId: ticket?.customerId ?? customer.id,
    title: ticket?.title ?? '',
    description: ticket?.description ?? '',
    completed: ticket?.completed ?? false,
    tech: ticket?.tech ?? 'new-ticket@example.com',
  }

  const form = useForm<TInsertTicketSchema>({
    mode: 'onBlur',
    resolver: zodResolver(insertTicketSchema),
    defaultValues,
  })

  async function submitForm(data: TInsertTicketSchema) {
    console.log(data)
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <div>
        <h2 className="text-2xl font-bold">
          {ticket?.id ? `Edit Ticket # ${ticket.id}` : "New Ticket Form"}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col sm:flex-row gap-4 sm:gap-8"
        >
          <div className='flex flex-col gap-4 w-full max-w-xs'>
            <InputLabel<TInsertTicketSchema> fieldTitle='Title' nameInSchema='title' />

            <InputLabel<TInsertTicketSchema> fieldTitle='Tech' nameInSchema='tech' disabled={true} />

            <CheckboxLabel<TInsertTicketSchema> fieldTitle='Completed' nameInSchema='completed' message='Yes' />

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
            <TextAreaLabel<TInsertTicketSchema> fieldTitle='Description' nameInSchema='description' className='h-96' />

            <div className='flex gap-2'>
              <Button type='submit' className='w-3/4' variant='default' title='Save'>
                Save
              </Button>
              <Button type='button' variant='destructive' title='Reset' onClick={() => form.reset(defaultValues)}>
                Reset
              </Button>
            </div>
          </div>


        </form>
      </Form>

    </div>
  )
}