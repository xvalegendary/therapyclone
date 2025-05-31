import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

   
    const product = {
      id: productId,
      name: "SDFM Classic Black",
      description:
        "Our signature hoodie in classic black. Made from premium cotton blend for ultimate comfort and style.",
      price: 149.99,
      image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
      image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error in product details route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
