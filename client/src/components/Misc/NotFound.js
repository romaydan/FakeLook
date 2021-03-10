

const NotFound = props => {

    return (
        <div className='h-screen w-screen flex flex-col items-center'>
            <div className='flex flex-row items-end mt-auto mb-auto'>
                <h1 className='font-bold text-7xl text-blue-400'>Oops...</h1>
                <span className='font-bold text-2xl mb-2 ml-2 text-gray-500'>where are you going?</span>
            </div>
        </div>
    )
}

export default NotFound;