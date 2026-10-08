import { Switch } from '@headlessui/react'
import { type DevTreeLink } from "../types/index"
interface DevTreeProps {
  item: DevTreeLink
  onChangeInput: (
    e: React.ChangeEvent<HTMLInputElement> | boolean,
    name?: string
  ) => void
}
export default function DevTreeInput({ item, onChangeInput}: DevTreeProps) {
  
  return (
    <div className="bg-white shadow-sm p-5 flex items-center gap-3">
      <div
        className="w-12 h-12 bg-cover"
        style={{
          backgroundImage: `url('/social/icon_${item.name}.svg')`
        }}
      >

      </div>
      <input
        type="text"
        value={item.url}
        className="flex-1 border border-gray-300 rounded-lg"
        onChange={(e)=>{onChangeInput(e)}}
        name={item.name}

      />
      <Switch
        checked={item.enabled}
        onChange={(e)=>{onChangeInput(e, item.name)}}
        name={item.name}
        className={`inline-flex h-6 w-11 items-center rounded-full transition ${item.enabled ? "bg-blue-600" : "bg-gray-200"
          }`}
      >
        <span
          className={`size-4 rounded-full bg-white transition-transform ${item.enabled ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </Switch>
    </div>
  )
}