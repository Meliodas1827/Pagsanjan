import { Card, CardContent } from "../../../components/ui/card"
import { Image, User2, Star } from "lucide-react"

export default function CardFeedback() {
    return (
        <div className="flex flex-wrap gap-2">
            <Card>
                <CardContent>
                    <div className="flex flex-col gap-2 items-center justify-center my-4 bg-blue-200 p-2 rounded-2xl">
                        <Image size={96} />
                        <span className="text-center text-sm font-bold">
                            Place Title
                        </span>
                    </div>

                    <div className="max-w-[280px] p-2">
                        <div className="flex flex-row items-center gap-8">
                            <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center">
                                <User2 size={26} />
                            </div>
                            <div className="flex flex-col text-sm">
                                <h1>
                                    Juan Dela Cruz
                                </h1>
                                <span>
                                    10-20-25
                                </span>
                            </div>
                        </div>

                        <p className="mt-3 text-sm ">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati distinctio fuga unde sint fugiat amet cupiditate, alias eius doloremque sed nobis quidem, inventore modi. Et dolorum laudantium omnis eius officia?
          
                        </p>

                        <div className="my-4">
                            <div className="flex flex-row gap-2 items-center justify-center">
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}