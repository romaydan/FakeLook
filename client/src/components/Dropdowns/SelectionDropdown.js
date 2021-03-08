import { useEffect, useState } from "react";
import { AiOutlineCheck } from 'react-icons/ai'
import '../../css/scrollbar.css';

const SelectionDropdown = props => {
  const { items, placeholder, onSelected, onDeselected, direction, reset, propertykey } = props;

  const [selectedCount, setSelectedCount] = useState(0);
  const [visibility, setVisibility] = useState(true);
  const [displayItems, setDisplayItems] = useState(items?.map(item => ({ isSelected: false, ...item })));

  const changeVisibility = () => {
    setVisibility(!visibility);
  }

  const itemSelected = (item, index) => {
    item.isSelected = !item.isSelected;
    item.isSelected ? onSelected(item) : onDeselected(item);
    displayItems[index] = item;

    setSelectedCount((item.isSelected ? 1 : -1) + selectedCount);
    setDisplayItems([...displayItems]);
  }

  useEffect(() => {
    if(reset) {
      setVisibility(false);
      setSelectedCount(0);
      setDisplayItems(items?.map(item => ({ isSelected: false, ...item })));
    }
  }, [reset])

  return (
    <div class="relative inline-block text-left">
      <div className='overflow-x-hidden overflow-y-hidden min-w-full max-w-lg'>
        <button type="button" class="inline-flex justify-center rounded-md border 
    border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 
    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
    focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={changeVisibility}>
          {selectedCount ? selectedCount + ' Selected' : placeholder}
          <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <div hidden={visibility} class={"z-10 origin-top-right absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 " + (direction === 'right' ? 'right-0' : 'left-0')}>
        <div class="py-1 overflow-y-auto max-h-52 overflow-x-hidden scrollbar-a scrollbar-right-curve" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          {
            displayItems?.map((item, index) => <div key={index} className='flex flex-row items-center m-1.5 hover:bg-gray-100'>
              <AiOutlineCheck size={25} className={item.isSelected ? 'fill-check-green' : 'fill-transparent'} />
              <span
                class="block px-4 py-2 text-sm text-gray-700 hover:text-gray-900
              cursor-pointer"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  itemSelected(item, index);
                }}>{propertykey ? item[propertykey] : item}</span>
            </div>)
          }
        </div>
      </div>
    </div>
  )
}

const scrollbarStyle = {

}

export default SelectionDropdown;