function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Emprende,
                <span className="text-blue-600"> Innova,</span>
                <span className="text-orange-500"> Crece</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                En Ingeinnova transformamos tus ideas en empresas exitosas. Acompañamos emprendimientos seleccionados a través de 4 fases de desarrollo intensivo.
              </p>
              <div className="flex gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition">
                  Comenzar Ahora
                </button>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold transition">
                  Saber Más
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30"></div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop" 
                alt="Emprendedores" 
                className="relative w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="group">
              <div className="bg-blue-50 p-8 rounded-2xl hover:shadow-lg transition h-full">
                <div className="w-14 h-14 bg-blue-600 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
                <p className="text-gray-700 leading-relaxed">
                  Impulsar la innovación y el emprendimiento, transformando ideas brillantes en empresas sostenibles que generen impacto positivo en la sociedad.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="group">
              <div className="bg-orange-50 p-8 rounded-2xl hover:shadow-lg transition h-full">
                <div className="w-14 h-14 bg-orange-500 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl">🚀</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ser el ecosistema de emprendimiento más confiable e inclusivo, creando oportunidades para que emprendedores se conviertan en líderes empresariales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Por qué elegir Ingeinnova</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Acompañamiento integral a través de 4 fases estructuradas diseñadas para el éxito
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { number: '1', title: 'Mentoría', desc: 'Expertos en negocio' },
              { number: '2', title: 'Talleres', desc: 'Formación práctica' },
              { number: '3', title: 'Networking', desc: 'Conexiones valiosas' },
              { number: '4', title: 'Recursos', desc: 'Herramientas necesarias' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl text-center hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">¿Listo para transformar tu idea en realidad?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Únete a nuestra comunidad de emprendedores y accede a las herramientas, mentoría y red de contactos que necesitas.
          </p>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition">
            Solicitar Participación
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home