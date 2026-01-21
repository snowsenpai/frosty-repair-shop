import { Column } from '@tanstack/react-table'
import { DebouncedInput } from '@/components/react-table/DebouncedInput'

type FilterProps<TData> = {
  column: Column<TData, unknown>
}

export default function Filter<TData>({ column }: FilterProps<TData>) {
  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = Array.from(
    column.getFacetedUniqueValues().keys()
  ).sort()

  return (
    <>
      <datalist id={column.id + "-list"}>
        {sortedUniqueValues.map((value: any, i: number) => (
          <option value={value} key={`${i}-${column.id}`} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... ${column.getFacetedUniqueValues().size} values`}
        className="w-full border shadow rounded bg-card"
        // Add a list attribute for the datalist
        list={column.id + "-list"}
      />
    </>
  )
}