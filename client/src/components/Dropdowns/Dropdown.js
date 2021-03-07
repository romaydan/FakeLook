import { useState } from "react"


const Dropdown = props => {
    const { items, render, direction, title } = props;
    const [visibility, setVisibility] = useState(true);

    const changeVisibility = () => setVisibility(!visibility);

    return (
        <div class="relative inline-block text-left"
        onBlur={() => setVisibility(true)}>
            <div className='overflow-x-hidden overflow-y-hidden min-w-full max-w-lg'>
                <button type="button" class="inline-flex justify-center rounded-md border 
                border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-offset-gray-100 focus:ring-indigo-500"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                    onClick={changeVisibility}>
                    {title}
                    <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
                <div hidden={visibility} class={"z-10 origin-top-right absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 " + (direction === 'right' ? 'right-0' : 'left-0')}>
                    <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {
                            render ? render(items) : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dropdown;