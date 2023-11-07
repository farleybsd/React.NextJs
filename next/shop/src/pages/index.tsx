import { HomeContainer, Product } from "@/styles/pages/home"
import Head  from 'next/head'
import { styled } from "../styles"
import camiseta1 from '../assets/camisetas/1.png'
import camiseta2 from '../assets/camisetas/2.png'
import camiseta3 from '../assets/camisetas/3.png'
import Link from 'next/link'
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import 'keen-slider/keen-slider.min.css'
import { stripe } from "@/lib/stripe"
import { GetServerSideProps } from "next"
import Stripe from "stripe"
interface HomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: number
  }[]
}

export default function Home({ products }: HomeProps) {

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })


  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      <Head>
        <title>Ignite Shop</title>
      </Head>
      {products.map(product => {
        return (
          <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
            <Product
              className="keen-slider__slide">
              <Image src={product.imageUrl} width={520} height={480} alt="" />
              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        )
      })}
    </HomeContainer>
  )
}
// Usar para pagagina estatica que nao server alteracoes constantes
// getStaticProps do next
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const response = await stripe.products.list({
    expand: ['data.default_price']
  });
  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price
    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price.unit_amount / 100 as number)
    }
  })
  return {
    props: {
      products
    }
  }
}