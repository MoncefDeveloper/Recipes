import { createClient } from 'contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Image from 'next/image'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
})

export const getStaticPaths = async () => {
  const res = await client.getEntries({
    content_type: "recipe"
  })

  const paths = res.items.map(item => {
    return {
      params: { slog: item.fields.slug },

    }
  })

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  const { items } = await client.getEntries({
    content_type: 'recipe',
    'fields.slug': params.slog
  })

  return {
    props: { recipe: items[0] }
  }

}

export default function RecipeDetails({ recipe }) {
  const { featuredImage, title, cookingTime, ingredients, method } = recipe.fields

  return (
    <div>
      <div className="banner">
        <Image
          src={'https:' + featuredImage.fields.file.url}
          alt='img'
          width={featuredImage.fields.file.details.image.width}
          height={featuredImage.fields.file.details.image.height}
          objectFit={'cover'}
        />
        <h2>{title}</h2>
      </div>

      <div className="info">
        <p>Takes about {cookingTime} mins to cook.</p>
        <h3>Ingredients:</h3>

        {ingredients.map(ing => (
          <span className='box' key={ing}>{ing}</span>
        ))}
      </div>

      <div className="method">
        <h3>Method:</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>

      <style jsx>{`
        h2,h3 {
          text-transform: uppercase;
        }
        .banner  {
          display: flex;
          justify-content: center;
          flex-direction: column;
        }
        .banner h2 {
          margin: 0;
          background: #fff;          
          padding: 20px;
          position: relative;
          width: max-content;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
        }
      
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
        .banner .box{
          margin: 0;
          background: #fff;          
          padding: 20px;
          position: relative;
          width: max-content;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  )
}