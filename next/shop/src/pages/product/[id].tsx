import { ImageContainer, ProductContainer, ProductDetails } from '@/styles/pages/product';
import { useRouter } from 'next/router';
import { json } from 'stream/consumers';

export default function Product() {
    const { query } = useRouter();
    return (
        <ProductContainer>
            <ImageContainer>
               
            </ImageContainer>
            <ProductDetails>
                    <h1>Camiseta x</h1>
                    <span>R$ 5,00</span>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia, voluptate nemo laudantium dolores quidem itaque, veniam qui beatae assumenda quasi exercitationem ut aliquam reprehenderit eius iure quos voluptatem fugiat placeat?</p>
                    <button>
                        Compra Agora
                    </button>
                </ProductDetails>
        </ProductContainer>
    )
}