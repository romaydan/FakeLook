import axios from "axios";
const url = process.env.REACT_APP_SOCIAL_API_URL
export const getUsersGroup = (userId) => {
    console.log('url', url)
    return mockGroups;
}


const mockGroups = [
    { name: 'diy home', id: '87d5efa2-46ea-4604-86a6-b390f459ba74' },
    { name: 'hey 5 hach tovim', id: '665b9601-665c-4151-a1b3-9065ca4f13d0' },
    { name: 'mamazhik', id: '296c06b4-6101-420f-8f00-03566f867f5e' },
    { name: 'zorzors', id: '6e236027-bc8d-453f-88b9-6f6651739abc' },
];
