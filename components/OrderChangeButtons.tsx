"use client"
import { Button } from "@/components/ui/button"

import React from "react"

export default function OrderChangeButtons() {
    return (
        <div className="absolute  bottom-4 right-4">
            <Button className="mr-2">2</Button>
            <Button className="mr-2">1</Button>
            <Button className="mr-2" >3</Button>
            <Button className="mr-2" >4</Button>
            <Button value={'test'} className="mr-2" >5</Button>
            <Button className="mr-2" >6</Button>
            <Button className="mr-2" >7</Button>
            <Button className="mr-2" >8</Button>
            <Button className="mr-2" >9</Button>
            <Button className="mr-2" >10</Button>
        </div>

    )
}

