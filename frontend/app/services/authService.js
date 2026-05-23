const USUARIOS_KEY = 'ingeinnova_usuarios'
const SESSION_KEY = 'ingeinnova_session'

const ADMIN_USER = 'admin'
const ADMIN_PASSWORD = 'admincontraseña'

function getUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(USUARIOS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios))
}

export function validarFormatoCedula(cedula) {
  return /^\d{6,12}$/.test(String(cedula).replace(/\s/g, ''))
}

export function registrarUsuariosDesdeInscripcion(personas, emprendimientoId, propietarioId) {
  const usuarios = getUsuarios()

  personas.forEach((persona) => {
    const cedula = persona.cedula?.trim()
    if (!cedula) return

    const existente = usuarios.findIndex((u) => u.cedula === cedula)
    const registro = {
      cedula,
      nombre: persona.nombre_completo?.trim() ?? '',
      correo: persona.correo?.trim() ?? '',
      emprendimientoId,
      propietarioId,
    }

    if (existente >= 0) {
      usuarios[existente] = { ...usuarios[existente], ...registro }
    } else {
      usuarios.push(registro)
    }
  })

  guardarUsuarios(usuarios)
}

function guardarSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function loginAdmin() {
  const session = {
    role: 'admin',
    nombre: 'Administrador',
    usuario: ADMIN_USER,
  }
  guardarSession(session)
  return session
}

function loginEmprendedor(cedulaUsuario, cedulaPassword) {
  const usuario = String(cedulaUsuario).trim()
  const password = String(cedulaPassword).trim()

  if (!usuario || !password) {
    throw new Error('Ingresa tu número de cédula en ambos campos')
  }

  if (!validarFormatoCedula(usuario)) {
    throw new Error('Ingresa una cédula válida (solo números, 6 a 12 dígitos)')
  }

  if (usuario !== password) {
    throw new Error('El usuario y la contraseña deben ser el mismo número de cédula')
  }

  const cuenta = getUsuarios().find((u) => u.cedula === usuario)
  if (!cuenta) {
    throw new Error('Cédula no registrada. Completa la inscripción antes de iniciar sesión.')
  }

  const session = {
    role: 'emprendedor',
    cedula: cuenta.cedula,
    nombre: cuenta.nombre,
    emprendimientoId: cuenta.emprendimientoId,
    propietarioId: cuenta.propietarioId,
  }

  guardarSession(session)
  if (cuenta.propietarioId) {
    localStorage.setItem('propietario_id', cuenta.propietarioId)
  }

  return session
}

/**
 * Inicio de sesión unificado: admin o emprendedor por cédula.
 */
export function login(usuario, password) {
  const u = String(usuario).trim()
  const p = String(password)

  if (u === ADMIN_USER) {
    if (p !== ADMIN_PASSWORD) {
      throw new Error('Contraseña de administrador incorrecta')
    }
    return loginAdmin()
  }

  return loginEmprendedor(u, p)
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return getSession() !== null
}

export function isAdmin() {
  return getSession()?.role === 'admin'
}

export function isEmprendedor() {
  return getSession()?.role === 'emprendedor'
}
