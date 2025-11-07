import { Eye, EyeOff } from "lucide-react"
import { useState } from "react";
const Input = ({label, Icon, id, type, placeholder, ...props})=>{
  const [showPassword, setShowPassword] = useState(false);
    return(
        <div>
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-300"
              >
                {label}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {Icon &&
                    
                  <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    }
                </div>
                <input
                  id={id}
                  type={ showPassword ? "text" : type}
                  required
                 {...props}
                  className=" block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
              rounded-md shadow-sm 
               placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
               focus:border-emerald-500 sm:text-sm"
                  placeholder={placeholder}
                 
                />
                 {type === "password" && <span className="absolute inset-y-0 right-3 flex items-center text-gray-400" onClick={() => setShowPassword(prev => !prev)}>{showPassword ? <EyeOff  className="cursor-pointer" /> : <Eye className="cursor-pointer" />}</span>}
              </div>
            </div>
    )
}

export default Input