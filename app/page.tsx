import Navigation from './components/Navigation'
import Card from './components/Card'

export default function Home() {
  const featuredCards = [
    {
      title: 'Open Papers',
      description: 'Papers and frameworks on open source community building, developer relations, and collaborative developer experience.',
      link: '/papers',
    },
    {
      title: 'Writing',
      description: 'Poetry, essays, and prose exploring themes of collaboration, technology, and human connection.',
      link: '/writing',
    },
    {
      title: 'CV',
      description: 'Professional experience in open source community building and developer relations.',
      link: '/cv',
    },
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen flex flex-col items-center p-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-neutral-800 mb-4">
              Karsten Wade
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Collaborative Experience Consulting
            </p>
            <p className="text-neutral-500 mb-8">
              Building communities and enabling collaboration through open source principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCards.map((card) => (
              <Card
                key={card.link}
                title={card.title}
                description={card.description}
                link={card.link}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
