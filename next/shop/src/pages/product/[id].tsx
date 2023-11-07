import { stripe } from '@/lib/stripe';
import { ImageContainer, ProductContainer, ProductDetails } from '@/styles/pages/product';
import axios from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { json } from 'stream/consumers';
import Stripe from 'stripe';

interface ProductProps {
    product: {
        id: string
        name: string
        imageUrl: string
        price: string
        description: string
        defaultPriceId: string
    }

}

export default function Product({ product }: ProductProps) {

    const router = useRouter()
    const [isCreatingCheckoutSession, setisCreatingCheckoutSession] = useState(false)

    async function handleBuyProduct() {

        try {
            setisCreatingCheckoutSession(true)
            const response = await axios.post('/api/checkout', {
                priceId: product.defaultPriceId
            })
            //router.push('/checkout');
            const { checkoutUrl } = response.data
            window.location.href = checkoutUrl;
        } catch (error) {
            setisCreatingCheckoutSession(false)
        }
    }

    return (
        <>
            <Head>
                <title>{product.name} | Ignite Shop</title>
            </Head>
            <ProductContainer>
                <ImageContainer>
                    <Image src={product.imageUrl} width={520} height={480} alt='teste' />
                </ImageContainer>
                <ProductDetails>
                    <h1>{product.name}</h1>
                    <span>{product.price}</span>
                    <p>{product.description}</p>
                    <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>
                        Compra Agora
                    </button>
                </ProductDetails>
            </ProductContainer>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            { params: { id: 'prod_OsWR3L9ADg5TvK' } }
        ],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const productId = String(params?.id);
    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price'],
    })
    const price = product.default_price as Stripe.Price

    return {
        props: {
            product: {
                id: product.id,
                name: product.name,
                imageUrl: product.images[0],
                price: new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(price.unit_amount as number / 100),
                description: product.description,
                defaultPriceId: price.id
            }
        },
        revalidate: 60 * 60 * 1 // 1 hours
    }
}