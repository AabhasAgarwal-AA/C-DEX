
export function Greeting({ image, name }: {
        image: string,
        name: string
    }) {
    return <div className="flex p-12">
        <img src={image} className="rounded-full w-16 h-16 mr-4" />
        <div className="text-2xl font-semibold flex flex-col justify-center">
            {name}
        </div>
    </div>
}