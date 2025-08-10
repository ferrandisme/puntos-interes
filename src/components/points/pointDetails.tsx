"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
//import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';


import { useEffect, useState } from 'react';
import { Point } from "@/types";


export default function PointDetails(id: any)
{
    const [point, setPoint] = useState<Point>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPoint = async () => {
            const response = await fetch('/api/points/'+id.id);
            const data = await response.json();
            setPoint(data)
        };
    fetchPoint();
    }, []);

    return(
        <Card className="w-[350px]">
        <CardHeader style={{fontSize: '24px'}}>
            <CardTitle>{point?.name}</CardTitle>
        </CardHeader>
        <CardHeader style={{fontSize: '16px', textTransform:'uppercase', textAlign:'right'}}>{point?.category}</CardHeader>
        <CardDescription >{point?.author}</CardDescription>
        <CardContent >{point?.description}</CardContent>
        </Card>
    )
    
};