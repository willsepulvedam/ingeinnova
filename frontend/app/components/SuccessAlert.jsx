import { ButtonPrimary } from './Button'
import Modal from './Modal'

export default function SuccessAlert({ onIrALogin }) {
  return (
    <Modal open onClose={onIrALogin} size="sm" align="center" zIndex={50} ariaLabel="Registro exitoso">
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-3xl animate-pop-in">
          ✓
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 animate-fade-in-up">
          ¡Registro exitoso!
        </h2>
        <p className="text-gray-600 mb-4 animate-fade-in-up stagger-1">
          El emprendimiento fue registrado correctamente.
        </p>
        <div className="text-left bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-gray-700 animate-fade-in-up stagger-2">
          <p className="font-semibold text-gray-900 mb-2">Para ingresar a tu panel:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>
              Usa tu <strong>número de cédula</strong> como usuario
            </li>
            <li>
              Usa el <strong>mismo número de cédula</strong> como contraseña
            </li>
          </ul>
        </div>
        <ButtonPrimary className="w-full animate-fade-in-up stagger-3" onClick={onIrALogin}>
          Ir a iniciar sesión
        </ButtonPrimary>
      </div>
    </Modal>
  )
}
