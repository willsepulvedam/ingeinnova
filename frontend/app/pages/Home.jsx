import { H1, H2, H3, H4, Subtitle, BodyText } from '../components/Typography'
import { ButtonPrimary, ButtonSecondary } from '../components/Button'
import { Card, CardHighlight, CardBody } from '../components/Card'

function Home() {
  const features = [
    { number: '1', title: 'Mentoría', desc: 'Expertos en negocio guiando tu camino' },
    { number: '2', title: 'Talleres', desc: 'Formación práctica y actualizada' },
    { number: '3', title: 'Networking', desc: 'Conexiones valiosas con emprendedores' },
    { number: '4', title: 'Recursos', desc: 'Herramientas necesarias para el éxito' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <H1 className="mb-6">
                Emprende,
                <span className="text-blue-600"> Innova,</span>
                <span className="text-orange-500"> Crece</span>
              </H1>
              <Subtitle className="mb-8 text-gray-700">
                En Ingeinnova transformamos tus ideas en empresas exitosas. Acompañamos 
                emprendimientos seleccionados a través de 4 fases de desarrollo intensivo.
              </Subtitle>
              <div className="flex flex-col sm:flex-row gap-4">
                <ButtonPrimary>Comenzar Ahora</ButtonPrimary>
                <ButtonSecondary>Saber Más</ButtonSecondary>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl overflow-hidden h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <p className="text-gray-700 font-semibold">Imagen de emprendimiento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <CardHighlight className="border-l-4 border-blue-600 p-8 rounded-xl">
              <CardBody className="p-0">
                <div className="w-14 h-14 bg-blue-600 rounded-lg mb-6 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <H3 className="mb-4">Nuestra Misión</H3>
                <BodyText className="text-gray-700">
                  Impulsar la innovación y el emprendimiento, transformando ideas brillantes 
                  en empresas sostenibles que generen impacto positivo en la sociedad.
                </BodyText>
              </CardBody>
            </CardHighlight>

            {/* Vision */}
            <CardHighlight className="border-l-4 border-orange-500 p-8 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100">
              <CardBody className="p-0">
                <div className="w-14 h-14 bg-orange-500 rounded-lg mb-6 flex items-center justify-center text-2xl">
                  🌟
                </div>
                <H3 className="mb-4">Nuestra Visión</H3>
                <BodyText className="text-gray-700">
                  Ser el ecosistema de emprendimiento más confiable e inclusivo, creando 
                  oportunidades para que emprendedores se conviertan en líderes empresariales.
                </BodyText>
              </CardBody>
            </CardHighlight>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <H2 className="mb-4">Por qué elegir Ingeinnova</H2>
            <Subtitle className="text-gray-600 max-w-2xl mx-auto">
              Acompañamiento integral a través de 4 fases estructuradas diseñadas para el éxito
            </Subtitle>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="bg-white p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {feature.number}
                </div>
                <H4 className="mb-2">{feature.title}</H4>
                <BodyText className="text-gray-600">{feature.desc}</BodyText>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <H2 className="text-white mb-6">¿Listo para transformar tu idea en realidad?</H2>
          <Subtitle className="text-white max-w-2xl mx-auto mb-8">
            Únete a nuestra comunidad de emprendedores y accede a las herramientas, 
            mentoría y red de contactos que necesitas.
          </Subtitle>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-200 active:scale-95">
            Solicitar Participación
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home