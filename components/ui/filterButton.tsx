"use client";
import { FaFilter } from "react-icons/fa";


const DealsFilter = ({isOpen, updateState}) => {
  
    return (
      <div className="bg-gray-800 fixed bottom-10 right-10 p-2.5 rounded-md cursor-pointer hover:bg-gray-800/80 z-10" onClick={() => updateState(!isOpen)}>
        <FaFilter />
      </div>
    )
}

export default DealsFilter