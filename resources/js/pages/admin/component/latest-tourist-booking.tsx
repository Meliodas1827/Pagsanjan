
import { Card, CardContent, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { FilterIcon, Ellipsis, Image } from "lucide-react"
export default function LatestBookingCard() {
    const items = [
        {
            title: "Title 1",
            redText: "Some words 1",
            blueText: "Some words | More words"
        },
        {
            title: "Title 2",
            redText: "Some words 2",
            blueText: "Another | Another"
        },
        {
            title: "Title 3",
            redText: "Special note",
            blueText: "Info | More info"
        }
    ];
    return (
        <Card >
            <CardContent>
                <div className="flex flex-row items-center justify-between mb-8">
                    <div className="flex flex-col">
                        <CardTitle >
                            Latest Tourist Bookings
                        </CardTitle>
                        <span className="text-sm">From: 10/05/2025 to 10/10/2025</span>

                    </div>


                    <Button variant={'outline'} size={'sm'} className="cursor-pointer">
                        <FilterIcon />
                        Filter by date
                    </Button>
                </div>

                {items.map((item, index) => (
                    <div className="grid grid-cols-4 my-4 mx-4" key={index}>
                        <div className="h-20 w-25 bg-slate-200 rounded-2xl flex items-center justify-center">
                            <Image size={40} />
                        </div>
                        <div className="col-span-2">
                            <h1 className="font-bold mb-2">
                                {item.title}
                            </h1>
                            <h1 className="font-extralight text-sm mb-2 text-red-600">
                                {item.redText}
                            </h1>
                            <h1 className="font-extralight text-sm mb-2 text-blue-600">
                                {item.blueText}
                            </h1>
                        </div>
                        <div className="flex items-center justify-end">
                            < Ellipsis />

                        </div>
                    </div>
                ))}




            </CardContent>
        </Card>
    )
}