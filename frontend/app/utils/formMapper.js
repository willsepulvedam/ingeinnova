/**
 * Mapea los datos del formulario de 4 pasos al payload que espera el backend
 * FormData -> { nom_proyecto, descripcion, sector, estado_madurez, tipo_cliente_aspirado, emprendedor, detalles }
 */
export function mapFormToPayload(formData) {
    if (!formData.personas || formData.personas.length === 0) {
      throw new Error('Debe haber al menos una persona registrada')
    }
  
    // La primera persona es el emprendedor líder
    const persona = formData.personas[0]
  
    // Mapear emprendedor
    const telefonoRaw = String(persona.telefono || '').trim()
    const numericPhone = telefonoRaw.replace(/\D/g, '')
    const normalizedPhone = numericPhone.startsWith('57')
      ? `+${numericPhone}`
      : `+57${numericPhone}`

    const emprendedor = {
      categoria: persona.categoria || 'Estudiante',
      nom_completo: persona.nombre_completo.trim(),
      email: persona.correo.trim(),
      telefono: normalizedPhone,
      sexo: persona.sexo || 'Otro',
      edad: parseInt(formData.edad, 10) || 0,
      barrio: persona.barrio.trim() || 'N/A',
      localidad: persona.localidad || '1 Localidad Histórica y del Caribe Norte',
      cedula: persona.cedula.trim(),
      tipo_vinculo: persona.tipo_vinculo || 'Estudiante',
      inf_academica: {
        semestre: formData.semestre || '1',
        programa: formData.programa || 'Otro',
        jornada: formData.jornada || 'Diurna',
        ano_graduacion: formData.año_graduacion || null,
      },
      es_emprendedor: true,
      interes_emprender: formData.interes_emprender ? 'Sí' : 'No',
      password: persona.cedula, // Usa la cédula como contraseña inicial
    }
  
    // Mapear detalles del emprendimiento
    const detalles = {
      constituida_legalmente: formData.empresa_constituida || 'No',
      nit_empresa: formData.nit_empresa || null,
      tiene_rut: formData.tiene_rut || 'No tiene',
      tiene_cvlac: formData.cvlac === 'Sí',
      tiempo_existencia: formData.tiempo_emprendimiento || 'Menos de 1 año',
      cantidad_trabajadores: formData.cantidad_trabajadores || '1-3', // CAMBIO: Ahora toma el valor real del form
      tipo_negocio: formData.tipo_negocio_tipo || 'Producto masivo', // CAMBIO CRITICAL: Antes usaba tipo_emprendimiento!
      sector_economico: formData.sector_economico || 'Otro', // CAMBIO: Fallback cambiado a 'Otro'
      es_familiar: formData.familiar || 'No',
      familia_tiene_empresa: formData.empresa_familia || 'No',
      empresa_familia_legal: formData.empresa_familia_legal || 'No',
      historial_quiebra: formData.historial_quiebra || false, // CAMBIO: Toma el valor real del form
      redes_sociales: formData.redes_sociales || null,
    }
  
    // Mapear emprendimiento principal
    const payload = {
      nom_proyecto: formData.nombre_emprendimiento.trim(),
      descripcion: formData.descripcion_emprendimiento.trim(),
      sector: formData.sector_economico || 'Otro',
      estado_madurez: formData.tipo_emprendimiento || 'Idea / Proyecto',
      tipo_cliente_aspirado: formData.tipo_cliente_aspirado || 'B2C - Consumidor Final (Personas)', // CAMBIO: Ahora toma el valor real del form
      redes_sociales: formData.redes_sociales || null,
      sitio_web: null,
      emprendedor,
      detalles,
      integrantes_ids: [], // Por ahora vacío, se pueden agregar después
    }
  
    return payload
  }